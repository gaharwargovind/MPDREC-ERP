import { CollegeCouncil, CouncilEvent, CouncilMediaItem } from '../types/councils';

export const SEED_COUNCILS: CollegeCouncil[] = [
  {
    id: 'technical_council',
    name: 'Technical Council',
    hindiName: 'तकनीकी परिषद',
    tagline: 'Innovate • Code • Build the Future',
    shortDescription: 'Oversees technology initiatives, coding contests, hackathons, open-source projects, and the college E-Cell.',
    fullDescription: 'The Technical Council at MPDREC Gonda is the premier student-driven engineering and innovation body on campus. We empower budding engineers with hands-on technical proficiency, algorithm mastery, full-stack software development, hardware robotics, and startup incubation through high-impact hackathons, bootcamps, and technical symposiums.',
    missionStatement: 'To cultivate an ecosystem of cutting-edge technological innovation, research curiosity, and entrepreneurial mindset among scholars of MPDREC.',
    objectives: [
      'Organize annual flagship 36-hour hackathons and competitive programming sprints.',
      'Provide structured mentorship for national level hackathons (SIH, ICPC, GSoC).',
      'Incubate student startup concepts through the campus Entrepreneurship Cell (E-Cell).',
      'Conduct hands-on weekend workshops on AI/ML, Cloud Computing, and Cybersecurity.'
    ],
    themeColor: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      gradient: 'from-blue-600 via-indigo-600 to-violet-700',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      accentBorder: 'border-blue-500/50 hover:border-blue-400',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    },
    logoUrl: '/technical council.png',
    bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80',
    meetingVenue: 'Computer Center Lab 2 / Incubation Cell Block A',
    socials: {
      email: 'technical.council@mpdrec.ac.in',
      instagram: '@mpdrec_tech_council',
      github: 'https://github.com/mpdrec-tech',
      whatsappCommunity: 'https://chat.whatsapp.com/mpdrec-tech-2026',
      discordServer: 'https://discord.gg/mpdrec-coders'
    },
    stats: {
      annualEvents: 14,
      activeMembers: 120,
      achievementsCount: 28
    },
    domains: [
      {
        id: 'tech_cp',
        title: 'Competitive Programming & DSA',
        description: 'Weekly algorithmic challenges on LeetCode & Codeforces to prepare students for top-tier product companies.',
        iconName: 'Code2',
        skills: ['C++', 'Algorithms', 'Dynamic Programming', 'Graph Theory']
      },
      {
        id: 'tech_dev',
        title: 'Full-Stack & Cloud Systems',
        description: 'Building modern web apps, distributed backends, RESTful APIs, and cloud microservices.',
        iconName: 'Server',
        skills: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS']
      },
      {
        id: 'tech_ai',
        title: 'AI, Machine Learning & Data',
        description: 'Researching neural networks, deep learning models, LLMs, computer vision, and predictive analytics.',
        iconName: 'BrainCircuit',
        skills: ['Python', 'PyTorch', 'TensorFlow', 'NLP', 'Computer Vision']
      },
      {
        id: 'tech_ecell',
        title: 'E-Cell & Startup Incubation',
        description: 'Guiding student founders from ideation to pitch decks, seed funding, and patent filing.',
        iconName: 'Rocket',
        skills: ['Pitching', 'Business Modeling', 'MVP Design', 'Patents']
      }
    ],
    leadership: {
      convener: {
        facultyId: 'FAC-CSE-01',
        name: 'Mr. Sandip Kumar Singh',
        designation: 'Assistant Professor & Time Table Coordinator',
        department: 'Computer Science & Engineering',
        email: 'sandip.singh@mpdrec.ac.in',
        phone: '+91 94501 23456',
        cabinRoom: 'Faculty Block A - Room 204'
      },
      head: {
        id: 'MEM-TC-01',
        name: 'Anurag Yadav',
        role: 'Council Head (4th Year)',
        year: 4,
        branch: 'Computer Science & Engineering',
        rollNo: '2312140100001',
        email: 'anurag.yadav@mpdrec.ac.in',
        bio: 'Final-year software engineer & coding contest lead.'
      },
      heads: [
        {
          id: 'MEM-TC-01',
          name: 'Anurag Yadav',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100001',
          email: 'anurag.yadav@mpdrec.ac.in',
          bio: 'Final-year software engineer & coding contest lead.'
        },
        {
          id: 'MEM-TC-02',
          name: 'Vaishnavi Pandey',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100002',
          email: 'vaishnavi.pandey@mpdrec.ac.in',
          bio: 'Final-year full-stack developer & tech event coordinator.'
        }
      ],
      secretary: {
        id: 'MEM-TC-03',
        name: 'Ram Pratap Maurya',
        role: 'Secretary (4th Year)',
        year: 4,
        branch: 'Computer Science & Engineering',
        rollNo: '2312140100003',
        email: 'rampratap.maurya@mpdrec.ac.in',
        bio: 'Final-year system designer and hackathon manager.'
      },
      secretaries: [
        {
          id: 'MEM-TC-03',
          name: 'Ram Pratap Maurya',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100003',
          email: 'rampratap.maurya@mpdrec.ac.in',
          bio: 'Final-year system designer and hackathon manager.'
        },
        {
          id: 'MEM-TC-04',
          name: 'Abhishek Kumar',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100004',
          email: 'abhishek.kumar@mpdrec.ac.in',
          bio: 'Final-year open-source contributor and technical symposium coordinator.'
        }
      ],
      executiveMembers: [], // Open slots
      volunteers: [] // Open slots
    }
  },
  {
    id: 'sports_council',
    name: 'Sports Council',
    hindiName: 'क्रीड़ा परिषद',
    tagline: 'Passion • Endurance • Victory on the Field',
    shortDescription: 'Manages athletic competitions, sports meets, equipment inventory, and inter-college tournaments.',
    fullDescription: 'The Sports Council of MPDREC Gonda champions physical athleticism, discipline, sportsmanship, and mental fortitude. Managing world-class outdoor cricket pitches, football grounds, indoor badminton halls, and athletic tracks, the council prepares champion teams for AKTU Zonal & State tournaments.',
    missionStatement: 'To instill lifelong values of fitness, team spirit, fair play, and athletic excellence throughout the MPDREC campus.',
    objectives: [
      'Host the annual Inter-Departmental Sports Championship "VIJETA".',
      'Field competitive teams in AKTU Zonal and State-level tournaments.',
      'Maintain modern sports infrastructure and equipment checkout facilities.',
      'Organize daily fitness sessions, yoga mornings, and cross-country runs.'
    ],
    themeColor: {
      primary: '#ef4444',
      secondary: '#f97316',
      gradient: 'from-red-600 via-orange-600 to-amber-600',
      glowColor: 'rgba(239, 68, 68, 0.4)',
      accentBorder: 'border-red-500/50 hover:border-red-400',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/30'
    },
    logoUrl: '/sports council.jpg',
    bannerUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80',
    meetingVenue: 'Main Sports Complex / Physical Education Department',
    socials: {
      email: 'sports.council@mpdrec.ac.in',
      instagram: '@mpdrec_sports_official',
      youtube: 'https://youtube.com/@mpdrecsports',
      whatsappCommunity: 'https://chat.whatsapp.com/mpdrec-sports-2026'
    },
    stats: {
      annualEvents: 18,
      activeMembers: 160,
      achievementsCount: 42
    },
    domains: [
      {
        id: 'sports_outdoor',
        title: 'Outdoor Athletics & Football',
        description: 'Competitive football, cricket premier leagues, volleyball, and track & field sprint events.',
        iconName: 'Trophy',
        skills: ['Cricket', 'Football', 'Volleyball', 'Track & Field']
      },
      {
        id: 'sports_indoor',
        title: 'Indoor Badminton & TT',
        description: 'Wood-court badminton doubles, table tennis, carrom championships, and chess masteries.',
        iconName: 'Activity',
        skills: ['Badminton', 'Table Tennis', 'Chess', 'Carrom']
      },
      {
        id: 'sports_gym',
        title: 'Strength & Conditioning Hub',
        description: 'Managing campus fitness center, powerlifting clinics, and nutrition awareness.',
        iconName: 'Dumbbell',
        skills: ['Powerlifting', 'Calisthenics', 'Cardio', 'Dietetics']
      }
    ],
    leadership: {
      convener: {
        facultyId: 'FAC-CSE-07',
        name: 'Ms. Reetu Rawat',
        designation: 'Assistant Professor & Convener Sports Council',
        department: 'Computer Science & Engineering',
        email: 'reetu.rawat@mpdrec.ac.in',
        phone: '+91 94150 99887',
        cabinRoom: 'Faculty Block A - Room 205'
      },
      head: {
        id: 'MEM-SC-01',
        name: 'Muskan Mishra',
        role: 'Council Head (4th Year)',
        year: 4,
        branch: 'Computer Science & Engineering',
        rollNo: '2312140100005',
        email: 'muskan.mishra@mpdrec.ac.in',
        bio: 'Final-year athlete, college sports lead & athletics coordinator.'
      },
      heads: [
        {
          id: 'MEM-SC-01',
          name: 'Muskan Mishra',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100005',
          email: 'muskan.mishra@mpdrec.ac.in',
          bio: 'Final-year athlete, college sports lead & athletics coordinator.'
        },
        {
          id: 'MEM-SC-02',
          name: 'Saurabh Shukla',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100006',
          email: 'saurabh.shukla@mpdrec.ac.in',
          bio: 'Final-year football captain & inter-college tournament manager.'
        }
      ],
      secretary: {
        id: 'MEM-SC-03',
        name: 'Arpit Varshney',
        role: 'Secretary (4th Year)',
        year: 4,
        branch: 'Computer Science & Engineering',
        rollNo: '2312140100007',
        email: 'arpit.varshney@mpdrec.ac.in',
        bio: 'Final-year cricket lead & sports logistics coordinator.'
      },
      secretaries: [
        {
          id: 'MEM-SC-03',
          name: 'Arpit Varshney',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100007',
          email: 'arpit.varshney@mpdrec.ac.in',
          bio: 'Final-year cricket lead & sports logistics coordinator.'
        },
        {
          id: 'MEM-SC-04',
          name: 'Akash Tiwari',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100008',
          email: 'akash.tiwari@mpdrec.ac.in',
          bio: 'Final-year indoor games supervisor & equipment manager.'
        }
      ],
      executiveMembers: [],
      volunteers: []
    }
  },
  {
    id: 'media_council',
    name: 'Media Council',
    hindiName: 'मीडिया परिषद',
    tagline: 'Your Story Begins Here • Official Campus Media & Archives',
    shortDescription: 'Official campus coverage team handling photography, videography, aftermovies, and social media archives.',
    fullDescription: 'The Media Council at MPDREC Gonda is the creative voice, lens, and chronicler of the institution. From capturing cinematic aftermovies of college fests to managing official press releases, podcasts, live streams, and digital broadcast archives, the Media Council documents every vibrant heartbeat of campus life.',
    missionStatement: 'To narrate the authentic story of MPDREC with cinematic excellence, artistic visual journalism, and timely campus broadcasting.',
    objectives: [
      'Document every academic, cultural, and sports milestone with high-fidelity media.',
      'Produce cinematic official aftermovies for AAROHAN and tech fests.',
      'Manage official institutional social channels, newsletters, and press releases.',
      'Train students in professional DSLR photography, drone cinematography, and video editing.'
    ],
    themeColor: {
      primary: '#06b6d4',
      secondary: '#3b82f6',
      gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
      glowColor: 'rgba(6, 182, 212, 0.4)',
      accentBorder: 'border-cyan-500/50 hover:border-cyan-400',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    },
    logoUrl: '/media council.jpg',
    bannerUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80',
    meetingVenue: 'Media Studio & Editing Suite - Block C Room 302',
    socials: {
      email: 'media.council@mpdrec.ac.in',
      instagram: '@mpdrec_mediacouncil',
      youtube: 'https://youtube.com/@mpdrecmediacouncil',
      whatsappCommunity: 'https://chat.whatsapp.com/mpdrec-media-2026'
    },
    stats: {
      annualEvents: 24,
      activeMembers: 85,
      achievementsCount: 19
    },
    domains: [
      {
        id: 'media_photo',
        title: 'Photography & Visual Archives',
        description: 'Portrait photography, high-speed sports shutter captures, campus scenery, and photo albums.',
        iconName: 'Camera',
        skills: ['Lightroom', 'DSLR Shooting', 'Color Grading', 'Lighting']
      },
      {
        id: 'media_cine',
        title: 'Cinematography & Aftermovies',
        description: 'Multi-cam 4K event filming, drone aerial sweeps, video editing, sound design, and teasers.',
        iconName: 'Film',
        skills: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Sound Mixing']
      },
      {
        id: 'media_press',
        title: 'Press, Podcast & Socials',
        description: 'Official Instagram posts, student spotlight podcast episodes, and campus press archives.',
        iconName: 'Mic',
        skills: ['Podcasting', 'Copywriting', 'Press Releases', 'Reels Strategy']
      }
    ],
    leadership: {
      convener: {
        facultyId: 'FAC-EE-01',
        name: 'Mr. Marut Nandan Tripathi',
        designation: 'Assistant Professor & Convener Media Council',
        department: 'Electrical Engineering',
        email: 'marut.tripathi@mpdrec.ac.in',
        phone: '+91 91234 56789',
        cabinRoom: 'Faculty Block B - Room 104'
      },
      head: {
        id: 'MEM-MC-01',
        name: 'Avinash Ranjan',
        role: 'Council Head (4th Year)',
        year: 4,
        branch: 'Electrical Engineering',
        rollNo: '2312140300001',
        email: 'avinash.ranjan@mpdrec.ac.in',
        bio: 'Final-year cinematographer & media production director.'
      },
      heads: [
        {
          id: 'MEM-MC-01',
          name: 'Avinash Ranjan',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Electrical Engineering',
          rollNo: '2312140300001',
          email: 'avinash.ranjan@mpdrec.ac.in',
          bio: 'Final-year cinematographer & media production director.'
        },
        {
          id: 'MEM-MC-02',
          name: 'Manu Tiwari',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100009',
          email: 'manu.tiwari@mpdrec.ac.in',
          bio: 'Final-year creative strategist & official video editor.'
        }
      ],
      secretary: {
        id: 'MEM-MC-03',
        name: 'Shivam Saroj',
        role: 'Secretary (4th Year)',
        year: 4,
        branch: 'Computer Science & Engineering',
        rollNo: '2312140100010',
        email: 'shivam.saroj@mpdrec.ac.in',
        bio: 'Final-year photography director & post-production supervisor.'
      },
      secretaries: [
        {
          id: 'MEM-MC-03',
          name: 'Shivam Saroj',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100010',
          email: 'shivam.saroj@mpdrec.ac.in',
          bio: 'Final-year photography director & post-production supervisor.'
        },
        {
          id: 'MEM-MC-04',
          name: 'Shailesh Yadav',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Civil Engineering (CED)',
          rollNo: '2312140000001',
          email: 'shailesh.yadav@mpdrec.ac.in',
          bio: 'Final-year digital broadcast & live stream coordinator.'
        }
      ],
      executiveMembers: [],
      volunteers: []
    }
  },
  {
    id: 'cultural_council',
    name: 'Cultural Council',
    hindiName: 'सांस्कृतिक परिषद',
    tagline: 'Echoes of Heritage, Rhythm of Celebration',
    shortDescription: 'Organizes major cultural fests, national festivals (Independence Day, Republic Day), and festive celebrations (Navratri, Diwali).',
    fullDescription: 'The Cultural Council is the vibrant soul and festive cornerstone of MPDREC. Responsible for our flagship annual cultural mega-fest "AAROHAN", national celebration ceremonies, classical music recitals, energetic dance drama, street plays (Nukkad Natak), and festive cultural nights, the council preserves and celebrates India\'s timeless heritage.',
    missionStatement: 'To celebrate diversity, foster artistic expression, and unite the college family through rich cultural arts and festive heritage.',
    objectives: [
      'Host the flagship annual multi-day cultural fest "AAROHAN".',
      'Organize patriotic Independence Day and Republic Day parades and recitals.',
      'Champion theater, street plays, classical Kathak/Bharatnatyam, and contemporary dance.',
      'Organize festive celebrations including Diwali Diya Mahotsav and Navratri Garba nights.'
    ],
    themeColor: {
      primary: '#ec4899',
      secondary: '#d946ef',
      gradient: 'from-pink-600 via-rose-600 to-purple-700',
      glowColor: 'rgba(236, 72, 153, 0.4)',
      accentBorder: 'border-pink-500/50 hover:border-pink-400',
      badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/30'
    },
    logoUrl: '/cultural council.jpg',
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
    meetingVenue: 'Main Auditorium & Open Air Amphitheatre',
    socials: {
      email: 'cultural.council@mpdrec.ac.in',
      instagram: '@mpdrec_cultural_fest',
      youtube: 'https://youtube.com/@mpdrecculture',
      whatsappCommunity: 'https://chat.whatsapp.com/mpdrec-cultural-2026'
    },
    stats: {
      annualEvents: 16,
      activeMembers: 140,
      achievementsCount: 35
    },
    domains: [
      {
        id: 'cult_dance',
        title: 'Dance & Choreography',
        description: 'Classical, folk, hip-hop, western fusion, and group synchronization choreography.',
        iconName: 'Sparkles',
        skills: ['Classical', 'Hip-Hop', 'Folk Dance', 'Stage Formations']
      },
      {
        id: 'cult_drama',
        title: 'Drama & Nukkad Natak',
        description: 'Street theater with social messages, stage plays, mono-acting, and theatrical skits.',
        iconName: 'Smile',
        skills: ['Voice Modulation', 'Stage Direction', 'Scriptwriting', 'Nukkad Natak']
      },
      {
        id: 'cult_music',
        title: 'Vocal & Instrumental Music',
        description: 'Classical Indian vocals, semi-classical fusion, instrumental sitar/tabla/keyboard recitals.',
        iconName: 'Music',
        skills: ['Hindustani Classical', 'Acoustic Vocals', 'Percussion', 'Harmonium']
      }
    ],
    leadership: {
      convener: {
        facultyId: 'FAC-CSE-03',
        name: 'Dr. Aparna Verma',
        designation: 'Assistant Professor & Chief Warden',
        department: 'Computer Science & Engineering',
        email: 'aparna.verma@mpdrec.ac.in',
        phone: '+91 98391 12345',
        cabinRoom: 'Faculty Block A - Room 208'
      },
      head: {
        id: 'MEM-CC-01',
        name: 'Archita Mishra',
        role: 'Council Head (4th Year)',
        year: 4,
        branch: 'Computer Science & Engineering',
        rollNo: '2312140100011',
        email: 'archita.mishra@mpdrec.ac.in',
        bio: 'Final-year lead performing artist & cultural events convener.'
      },
      heads: [
        {
          id: 'MEM-CC-01',
          name: 'Archita Mishra',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100011',
          email: 'archita.mishra@mpdrec.ac.in',
          bio: 'Final-year lead performing artist & cultural events convener.'
        },
        {
          id: 'MEM-CC-02',
          name: 'Ankit Kumar Yadav',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100012',
          email: 'ankit.yadav@mpdrec.ac.in',
          bio: 'Final-year theater director & stage choreography coordinator.'
        }
      ],
      secretary: {
        id: 'MEM-CC-03',
        name: 'Vishwa Deepak Mishra',
        role: 'Secretary (4th Year)',
        year: 4,
        branch: 'Electrical Engineering (EED)',
        rollNo: '2312140300002',
        email: 'vishwadeepak.mishra@mpdrec.ac.in',
        bio: 'Final-year musical ensemble coordinator & event organizer.'
      },
      secretaries: [
        {
          id: 'MEM-CC-03',
          name: 'Vishwa Deepak Mishra',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Electrical Engineering (EED)',
          rollNo: '2312140300002',
          email: 'vishwadeepak.mishra@mpdrec.ac.in',
          bio: 'Final-year musical ensemble coordinator & event organizer.'
        },
        {
          id: 'MEM-CC-04',
          name: 'Sarvesh Yadav',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100013',
          email: 'sarvesh.yadav@mpdrec.ac.in',
          bio: 'Final-year festival logistics and stage manager.'
        }
      ],
      executiveMembers: [],
      volunteers: []
    }
  },
  {
    id: 'literary_council',
    name: 'Literary Council',
    hindiName: 'साहित्यिक परिषद',
    tagline: 'Words that Ignite, Ideas that Inspire',
    shortDescription: 'Promotes literary arts, hosting parliamentary debates, poetry slams, MUNs, and stage anchoring.',
    fullDescription: 'The Literary Council serves as the intellectual crucible of MPDREC. Providing a vibrant platform for orators, poets, debaters, writers, and thinkers, the council regularly hosts parliamentary debates, bilingual poetry slams (Kavya Sandhya), Model United Nations (MUN), essay writing contests, and masterclass workshops on stage anchoring.',
    missionStatement: 'To cultivate critical thinking, eloquent articulation, literary passion, and civic consciousness across the student fraternity.',
    objectives: [
      'Host the annual Inter-College Parliamentary Debate Championship "SAMVAD".',
      'Organize Hindi & English Kavya Sandhya and open-mic poetry sessions.',
      'Publish the annual college literary magazine and bilingual newsletter.',
      'Train official anchors and emcees for all institutional symposiums.'
    ],
    themeColor: {
      primary: '#10b981',
      secondary: '#059669',
      gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
      glowColor: 'rgba(168, 185, 129, 0.4)',
      accentBorder: 'border-emerald-500/50 hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    logoUrl: '/literary council.jpg',
    bannerUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1600&q=80',
    meetingVenue: 'Central Library Conference Hall / Room B-201',
    socials: {
      email: 'literary.council@mpdrec.ac.in',
      instagram: '@mpdrec_literary_hub',
      whatsappCommunity: 'https://chat.whatsapp.com/mpdrec-lit-2026'
    },
    stats: {
      annualEvents: 12,
      activeMembers: 75,
      achievementsCount: 22
    },
    domains: [
      {
        id: 'lit_debate',
        title: 'Parliamentary Debate & MUN',
        description: 'Structured Asian Parliamentary debates, Oxford style arguments, and Model UN committees.',
        iconName: 'MessageSquare',
        skills: ['Rhetoric', 'Current Affairs', 'Rebuttal', 'Diplomacy']
      },
      {
        id: 'lit_poetry',
        title: 'Poetry & Open-Mic Slams',
        description: 'Bilingual Hindi Kavita, Shayri, English spoken word, storytelling, and stage recitation.',
        iconName: 'Feather',
        skills: ['Urdu Shayari', 'Hindi Kavya', 'Spoken Word', 'Rhyme Schemes']
      },
      {
        id: 'lit_anchoring',
        title: 'Anchoring & Public Speaking',
        description: 'Professional stage presence, bilingual teleprompter delivery, and formal event hosting.',
        iconName: 'Mic2',
        skills: ['Stage Presence', 'Voice Clarity', 'Improvisation', 'Protocols']
      }
    ],
    leadership: {
      convener: {
        facultyId: 'FAC-APSH-01',
        name: 'Dr. Satya Prakash',
        designation: 'Assistant Professor & Convener Literary Council',
        department: 'Applied Science & Humanities (APSH)',
        email: 'satya.prakash@mpdrec.ac.in',
        phone: '+91 97920 44556',
        cabinRoom: 'Faculty Block B - Room 106'
      },
      conveners: [
        {
          facultyId: 'FAC-APSH-01',
          name: 'Dr. Satya Prakash',
          designation: 'Assistant Professor & Convener Literary Council',
          department: 'Applied Science & Humanities (APSH)',
          email: 'satya.prakash@mpdrec.ac.in',
          phone: '+91 97920 44556',
          cabinRoom: 'Faculty Block B - Room 106'
        },
        {
          facultyId: 'FAC-EE-01',
          name: 'Mr. Marut Nandan Tripathi',
          designation: 'Assistant Professor & Convener',
          department: 'Electrical Engineering',
          email: 'marut.tripathi@mpdrec.ac.in',
          phone: '+91 91234 56789',
          cabinRoom: 'Faculty Block B - Room 104'
        }
      ],
      head: {
        id: 'MEM-LC-01',
        name: 'Kajal Singh',
        role: 'Council Head (4th Year)',
        year: 4,
        branch: 'Computer Science & Engineering',
        rollNo: '2312140100020',
        email: 'kajal.singh@mpdrec.ac.in',
        bio: 'Final-year orator, bilingual debater & editor of campus literary journal.'
      },
      heads: [
        {
          id: 'MEM-LC-01',
          name: 'Kajal Singh',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100020',
          email: 'kajal.singh@mpdrec.ac.in',
          bio: 'Final-year orator, bilingual debater & editor of campus literary journal.'
        },
        {
          id: 'MEM-LC-02',
          name: 'Ankit Mishra',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100021',
          email: 'ankit.mishra@mpdrec.ac.in',
          bio: 'Final-year Hindi poet, MUN delegate & parliamentary debate lead.'
        }
      ],
      secretary: {
        id: 'MEM-LC-03',
        name: 'Abhishek Yadav',
        role: 'Core Member (4th Year)',
        year: 4,
        branch: 'Computer Science & Engineering',
        rollNo: '2312140100022',
        email: 'abhishek.yadav@mpdrec.ac.in',
        bio: 'Final-year spoken word artist and debate coordinator.'
      },
      secretaries: [
        {
          id: 'MEM-LC-03',
          name: 'Abhishek Yadav',
          role: 'Core Member (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100022',
          email: 'abhishek.yadav@mpdrec.ac.in',
          bio: 'Final-year spoken word artist and debate coordinator.'
        },
        {
          id: 'MEM-LC-04',
          name: 'Abhay Agarwal',
          role: 'Core Member (4th Year)',
          year: 4,
          branch: 'Civil Engineering (CE)',
          rollNo: '2312140000002',
          email: 'abhay.agarwal@mpdrec.ac.in',
          bio: 'Final-year stage anchoring & symposium proceedings lead.'
        }
      ],
      members: [
        {
          id: 'MEM-LC-03',
          name: 'Abhishek Yadav',
          role: 'Member (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100022',
          email: 'abhishek.yadav@mpdrec.ac.in',
          bio: 'Final-year spoken word artist and debate coordinator.'
        },
        {
          id: 'MEM-LC-04',
          name: 'Abhay Agarwal',
          role: 'Member (4th Year)',
          year: 4,
          branch: 'Civil Engineering (CE)',
          rollNo: '2312140000002',
          email: 'abhay.agarwal@mpdrec.ac.in',
          bio: 'Final-year stage anchoring & symposium proceedings lead.'
        }
      ],
      executiveMembers: [],
      volunteers: []
    }
  },
  {
    id: 'hobby_council',
    name: 'Hobby Council',
    hindiName: 'शौकिया परिषद',
    tagline: 'Unleash Your Passion • Beyond the Classroom',
    shortDescription: 'Platform for creative and performing arts including music, bands, dance crews, beatboxing, and rap battles.',
    fullDescription: 'The Hobby Council provides a dynamic haven for non-academic passions, underground arts, campus rock bands, beatboxers, rap battles, strategic esports tournaments, DIY electronic crafting, and stargazing nature explorations. We encourage every engineer to nurture their unique side talents.',
    missionStatement: 'To foster an open, stress-free culture where students explore diverse hobbies, music, gaming, and personal creative passions.',
    objectives: [
      'Host campus battle of the bands and acoustic bonfire jam sessions.',
      'Organize annual Inter-Hostel Esports Championship (Valorant, BGMI, Chess).',
      'Conduct beatboxing, rap battles, and freestyle hip-hop cyphers.',
      'Facilitate DIY robotics, origami craft, and astronomy observation nights.'
    ],
    themeColor: {
      primary: '#eab308',
      secondary: '#f59e0b',
      gradient: 'from-amber-500 via-yellow-500 to-orange-600',
      glowColor: 'rgba(234, 179, 8, 0.4)',
      accentBorder: 'border-amber-500/50 hover:border-amber-400',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    logoUrl: '/hobby council.jpg',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80',
    meetingVenue: 'Student Activity Center (SAC) - Jam Room & Lounge',
    socials: {
      email: 'hobby.council@mpdrec.ac.in',
      instagram: '@mpdrec_hobby_club',
      youtube: 'https://youtube.com/@mpdrechobby',
      whatsappCommunity: 'https://chat.whatsapp.com/mpdrec-hobby-2026'
    },
    stats: {
      annualEvents: 20,
      activeMembers: 110,
      achievementsCount: 16
    },
    domains: [
      {
        id: 'hobby_band',
        title: 'College Rock Band & Acoustics',
        description: 'Electric guitars, bass, drum sets, synthesizer keyboards, and acoustic jamming.',
        iconName: 'Music2',
        skills: ['Lead Guitar', 'Drumming', 'Bass Guitar', 'Keyboard']
      },
      {
        id: 'hobby_hiphop',
        title: 'Beatboxing & Rap Battles',
        description: 'Acoustic vocal percussion, freestyle cyphers, rap songwriting, and loop-station jams.',
        iconName: 'Radio',
        skills: ['Beatboxing', 'Freestyle Rap', 'Mic Control', 'Looping']
      },
      {
        id: 'hobby_esports',
        title: 'Esports & Tactical Gaming',
        description: 'LAN gaming tournaments, strategy esports matches, and campus gaming leagues.',
        iconName: 'Gamepad2',
        skills: ['Strategy', 'Team Comms', 'Reflexes', 'Tournament Org']
      }
    ],
    leadership: {
      convener: {
        facultyId: 'FAC-CSE-06',
        name: 'Mr. Shailendra Kumar Yadav',
        designation: 'Assistant Professor & Project Coordinator',
        department: 'Computer Science & Engineering',
        email: 'shailendra.yadav@mpdrec.ac.in',
        phone: '+91 96510 88990',
        cabinRoom: 'Faculty Block A - Room 215'
      },
      head: {
        id: 'MEM-HC-01',
        name: 'Santosh Kr. Vishwakarma',
        role: 'Council Head (4th Year)',
        year: 4,
        branch: 'Electrical Engineering (EE)',
        rollNo: '2312140300003',
        email: 'santosh.vishwakarma@mpdrec.ac.in',
        bio: 'Final-year creative director & campus acoustic sessions lead.'
      },
      heads: [
        {
          id: 'MEM-HC-01',
          name: 'Santosh Kr. Vishwakarma',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Electrical Engineering (EE)',
          rollNo: '2312140300003',
          email: 'santosh.vishwakarma@mpdrec.ac.in',
          bio: 'Final-year creative director & campus acoustic sessions lead.'
        },
        {
          id: 'MEM-HC-02',
          name: 'Riya Pathak',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100017',
          email: 'riya.pathak@mpdrec.ac.in',
          bio: 'Final-year band manager & beatboxing cypher organizer.'
        }
      ],
      secretary: {
        id: 'MEM-HC-03',
        name: 'Nikhil Sharma',
        role: 'Secretary (4th Year)',
        year: 4,
        branch: 'Computer Science & Engineering',
        rollNo: '2312140100018',
        email: 'nikhil.sharma@mpdrec.ac.in',
        bio: 'Final-year music producer & keyboard synthesizer lead.'
      },
      secretaries: [
        {
          id: 'MEM-HC-03',
          name: 'Nikhil Sharma',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100018',
          email: 'nikhil.sharma@mpdrec.ac.in',
          bio: 'Final-year music producer & keyboard synthesizer lead.'
        },
        {
          id: 'MEM-HC-04',
          name: 'Madhukar Shukla',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100019',
          email: 'madhukar.shukla@mpdrec.ac.in',
          bio: 'Final-year esports tournament director & sound engineer.'
        }
      ],
      executiveMembers: [],
      volunteers: []
    }
  },
  {
    id: 'fine_arts_council',
    name: 'Council of Fine Arts',
    hindiName: 'ललित कला परिषद',
    tagline: 'Sculpting Vision, Painting Imagination',
    shortDescription: 'Visual arts society for sketching, canvas painting, digital design, live art, and campus decor installations.',
    fullDescription: 'The Council of Fine Arts transforms the physical and visual landscape of MPDREC into an inspiring canvas. From intricate live charcoal portraits and grand festival installations to oil paintings, digital vector graphics, calligraphy, and graffiti murals, the council provides the aesthetic identity of our campus.',
    missionStatement: 'To unleash visual creativity, celebrate fine artistic expressions, and beautify the MPDREC campus through art and design.',
    objectives: [
      'Create grand thematic visual decor and entrance installations for college fests.',
      'Host the annual Fine Arts Exhibition "CHITRAKALA".',
      'Conduct regular live painting, charcoal sketching, and calligraphy workshops.',
      'Design official college merchandise, event graphics, and murals.'
    ],
    themeColor: {
      primary: '#a855f7',
      secondary: '#8b5cf6',
      gradient: 'from-purple-600 via-fuchsia-600 to-pink-600',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      accentBorder: 'border-purple-500/50 hover:border-purple-400',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    },
    logoUrl: '/council of fine arts.jpg',
    bannerUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=80',
    meetingVenue: 'Art & Design Studio - Faculty Block B Room 108',
    socials: {
      email: 'finearts.council@mpdrec.ac.in',
      instagram: '@mpdrec_fine_arts',
      whatsappCommunity: 'https://chat.whatsapp.com/mpdrec-finearts-2026'
    },
    stats: {
      annualEvents: 10,
      activeMembers: 65,
      achievementsCount: 24
    },
    domains: [
      {
        id: 'art_canvas',
        title: 'Canvas Painting & Charcoal',
        description: 'Oil, acrylic on canvas, watercolor landscapes, and photorealistic charcoal sketches.',
        iconName: 'Palette',
        skills: ['Acrylic', 'Oil Painting', 'Charcoal', 'Shading']
      },
      {
        id: 'art_decor',
        title: 'Campus Decor & Installations',
        description: 'Large-scale 3D sculptures, festive origami canopies, lighting decor, and stage props.',
        iconName: 'Brush',
        skills: ['3D Sculpting', 'Stage Decor', 'Mural Art', 'Origami']
      },
      {
        id: 'art_digital',
        title: 'Digital Illustration & UI/UX',
        description: 'Vector illustration, concept artwork, typography design, and poster aesthetics.',
        iconName: 'Layers',
        skills: ['Photoshop', 'Illustrator', 'Figma', 'Typography']
      }
    ],
    leadership: {
      convener: {
        facultyId: 'FAC-CSE-02',
        name: 'Dr. Rohit Tripathi',
        designation: 'Associate Professor & HOD CSE',
        department: 'Computer Science & Engineering',
        email: 'rohit.tripathi@mpdrec.ac.in',
        phone: '+91 98390 87654',
        cabinRoom: 'Faculty Block A - Room 201'
      },
      head: {
        id: 'MEM-FA-01',
        name: 'Dipali Gupta',
        role: 'Council Head (4th Year)',
        year: 4,
        branch: 'Computer Science & Engineering',
        rollNo: '2312140100014',
        email: 'dipali.gupta@mpdrec.ac.in',
        bio: 'Final-year visual artist specializing in canvas painting & fest installations.'
      },
      heads: [
        {
          id: 'MEM-FA-01',
          name: 'Dipali Gupta',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100014',
          email: 'dipali.gupta@mpdrec.ac.in',
          bio: 'Final-year visual artist specializing in canvas painting & fest installations.'
        },
        {
          id: 'MEM-FA-02',
          name: 'Pradeep Kushwaha',
          role: 'Council Head (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100015',
          email: 'pradeep.kushwaha@mpdrec.ac.in',
          bio: 'Final-year 3D decor sculptor and fine arts exhibition lead.'
        }
      ],
      secretary: {
        id: 'MEM-FA-03',
        name: 'Soumya Yadav',
        role: 'Secretary (4th Year)',
        year: 4,
        branch: 'Computer Science & Engineering',
        rollNo: '2312140100016',
        email: 'soumya.yadav@mpdrec.ac.in',
        bio: 'Final-year digital illustrator & branding designer.'
      },
      secretaries: [
        {
          id: 'MEM-FA-03',
          name: 'Soumya Yadav',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Computer Science & Engineering',
          rollNo: '2312140100016',
          email: 'soumya.yadav@mpdrec.ac.in',
          bio: 'Final-year digital illustrator & branding designer.'
        },
        {
          id: 'MEM-FA-04',
          name: 'Vishal Yadav',
          role: 'Secretary (4th Year)',
          year: 4,
          branch: 'Mechanical Engineering (ME)',
          rollNo: '2312140400003',
          email: 'vishal.yadav@mpdrec.ac.in',
          bio: 'Final-year installation architect and stage decor supervisor.'
        }
      ],
      executiveMembers: [],
      volunteers: []
    }
  }
];

// INITIAL SEED EVENTS FOR COUNCILS (EMPTY BY DEFAULT)
export const SEED_COUNCIL_EVENTS: CouncilEvent[] = [];

// INITIAL SEED MEDIA GALLERY FOR COUNCILS (EMPTY BY DEFAULT)
export const SEED_COUNCIL_MEDIA: CouncilMediaItem[] = [];
