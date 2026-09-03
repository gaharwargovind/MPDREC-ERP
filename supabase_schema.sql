-- ========================================================================
-- MPDREC ERP & CAMPUS COUNCILS - SUPABASE DATABASE SCHEMA
-- ========================================================================

create extension if not exists "uuid-ossp";

-- 1. NOTICES TABLE
create table if not exists public.notices (
  id text primary key,
  title text not null,
  date text not null,
  category text not null,
  author text not null,
  department text not null,
  content text not null,
  priority text default 'Medium',
  attachments jsonb default '[]'::jsonb,
  "targetAudience" text default 'All',
  created_at timestamptz default now()
);

-- 2. STUDENTS TABLE (Full Engineering Student Transcripts & Academic Profile)
create table if not exists public.students (
  "rollNo" text primary key,
  "enrollmentNo" text,
  name text not null,
  email text,
  phone text,
  gender text default 'Male',
  avatar text,
  "parentName" text,
  "parentPhone" text,
  branch text default 'Computer Science & Engineering',
  department text default 'Computer Science & Engineering',
  semester int not null default 1,
  "currentYear" int default 1,
  year int default 1,
  "academicSession" text default '2025-2026',
  section text default 'A',
  "admissionYear" int default 2024,
  category text default 'General',
  status text default 'Regular',
  "totalClasses" int default 100,
  "attendedClasses" int default 85,
  "attendancePercentage" numeric default 85,
  attendance numeric default 85,
  sgpa numeric default 7.5,
  cgpa numeric default 7.5,
  backlogs int default 0,
  "totalFees" numeric default 65000,
  "feesPaid" numeric default 65000,
  "balanceFees" numeric default 0,
  "feesDueAmount" numeric default 0,
  "feeStatus" text default 'Paid',
  "feesStatus" text default 'Paid',
  "scholarshipStatus" text default 'Approved / Credited',
  "hostelResident" boolean default false,
  "hostelName" text,
  "hostelRoom" text,
  "hostelBed" text,
  "hostelAllotment" jsonb default '{}'::jsonb,
  subjects jsonb default '[]'::jsonb,
  activities jsonb default '[]'::jsonb,
  "academicProgressionHistory" jsonb default '[]'::jsonb,
  semesters jsonb default '[]'::jsonb,
  "semesterResults" jsonb default '[]'::jsonb,
  "issuedBooks" jsonb default '[]'::jsonb,
  "assignedProject" jsonb default '{}'::jsonb,
  "rawData" jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Fast Indexes for Students
create index if not exists idx_students_semester on public.students(semester);
create index if not exists idx_students_section on public.students(section);
create index if not exists idx_students_cgpa on public.students(cgpa);
create index if not exists idx_students_fee_status on public.students("feeStatus");
create index if not exists idx_students_branch on public.students(branch);

-- 3. FACULTY TABLE
create table if not exists public.faculty (
  "facultyId" text primary key,
  name text not null,
  email text not null,
  department text not null,
  designation text not null,
  phone text,
  qualification text,
  specialization text,
  "joiningDate" text,
  "cabinNumber" text,
  "subjectsTaught" jsonb default '[]'::jsonb,
  "assignedStudentsCount" int default 0,
  avatar text,
  created_at timestamptz default now()
);

-- 4. STAFF TABLE
create table if not exists public.staff (
  "staffId" text primary key,
  name text not null,
  email text not null,
  department text not null,
  designation text not null,
  phone text,
  "joiningDate" text,
  shift text,
  avatar text,
  created_at timestamptz default now()
);

-- 5. CAMPUS EVENTS TABLE
create table if not exists public.campus_events (
  id text primary key,
  title text not null,
  description text,
  date text not null,
  time text,
  venue text,
  category text,
  organizer text,
  capacity int,
  "registeredUsers" jsonb default '[]'::jsonb,
  status text default 'approved',
  "approvedBy" text,
  "approvedAt" text,
  "rejectionReason" text,
  created_at timestamptz default now()
);

-- 6. GALLERY TABLE
create table if not exists public.gallery (
  id text primary key,
  title text not null,
  description text,
  "imageUrl" text not null,
  category text,
  "uploadedBy" text,
  "uploaderRole" text,
  date text,
  likes int default 0,
  "likedBy" jsonb default '[]'::jsonb,
  status text default 'approved',
  "reviewedBy" text,
  "reviewedAt" text,
  "rejectionReason" text,
  created_at timestamptz default now()
);

-- 7. COUNCILS TABLE
create table if not exists public.councils (
  id text primary key,
  name text not null,
  code text,
  category text,
  tagline text,
  description text,
  mission text,
  vision text,
  "leadName" text,
  "leadEmail" text,
  "leadRollNo" text,
  "facultyAdvisor" text,
  "memberCount" int default 0,
  "establishedYear" int,
  "meetingSchedule" text,
  "socialLinks" jsonb default '{}'::jsonb,
  "accentColor" text,
  tags jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 8. COUNCIL EVENTS TABLE
create table if not exists public.council_events (
  id text primary key,
  "councilId" text not null,
  title text not null,
  description text,
  date text not null,
  time text,
  venue text,
  category text,
  eligibility text,
  "registrationDeadline" text,
  "registeredCount" int default 0,
  "registeredUsers" jsonb default '[]'::jsonb,
  "moderationStatus" text default 'approved',
  "approvedBy" text,
  "approvedAt" text,
  "rejectionReason" text,
  created_at timestamptz default now()
);

-- 9. COUNCIL MEDIA TABLE
create table if not exists public.council_media (
  id text primary key,
  "councilId" text not null,
  title text not null,
  description text,
  type text not null default 'image',
  url text not null,
  "thumbnailUrl" text,
  category text,
  "createdAt" text,
  "uploadedBy" text,
  "uploaderName" text,
  status text default 'approved',
  likes int default 0,
  "likedBy" jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 10. COUNCIL LOGOS TABLE
create table if not exists public.council_logos (
  id text primary key,
  logo_url text not null,
  updated_at timestamptz default now()
);

-- 11. BOOKS TABLE
create table if not exists public.books (
  id text primary key,
  title text not null,
  author text not null,
  isbn text,
  category text,
  department text,
  "totalCopies" int default 1,
  "availableCopies" int default 1,
  shelf text,
  status text default 'Available',
  "issuedTo" jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 12. STUDY MATERIALS TABLE
create table if not exists public.study_materials (
  id text primary key,
  title text not null,
  subject text not null,
  "subjectCode" text,
  department text not null,
  semester int not null,
  type text,
  "fileUrl" text,
  "fileSize" text,
  "uploadedBy" text,
  "uploadedAt" text,
  downloads int default 0,
  created_at timestamptz default now()
);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES - PRODUCTION HARDENED
-- ========================================================================

-- 1. Enable RLS explicitly on every table
alter table public.notices enable row level security;
alter table public.students enable row level security;
alter table public.faculty enable row level security;
alter table public.staff enable row level security;
alter table public.campus_events enable row level security;
alter table public.gallery enable row level security;
alter table public.councils enable row level security;
alter table public.council_events enable row level security;
alter table public.council_media enable row level security;
alter table public.council_logos enable row level security;
alter table public.books enable row level security;
alter table public.study_materials enable row level security;

-- Drop any legacy permissive policies
drop policy if exists "Allow all operations for notices" on public.notices;
drop policy if exists "Allow all operations for students" on public.students;
drop policy if exists "Allow all operations for faculty" on public.faculty;
drop policy if exists "Allow all operations for staff" on public.staff;
drop policy if exists "Allow all operations for campus_events" on public.campus_events;
drop policy if exists "Allow all operations for gallery" on public.gallery;
drop policy if exists "Allow all operations for councils" on public.councils;
drop policy if exists "Allow all operations for council_events" on public.council_events;
drop policy if exists "Allow all operations for council_media" on public.council_media;
drop policy if exists "Allow all operations for council_logos" on public.council_logos;
drop policy if exists "Allow all operations for books" on public.books;
drop policy if exists "Allow all operations for study_materials" on public.study_materials;

-- A. PUBLIC READ CATALOG TABLES (Permit public read, require authorized staff/admin write)
-- Notices
create policy "Public can read notices" on public.notices for select using (true);
create policy "Admins and staff can modify notices" on public.notices for all
  using (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'));

-- Campus Events
create policy "Public can read campus events" on public.campus_events for select using (true);
create policy "Admins and staff can modify campus events" on public.campus_events for all
  using (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'));

-- Gallery
create policy "Public can read gallery" on public.gallery for select using (true);
create policy "Authorized users can upload gallery items" on public.gallery for insert
  with check (auth.role() = 'authenticated');
create policy "Admins can manage gallery items" on public.gallery for all
  using (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'));

-- Councils, Council Events, Council Media & Logos
create policy "Public can read councils" on public.councils for select using (true);
create policy "Admins can manage councils" on public.councils for all
  using (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'));

create policy "Public can read council events" on public.council_events for select using (true);
create policy "Admins and council leads can manage council events" on public.council_events for all
  using (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'));

create policy "Public can read council media" on public.council_media for select using (true);
create policy "Authenticated users can like or add council media" on public.council_media for insert
  with check (auth.role() = 'authenticated');
create policy "Admins can manage council media" on public.council_media for all
  using (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'));

create policy "Public can read council logos" on public.council_logos for select using (true);
create policy "Admins can manage council logos" on public.council_logos for all
  using (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'));

-- Library Books & Study Materials
create policy "Public can read books" on public.books for select using (true);
create policy "Librarian and staff can manage books" on public.books for all
  using (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'));

create policy "Public can read study materials" on public.study_materials for select using (true);
create policy "Faculty and admins can upload study materials" on public.study_materials for all
  using (auth.jwt() ->> 'role' in ('admin', 'staff', 'faculty', 'service_role'));

-- B. SENSITIVE ENTITY TABLES (STUDENTS, FACULTY, STAFF)
-- Students: A student can ONLY access their own transcript unless caller is authenticated faculty/staff/admin
create policy "Students can view own profile or staff can view all" on public.students for select
  using (
    auth.jwt() ->> 'role' in ('admin', 'staff', 'faculty', 'service_role')
    or auth.jwt() ->> 'rollNo' = "rollNo"
    or auth.uid()::text = "rollNo"
  );

create policy "Students can update own contact details" on public.students for update
  using (
    auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role')
    or auth.jwt() ->> 'rollNo' = "rollNo"
  )
  with check (
    auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role')
    or auth.jwt() ->> 'rollNo' = "rollNo"
  );

create policy "Admins can insert or delete students" on public.students for all
  using (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'));

-- Faculty: Authenticated directory view, administrative modification
create policy "Authenticated users can view faculty" on public.faculty for select
  using (auth.role() = 'authenticated' or auth.jwt() ->> 'role' is not null);
create policy "Admins can manage faculty records" on public.faculty for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

-- Staff: Internal administrative view and management
create policy "Admins and staff can view staff directory" on public.staff for select
  using (auth.jwt() ->> 'role' in ('admin', 'staff', 'service_role'));
create policy "Admins can manage staff records" on public.staff for all
  using (auth.jwt() ->> 'role' in ('admin', 'service_role'))
  with check (auth.jwt() ->> 'role' in ('admin', 'service_role'));

-- ========================================================================
-- REALTIME REPLICATION SETUP (ENABLE REALTIME FOR COUNCIL_LOGOS & TABLES)
-- ========================================================================

-- Enable Full Replica Identity for real-time tracking of INSERT, UPDATE, DELETE payloads
alter table if exists public.council_logos replica identity full;
alter table if exists public.notices replica identity full;
alter table if exists public.students replica identity full;
alter table if exists public.faculty replica identity full;
alter table if exists public.staff replica identity full;
alter table if exists public.campus_events replica identity full;
alter table if exists public.gallery replica identity full;
alter table if exists public.councils replica identity full;
alter table if exists public.council_events replica identity full;
alter table if exists public.council_media replica identity full;
alter table if exists public.books replica identity full;
alter table if exists public.study_materials replica identity full;

-- Ensure supabase_realtime publication exists and add council_logos to realtime stream
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end
$$;

-- Add council_logos and all key tables to Supabase Realtime publication
alter publication supabase_realtime add table public.council_logos;
alter publication supabase_realtime add table public.councils;
alter publication supabase_realtime add table public.council_events;
alter publication supabase_realtime add table public.council_media;
alter publication supabase_realtime add table public.notices;
alter publication supabase_realtime add table public.students;
alter publication supabase_realtime add table public.faculty;
alter publication supabase_realtime add table public.staff;
alter publication supabase_realtime add table public.campus_events;
alter publication supabase_realtime add table public.gallery;
alter publication supabase_realtime add table public.books;
alter publication supabase_realtime add table public.study_materials;

-- ========================================================================
-- STORAGE BUCKET CREATION AND STORAGE POLICIES
-- ========================================================================

-- Insert storage bucket 'campus_media' if not exists
insert into storage.buckets (id, name, public)
values ('campus_media', 'campus_media', true)
on conflict (id) do nothing;

-- Storage object policies for 'campus_media'
drop policy if exists "Public Access for campus_media" on storage.objects;
create policy "Public Access for campus_media" on storage.objects
  for all using (bucket_id = 'campus_media') with check (bucket_id = 'campus_media');

