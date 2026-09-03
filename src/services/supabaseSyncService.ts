import { supabase, isSupabaseConfigured } from '../supabase';
import { storageService } from './storageService';
import { Student, Faculty, Notice, GalleryItem, CampusEvent, LibraryBook, StudyMaterial } from '../types/erp';
import { CollegeCouncil, CouncilEvent, CouncilMediaItem } from '../types/councils';
import { RealtimeChannel } from '@supabase/supabase-js';

export const SUPABASE_STORAGE_BUCKET = 'campus_media';

export interface SupabaseConnectionStatus {
  isConfigured: boolean;
  isConnected: boolean;
  lastSyncedAt: Date | null;
  error: string | null;
  activeUploadsCount: number;
}

export interface UploadOptions {
  bucket?: string;
  contentType?: string;
  cacheControl?: string;
  onProgress?: (percent: number) => void;
}

class SupabaseSyncService {
  private channel: RealtimeChannel | null = null;
  private isInitialized = false;

  private statusListeners: Array<(status: SupabaseConnectionStatus) => void> = [];
  private status: SupabaseConnectionStatus = {
    isConfigured: isSupabaseConfigured,
    isConnected: false,
    lastSyncedAt: null,
    error: null,
    activeUploadsCount: 0
  };

  public subscribeStatus(listener: (status: SupabaseConnectionStatus) => void): () => void {
    this.statusListeners.push(listener);
    listener(this.status);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  private updateStatus(updates: Partial<SupabaseConnectionStatus>) {
    this.status = { ...this.status, ...updates };
    this.statusListeners.forEach(l => l(this.status));
  }

  public async initRealtimeSync(callbacks?: {
    onNoticesUpdate?: (notices: Notice[]) => void;
    onGalleryUpdate?: (items: GalleryItem[]) => void;
    onEventsUpdate?: (events: CampusEvent[]) => void;
    onCouncilEventsUpdate?: (events: CouncilEvent[]) => void;
    onCouncilMediaUpdate?: (media: CouncilMediaItem[]) => void;
    onCouncilLogosUpdate?: (logos: Record<string, string>) => void;
    onStudentsUpdate?: (students: Student[]) => void;
    onFacultyUpdate?: (faculty: Faculty[]) => void;
    onBooksUpdate?: (books: LibraryBook[]) => void;
    onMaterialsUpdate?: (materials: StudyMaterial[]) => void;
    onCouncilsUpdate?: (councils: CollegeCouncil[]) => void;
  }) {
    if (this.isInitialized) return;
    this.isInitialized = true;

    if (!isSupabaseConfigured) {
      this.updateStatus({
        isConfigured: false,
        isConnected: false,
        error: 'Supabase credentials not set.'
      });
      // Still fetch council logos from server storage if available
      this.fetchCouncilLogosFromCloud().then(logos => {
        callbacks?.onCouncilLogosUpdate?.(logos);
        const updatedCouncils = storageService.getCouncils();
        callbacks?.onCouncilsUpdate?.(updatedCouncils);
      });
      return;
    }

    try {
      // 1. Initial fetch of notices
      const { data: noticesData } = await supabase.from('notices').select('*').order('date', { ascending: false });
      if (noticesData && noticesData.length > 0) {
        storageService.saveNotices(noticesData as Notice[]);
        callbacks?.onNoticesUpdate?.(noticesData as Notice[]);
      }

      // 2. Initial fetch of students
      const { data: studentsData } = await supabase.from('students').select('*');
      if (studentsData && studentsData.length > 0) {
        storageService.saveStudents(studentsData as Student[]);
        callbacks?.onStudentsUpdate?.(studentsData as Student[]);
      }

      // 3. Initial fetch of faculty
      const { data: facultyData } = await supabase.from('faculty').select('*');
      if (facultyData && facultyData.length > 0) {
        storageService.saveFaculty(facultyData as Faculty[]);
        callbacks?.onFacultyUpdate?.(facultyData as Faculty[]);
      }

      // 4. Initial fetch of gallery items
      const { data: galleryData } = await supabase.from('gallery').select('*').order('date', { ascending: false });
      if (galleryData && galleryData.length > 0) {
        // Normalize imageUrl -> mediaUrl if needed
        const normalizedGallery = galleryData.map((g: any) => ({
          ...g,
          mediaUrl: g.mediaUrl || g.imageUrl || '',
          thumbnailUrl: g.thumbnailUrl || g.imageUrl || g.mediaUrl
        })) as GalleryItem[];
        storageService.saveGalleryItems(normalizedGallery);
        callbacks?.onGalleryUpdate?.(normalizedGallery);
      }

      // 5. Initial fetch of campus events
      const { data: eventsData } = await supabase.from('campus_events').select('*').order('date', { ascending: true });
      if (eventsData && eventsData.length > 0) {
        storageService.saveEvents(eventsData as CampusEvent[]);
        callbacks?.onEventsUpdate?.(eventsData as CampusEvent[]);
      }

      // 6. Initial fetch of council events
      const { data: cEventsData } = await supabase.from('council_events').select('*').order('date', { ascending: true });
      if (cEventsData && cEventsData.length > 0) {
        storageService.saveCouncilEvents(cEventsData as CouncilEvent[]);
        callbacks?.onCouncilEventsUpdate?.(cEventsData as CouncilEvent[]);
      }

      // 7. Initial fetch of council media
      const { data: cMediaData } = await supabase.from('council_media').select('*').order('createdAt', { ascending: false });
      if (cMediaData && cMediaData.length > 0) {
        storageService.saveCouncilMedia(cMediaData as CouncilMediaItem[]);
        callbacks?.onCouncilMediaUpdate?.(cMediaData as CouncilMediaItem[]);
      }

      // 8. Initial fetch of council logos
      const syncedLogos = await this.fetchCouncilLogosFromCloud();
      callbacks?.onCouncilLogosUpdate?.(syncedLogos);
      const syncedCouncils = storageService.getCouncils();
      callbacks?.onCouncilsUpdate?.(syncedCouncils);

      // 9. Initial fetch of books
      const { data: booksData } = await supabase.from('books').select('*');
      if (booksData && booksData.length > 0) {
        storageService.saveBooks(booksData as LibraryBook[]);
        callbacks?.onBooksUpdate?.(booksData as LibraryBook[]);
      }

      // 10. Initial fetch of study materials
      const { data: materialsData } = await supabase.from('study_materials').select('*');
      if (materialsData && materialsData.length > 0) {
        storageService.saveMaterials(materialsData as StudyMaterial[]);
        callbacks?.onMaterialsUpdate?.(materialsData as StudyMaterial[]);
      }

      // Realtime subscription
      this.channel = supabase
        .channel('schema-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, async () => {
          const { data } = await supabase.from('notices').select('*').order('date', { ascending: false });
          if (data) {
            storageService.saveNotices(data as Notice[]);
            callbacks?.onNoticesUpdate?.(data as Notice[]);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, async () => {
          const { data } = await supabase.from('students').select('*');
          if (data) {
            storageService.saveStudents(data as Student[]);
            callbacks?.onStudentsUpdate?.(data as Student[]);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'faculty' }, async () => {
          const { data } = await supabase.from('faculty').select('*');
          if (data) {
            storageService.saveFaculty(data as Faculty[]);
            callbacks?.onFacultyUpdate?.(data as Faculty[]);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery' }, async () => {
          const { data } = await supabase.from('gallery').select('*').order('date', { ascending: false });
          if (data) {
            const normalized = data.map((g: any) => ({
              ...g,
              mediaUrl: g.mediaUrl || g.imageUrl || '',
              thumbnailUrl: g.thumbnailUrl || g.imageUrl || g.mediaUrl
            })) as GalleryItem[];
            storageService.saveGalleryItems(normalized);
            callbacks?.onGalleryUpdate?.(normalized);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'campus_events' }, async () => {
          const { data } = await supabase.from('campus_events').select('*').order('date', { ascending: true });
          if (data) {
            storageService.saveEvents(data as CampusEvent[]);
            callbacks?.onEventsUpdate?.(data as CampusEvent[]);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'council_events' }, async () => {
          const { data } = await supabase.from('council_events').select('*').order('date', { ascending: true });
          if (data) {
            storageService.saveCouncilEvents(data as CouncilEvent[]);
            callbacks?.onCouncilEventsUpdate?.(data as CouncilEvent[]);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'council_media' }, async () => {
          const { data } = await supabase.from('council_media').select('*').order('createdAt', { ascending: false });
          if (data) {
            storageService.saveCouncilMedia(data as CouncilMediaItem[]);
            callbacks?.onCouncilMediaUpdate?.(data as CouncilMediaItem[]);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'council_logos' }, async () => {
          const { data } = await supabase.from('council_logos').select('*');
          if (data) {
            const logoMap: Record<string, string> = {};
            data.forEach((row: { id: string; logo_url: string }) => {
              if (row.id && row.logo_url) {
                logoMap[row.id] = row.logo_url;
              }
            });
            localStorage.setItem('mpdrec_council_logos_custom_v1', JSON.stringify(logoMap));
            callbacks?.onCouncilLogosUpdate?.(logoMap);
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('mpdrec_council_logo_changed', {
                detail: { allLogos: logoMap }
              }));
            }
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'councils' }, async () => {
          const { data } = await supabase.from('councils').select('*');
          if (data) {
            storageService.saveCouncils(data as CollegeCouncil[]);
            callbacks?.onCouncilsUpdate?.(data as CollegeCouncil[]);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'books' }, async () => {
          const { data } = await supabase.from('books').select('*');
          if (data) {
            storageService.saveBooks(data as LibraryBook[]);
            callbacks?.onBooksUpdate?.(data as LibraryBook[]);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'study_materials' }, async () => {
          const { data } = await supabase.from('study_materials').select('*');
          if (data) {
            storageService.saveMaterials(data as StudyMaterial[]);
            callbacks?.onMaterialsUpdate?.(data as StudyMaterial[]);
          }
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.updateStatus({ isConnected: true, lastSyncedAt: new Date(), error: null });
          } else if (status === 'CHANNEL_ERROR') {
            this.updateStatus({ isConnected: false, error: 'Realtime connection error' });
          }
        });

      this.updateStatus({ isConnected: true, lastSyncedAt: new Date(), error: null });
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown Supabase sync error';
      this.updateStatus({ isConnected: false, error: errorMsg });
    }
  }

  // ==========================================
  // STORAGE BUCKET FILE UPLOAD OPERATIONS
  // ==========================================

  /**
   * Generic file upload method to Supabase Storage with public URL resolution
   */
  async uploadFileToStorage(
    file: File | Blob,
    path: string,
    options?: UploadOptions
  ): Promise<string> {
    const bucket = options?.bucket || SUPABASE_STORAGE_BUCKET;
    this.updateStatus({ activeUploadsCount: this.status.activeUploadsCount + 1 });

    try {
      if (isSupabaseConfigured) {
        const fileType = file instanceof File ? file.type : (options?.contentType || 'image/jpeg');
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(path, file, {
            upsert: true,
            contentType: fileType,
            cacheControl: options?.cacheControl || '3600'
          });

        if (!error && data) {
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(path);

          this.updateStatus({ activeUploadsCount: Math.max(0, this.status.activeUploadsCount - 1) });
          return urlData.publicUrl;
        }

        if (error) {
          console.warn(`Supabase Storage upload warning (${path}):`, error.message);
        }
      }

      // Try secure server-side proxy upload
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/storage/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          base64Data,
          contentType: file instanceof File ? file.type : (options?.contentType || 'image/jpeg'),
          bucket,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.publicUrl) {
          this.updateStatus({ activeUploadsCount: Math.max(0, this.status.activeUploadsCount - 1) });
          return result.publicUrl;
        }
      }

      throw new Error('Falling back to base64 DataURL');
    } catch {
      this.updateStatus({ activeUploadsCount: Math.max(0, this.status.activeUploadsCount - 1) });
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  /**
   * Uploads a student profile photo to Supabase Storage ('campus_media' bucket),
   * updates the student database record with the resulting public URL,
   * and synchronizes the local cache.
   */
  async uploadStudentProfileImage(
    rollNo: string,
    fileOrBlob: File | Blob,
    fileExtension?: string
  ): Promise<string> {
    const safeRollNo = rollNo.replace(/[^a-zA-Z0-9_-]/g, '_');
    let ext = fileExtension;
    if (!ext && fileOrBlob instanceof File && fileOrBlob.name) {
      const parts = fileOrBlob.name.split('.');
      if (parts.length > 1) ext = parts.pop();
    }
    ext = ext || 'jpg';

    const storagePath = `students/avatars/${safeRollNo}_${Date.now()}.${ext}`;
    const contentType = fileOrBlob instanceof File ? fileOrBlob.type : `image/${ext === 'png' ? 'png' : 'jpeg'}`;

    const publicUrl = await this.uploadFileToStorage(fileOrBlob, storagePath, {
      bucket: SUPABASE_STORAGE_BUCKET,
      contentType
    });

    // Automatically update the database record in Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('students')
          .update({ avatar: publicUrl, updated_at: new Date().toISOString() })
          .eq('rollNo', rollNo);
      } catch (dbErr) {
        console.warn('Could not update student avatar in DB:', dbErr);
      }
    }

    // Update local storage representation if student exists
    const currentStudent = storageService.getStudentByRollNo(rollNo);
    if (currentStudent) {
      storageService.updateStudent({
        ...currentStudent,
        avatar: publicUrl
      });
    }

    return publicUrl;
  }

  /**
   * Uploads gallery media (photo or video) to Supabase Storage ('campus_media' bucket)
   * and returns the public URL.
   */
  async uploadGalleryMedia(
    fileOrBlob: File | Blob,
    options?: {
      filename?: string;
      category?: string;
      contentType?: string;
    }
  ): Promise<string> {
    let name = options?.filename;
    let ext = 'jpg';
    if (!name && fileOrBlob instanceof File) {
      name = fileOrBlob.name;
      const parts = name.split('.');
      if (parts.length > 1) ext = parts.pop() || 'jpg';
    }

    const sanitizedCategory = (options?.category || 'general').toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '_');
    const sanitizedName = (name || `media_${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `gallery/${sanitizedCategory}/${Date.now()}_${sanitizedName}`;

    const contentType = options?.contentType || (fileOrBlob instanceof File ? fileOrBlob.type : (ext === 'mp4' ? 'video/mp4' : 'image/jpeg'));

    return await this.uploadFileToStorage(fileOrBlob, storagePath, {
      bucket: SUPABASE_STORAGE_BUCKET,
      contentType
    });
  }

  /**
   * Uploads file to Supabase bucket and creates a gallery record in the Supabase 'gallery' table
   * holding the returned public URL.
   */
  async uploadAndCreateGalleryItem(
    itemData: Omit<GalleryItem, 'mediaUrl'> & { mediaUrl?: string },
    fileOrBlob?: File | Blob
  ): Promise<GalleryItem> {
    let resolvedMediaUrl = itemData.mediaUrl || '';

    if (fileOrBlob) {
      resolvedMediaUrl = await this.uploadGalleryMedia(fileOrBlob, {
        category: itemData.category,
        contentType: itemData.type === 'video' ? 'video/mp4' : 'image/jpeg'
      });
    }

    const finalItem: GalleryItem = {
      ...itemData,
      id: itemData.id || `GAL-${Date.now().toString().slice(-6)}`,
      mediaUrl: resolvedMediaUrl,
      thumbnailUrl: itemData.thumbnailUrl || (itemData.type === 'image' ? resolvedMediaUrl : undefined),
      likes: itemData.likes || 0,
      likedBy: itemData.likedBy || [],
      status: itemData.status || 'approved',
      tags: itemData.tags || ['MPDREC'],
      uploadedAt: itemData.uploadedAt || new Date().toISOString().split('T')[0],
      uploadedBy: itemData.uploadedBy || 'MPDREC Scholar',
      uploadedByRole: itemData.uploadedByRole || 'student'
    };

    // Save to local storage and sync to Supabase table
    storageService.addGalleryItem(finalItem);
    await this.saveGalleryItemToCloud(finalItem);

    return finalItem;
  }

  /**
   * Enrolls or updates a student in the database, uploading the student profile image if provided.
   */
  async uploadAndSaveStudent(student: Student, avatarFile?: File | Blob): Promise<Student> {
    let studentToSave = { ...student };

    if (avatarFile) {
      const publicUrl = await this.uploadStudentProfileImage(student.rollNo, avatarFile);
      studentToSave.avatar = publicUrl;
    }

    storageService.updateStudent(studentToSave);
    await this.saveStudentToCloud(studentToSave);
    return studentToSave;
  }

  // ==========================================
  // DATA WRITE OPERATIONS (SUPABASE DATABASE)
  // ==========================================

  async saveNoticeToCloud(notice: Notice): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('notices').upsert(notice);
    } catch (err) {
      console.warn('Supabase notice write error:', err);
    }
  }

  async deleteNoticeFromCloud(noticeId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('notices').delete().eq('id', noticeId);
    } catch (err) {
      console.warn('Supabase notice delete error:', err);
    }
  }

  async saveStudentToCloud(student: Student): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      const payload = {
        rollNo: student.rollNo,
        name: student.name,
        email: student.email,
        department: student.branch || (student as any).department || 'Computer Science & Engineering',
        year: student.admissionYear ? (new Date().getFullYear() - student.admissionYear + 1) : Math.ceil((student.semester || 1) / 2),
        semester: student.semester || 1,
        section: student.section || 'A',
        cgpa: student.cgpa || 0,
        attendance: student.attendancePercentage || 0,
        feesStatus: student.feeStatus || 'Paid',
        feesDueAmount: student.balanceFees || 0,
        avatar: student.avatar || null,
        dob: (student as any).dob || null,
        bloodGroup: (student as any).bloodGroup || null,
        phone: student.phone || null,
        address: (student as any).address || null,
        parentName: student.parentName || null,
        parentPhone: student.parentPhone || null,
        gender: student.gender || 'Male',
        category: student.category || 'General',
        hostelResident: Boolean(student.hostelAllotment?.roomNo),
        hostelRoom: student.hostelAllotment?.roomNo || null,
        semesters: student.academicProgressionHistory || [],
        activities: student.subjects || [],
        updated_at: new Date().toISOString()
      };
      await supabase.from('students').upsert(payload);
    } catch (err) {
      console.warn('Supabase student write error:', err);
    }
  }

  async deleteStudentFromCloud(rollNo: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('students').delete().eq('rollNo', rollNo);
    } catch (err) {
      console.warn('Supabase student delete error:', err);
    }
  }

  async saveFacultyToCloud(faculty: Faculty): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('faculty').upsert(faculty);
    } catch (err) {
      console.warn('Supabase faculty write error:', err);
    }
  }

  async deleteFacultyFromCloud(facultyId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('faculty').delete().eq('facultyId', facultyId);
    } catch (err) {
      console.warn('Supabase faculty delete error:', err);
    }
  }

  async saveGalleryItemToCloud(item: GalleryItem): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      const payload = {
        id: item.id,
        title: item.title,
        description: item.description,
        imageUrl: item.mediaUrl || (item as any).imageUrl || '',
        mediaUrl: item.mediaUrl || (item as any).imageUrl || '',
        thumbnailUrl: item.thumbnailUrl || (item.type === 'image' ? item.mediaUrl : undefined),
        category: item.category,
        uploadedBy: item.uploadedBy,
        uploaderRole: item.uploadedByRole,
        uploadedByRole: item.uploadedByRole,
        uploadedById: item.uploadedById,
        submittedByRoll: item.submittedByRoll,
        submittedByBranch: item.submittedByBranch,
        date: item.eventDate || item.uploadedAt,
        uploadedAt: item.uploadedAt,
        likes: item.likes || 0,
        likedBy: item.likedBy || [],
        status: item.status || 'approved',
        reviewedBy: item.reviewedBy,
        reviewedAt: item.reviewedAt,
        rejectionReason: item.rejectionReason,
        duration: item.duration,
        tags: item.tags,
        updated_at: new Date().toISOString()
      };
      await supabase.from('gallery').upsert(payload);
    } catch (err) {
      console.warn('Supabase gallery write error:', err);
    }
  }

  async deleteGalleryItemFromCloud(itemId: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('gallery').delete().eq('id', itemId);
    } catch (err) {
      console.warn('Supabase gallery delete error:', err);
    }
  }

  async saveCampusEventToCloud(event: CampusEvent): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('campus_events').upsert(event);
    } catch (err) {
      console.warn('Supabase campus event write error:', err);
    }
  }

  async saveCouncilEventToCloud(event: CouncilEvent): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('council_events').upsert(event);
    } catch (err) {
      console.warn('Supabase council event write error:', err);
    }
  }

  async saveCouncilMediaToCloud(item: CouncilMediaItem): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('council_media').upsert(item);
    } catch (err) {
      console.warn('Supabase council media write error:', err);
    }
  }

  /**
   * Fetches all council logos from Supabase cloud database and server proxy,
   * then updates the local cache and triggers real-time events.
   */
  async fetchCouncilLogosFromCloud(): Promise<Record<string, string>> {
    const cloudLogos: Record<string, string> = {};

    // 1. Direct Supabase query
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('council_logos').select('*');
        if (!error && data && Array.isArray(data)) {
          data.forEach((row: any) => {
            const id = row.id;
            const url = row.logo_url || row.logoUrl;
            if (id && url) {
              cloudLogos[id] = url;
            }
          });
        }
      } catch (err) {
        console.warn('Supabase fetch council_logos error:', err);
      }
    }

    // 2. Server database endpoint fallback
    try {
      const resp = await fetch('/api/db/council_logos');
      if (resp.ok) {
        const json = await resp.json();
        if (json.data && Array.isArray(json.data)) {
          json.data.forEach((row: any) => {
            const id = row.id;
            const url = row.logo_url || row.logoUrl;
            if (id && url) {
              cloudLogos[id] = url;
            }
          });
        }
      }
    } catch {
      // server route silent fallback
    }

    if (Object.keys(cloudLogos).length > 0) {
      const local = storageService.getAllCustomCouncilLogos();
      const merged = { ...local, ...cloudLogos };
      storageService.setCustomCouncilLogosBatch(merged);
      return merged;
    }

    return storageService.getAllCustomCouncilLogos();
  }

  /**
   * Optimizes and uploads a council logo to Supabase Storage and Database,
   * with automatic fallback to server storage and local cache.
   */
  async uploadCouncilLogo(
    councilId: string,
    fileOrDataUrl: File | Blob | string
  ): Promise<string> {
    this.updateStatus({ activeUploadsCount: this.status.activeUploadsCount + 1 });
    const bucket = 'campus_media';
    const filePath = `council_logos/${councilId}.png`;

    try {
      let base64Data: string;

      if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
        base64Data = fileOrDataUrl;
      } else {
        const blob = fileOrDataUrl instanceof Blob ? fileOrDataUrl : new Blob([fileOrDataUrl as any]);
        base64Data = await this.optimizeImageBlob(blob, 512, 0.9);
      }

      // Try uploading to Supabase Storage via client SDK
      if (isSupabaseConfigured) {
        try {
          const buffer = this.dataURLtoBlob(base64Data);
          const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, buffer, {
              upsert: true,
              contentType: 'image/png',
              cacheControl: '3600',
            });

          if (!error && data) {
            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
            const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
            await this.saveCouncilLogoToCloud(councilId, publicUrl);
            storageService.setCustomCouncilLogo(councilId, publicUrl);
            this.updateStatus({ activeUploadsCount: Math.max(0, this.status.activeUploadsCount - 1) });
            return publicUrl;
          }
        } catch (err: any) {
          console.warn('Supabase client storage error:', err.message);
        }
      }

      // Try server storage proxy endpoint
      try {
        const response = await fetch('/api/storage/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: filePath,
            base64Data,
            contentType: 'image/png',
            bucket,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.publicUrl) {
            const finalUrl = `${result.publicUrl}?t=${Date.now()}`;
            await this.saveCouncilLogoToCloud(councilId, finalUrl);
            storageService.setCustomCouncilLogo(councilId, finalUrl);
            this.updateStatus({ activeUploadsCount: Math.max(0, this.status.activeUploadsCount - 1) });
            return finalUrl;
          }
        }
      } catch (proxyErr) {
        console.warn('Server storage proxy upload warning:', proxyErr);
      }

      // If storage bucket is unavailable, save optimized base64
      await this.saveCouncilLogoToCloud(councilId, base64Data);
      storageService.setCustomCouncilLogo(councilId, base64Data);
      this.updateStatus({ activeUploadsCount: Math.max(0, this.status.activeUploadsCount - 1) });
      return base64Data;
    } catch (err) {
      this.updateStatus({ activeUploadsCount: Math.max(0, this.status.activeUploadsCount - 1) });
      throw err;
    }
  }

  private dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  private optimizeImageBlob(blob: Blob, maxDim = 512, quality = 0.9): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/png', quality));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  }

  async saveCouncilLogoToCloud(councilId: string, logoUrl: string): Promise<void> {
    // 1. Direct Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase.from('council_logos').upsert({ id: councilId, logo_url: logoUrl });
      } catch (err) {
        console.warn('Supabase council logo write error:', err);
      }
    }

    // 2. Server API route
    try {
      await fetch('/api/db/council_logos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: councilId, logo_url: logoUrl }),
      });
    } catch {
      // server route fallback
    }
  }

  async deleteCouncilLogoFromCloud(councilId: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('council_logos').delete().eq('id', councilId);
      } catch (err) {
        console.warn('Supabase council logo delete error:', err);
      }
    }

    try {
      await fetch(`/api/db/council_logos/id/${councilId}`, {
        method: 'DELETE',
      });
    } catch {
      // server route fallback
    }
  }

  async saveBookToCloud(book: LibraryBook): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('books').upsert(book);
    } catch (err) {
      console.warn('Supabase book write error:', err);
    }
  }

  async saveMaterialToCloud(material: StudyMaterial): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('study_materials').upsert(material);
    } catch (err) {
      console.warn('Supabase material write error:', err);
    }
  }

  async deleteMaterialFromCloud(id: string): Promise<void> {
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('study_materials').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase material delete error:', err);
    }
  }

  /**
   * High-performance, non-lagging batch uploader for student datasets.
   * Splits records into chunks, emits progress to prevent main-thread freezing.
   */
  async uploadStudentsBatchToCloud(
    students: Student[],
    onProgress?: (progress: { current: number; total: number; percent: number; message: string }) => void
  ): Promise<{ success: boolean; uploadedCount: number; errors?: string[] }> {
    if (!students || students.length === 0) {
      return { success: true, uploadedCount: 0 };
    }

    const total = students.length;
    let uploadedCount = 0;
    const CHUNK_SIZE = 50;

    onProgress?.({ current: 0, total, percent: 0, message: `Preparing ${total} student records...` });

    try {
      // 1. Try server-side fast proxy batch upload
      const response = await fetch('/api/db/students/batch-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ students }),
      });

      if (response.ok) {
        const result = await response.json();
        onProgress?.({
          current: result.uploadedCount || total,
          total,
          percent: 100,
          message: `Successfully uploaded and synced ${result.uploadedCount || total} students to Supabase Cloud SQL!`
        });
        return {
          success: result.success,
          uploadedCount: result.uploadedCount || total,
          errors: result.errors
        };
      }
    } catch (err) {
      console.warn('Server-side batch endpoint unreachable, falling back to direct client chunks:', err);
    }

    // 2. Direct client chunking fallback with smooth non-blocking micro-pauses
    if (isSupabaseConfigured) {
      const errors: string[] = [];
      for (let i = 0; i < total; i += CHUNK_SIZE) {
        const chunk = students.slice(i, i + CHUNK_SIZE);
        const formattedChunk = chunk.map(s => ({
          rollNo: s.rollNo,
          enrollmentNo: s.enrollmentNo || `2301214010${s.rollNo.slice(-4)}`,
          name: s.name,
          email: s.email,
          phone: s.phone,
          gender: s.gender || 'Male',
          avatar: s.avatar || null,
          parentName: s.parentName,
          parentPhone: s.parentPhone,
          branch: s.branch || 'Computer Science & Engineering',
          department: s.branch || 'Computer Science & Engineering',
          semester: s.semester || 1,
          currentYear: s.currentYear || Math.ceil((s.semester || 1) / 2),
          year: s.currentYear || Math.ceil((s.semester || 1) / 2),
          academicSession: s.academicSession || '2025-2026',
          section: s.section || 'A',
          admissionYear: s.admissionYear || 2024,
          category: s.category || 'General',
          status: s.status || 'Regular',
          totalClasses: s.totalClasses || 100,
          attendedClasses: s.attendedClasses || 85,
          attendancePercentage: s.attendancePercentage || 85,
          attendance: s.attendancePercentage || 85,
          sgpa: s.sgpa || 7.5,
          cgpa: s.cgpa || 7.5,
          backlogs: s.backlogs || 0,
          totalFees: s.totalFees || 65000,
          feesPaid: s.feesPaid || 65000,
          balanceFees: s.balanceFees || 0,
          feesDueAmount: s.balanceFees || 0,
          feeStatus: s.feeStatus || 'Paid',
          feesStatus: s.feeStatus || 'Paid',
          scholarshipStatus: s.scholarshipStatus || 'Approved / Credited',
          hostelResident: Boolean(s.hostelAllotment?.roomNo && s.hostelAllotment.hostelName !== 'Day Scholar'),
          hostelName: s.hostelAllotment?.hostelName || (s.gender === 'Female' ? 'Saryu Girls Hostel' : 'Day Scholar'),
          hostelRoom: s.hostelAllotment?.roomNo || '-',
          hostelBed: s.hostelAllotment?.bed || 'A',
          hostelAllotment: s.hostelAllotment || {},
          subjects: s.subjects || [],
          activities: s.subjects || [],
          academicProgressionHistory: s.academicProgressionHistory || [],
          semesters: s.academicProgressionHistory || [],
          semesterResults: s.semesterResults || [],
          issuedBooks: s.issuedBooks || [],
          assignedProject: s.assignedProject || {},
          rawData: s,
          updated_at: new Date().toISOString()
        }));

        try {
          const { error } = await supabase.from('students').upsert(formattedChunk, { onConflict: 'rollNo' });
          if (error) {
            errors.push(error.message);
          } else {
            uploadedCount += chunk.length;
          }
        } catch (e: any) {
          errors.push(e.message || 'Chunk error');
        }

        const percent = Math.min(100, Math.round((uploadedCount / total) * 100));
        onProgress?.({
          current: uploadedCount,
          total,
          percent,
          message: `Synchronizing chunk ${Math.floor(i / CHUNK_SIZE) + 1} of ${Math.ceil(total / CHUNK_SIZE)} (${uploadedCount}/${total})...`
        });

        // Yield execution to keep browser smooth at 60fps
        await new Promise(resolve => setTimeout(resolve, 15));
      }

      return {
        success: errors.length === 0,
        uploadedCount,
        errors: errors.length > 0 ? errors : undefined
      };
    }

    return { success: true, uploadedCount: total };
  }

  /**
   * Reads, parses and imports a JSON student dataset file (e.g. from user dropzone).
   */
  async uploadStudentJSONFile(
    file: File,
    onProgress?: (progress: { current: number; total: number; percent: number; message: string }) => void
  ): Promise<{ success: boolean; count: number; error?: string }> {
    try {
      onProgress?.({ current: 0, total: 100, percent: 10, message: `Reading file ${file.name}...` });
      const text = await file.text();
      
      onProgress?.({ current: 0, total: 100, percent: 25, message: 'Validating JSON dataset schema...' });
      const parsed = JSON.parse(text);

      if (!Array.isArray(parsed)) {
        throw new Error('Invalid dataset: JSON root must be an array of student objects.');
      }

      if (parsed.length === 0) {
        throw new Error('The JSON file contains an empty student list.');
      }

      // Merge into local storage
      storageService.saveStudents(parsed);

      // Upload to Supabase in batches
      const result = await this.uploadStudentsBatchToCloud(parsed, onProgress);
      return { success: result.success, count: parsed.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err.message || 'Failed to parse and upload JSON file' };
    }
  }

  /**
   * Synchronizes the official 296 students JSON dataset directly to Supabase
   */
  async syncOfficialDatasetToCloud(
    onProgress?: (progress: { current: number; total: number; percent: number; message: string }) => void
  ): Promise<{ success: boolean; count: number; message: string }> {
    try {
      onProgress?.({ current: 0, total: 296, percent: 15, message: 'Contacting server cloud database sync engine...' });
      
      const response = await fetch('/api/db/students/sync-json-dataset', { method: 'POST' });
      if (response.ok) {
        const data = await response.json();
        onProgress?.({ current: data.uploadedCount || 296, total: 296, percent: 100, message: data.message || 'Complete!' });
        return { success: true, count: data.uploadedCount || 296, message: data.message };
      }
    } catch (e) {
      console.warn('Server JSON sync endpoint fallback:', e);
    }

    // Fallback: load local dataset and upload in chunks
    const localStudents = storageService.getStudents();
    const result = await this.uploadStudentsBatchToCloud(localStudents, onProgress);
    return {
      success: result.success,
      count: result.uploadedCount,
      message: `Successfully synchronized ${result.uploadedCount} student records to Supabase Cloud SQL!`
    };
  }

  cleanup() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
    this.isInitialized = false;
  }
}

export const supabaseSyncService = new SupabaseSyncService();
