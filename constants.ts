import type { FacultyMember, Course, Testimonial, FAQItem, GalleryImage, Student, ChatMessage, TeacherQuestion, LiveClass, RecordedLecture, CourseMaterial, CalendarEvent, Notification, Admin, Announcement, Application, RecentSubmission, TeacherRating, BlogPost, HeroSlide, Vlog, AccaFeeCategory, PopupNotification, Comment, HighAchiever } from './types.ts';

export const ACADEMY_LOGO_URL = 'https://scontent.fbhr4-1.fna.fbcdn.net/v/t39.30808-1/529317458_122176712906516643_1248331585587425416_n.jpg?stp=c0.64.1920.1920a_dst-jpg_s200x200_tt6&_nc_cat=104&ccb=1-7&_nc_sid=2d3e12&_nc_ohc=8I2ZS1q_ApEQ7kNvwF37wvl&_nc_oc=Adk2uluXqsn0dXjNMJpxHVBzFmuM74GjLpn7Zg0eLcUG_ywlNUVVs9RvDUpUtNg3-5c&_nc_zt=24&_nc_ht=scontent.fbhr4-1.fna&_nc_gid=ZaRJb_SfrkngjBjjwD8OZQ&oh=00_AfVsUL--_a_dYIsmX724ZUV8imcA4h9Iz6UjupURWsH2AA&oe=68BC2CE7';
export const ACADEMY_NAME = 'Reliant Learners Academy';
export const ACADEMY_EMAIL = 'learnersaccademynp@gmail.com';
export const ACADEMY_PHONE_1 = '+977-9802394518';
export const ACADEMY_PHONE_2 = '+977-9802394519';

export const ADMIN_USER: Admin = {
    id: 'admin01',
    name: 'Admin User',
    email: 'admin@learners.edu',
    avatarUrl: 'https://picsum.photos/seed/admin/100/100',
};

export const NEWS_TICKER_MESSAGES: string[] = [
    "New batch for ACCA Foundation starting July 1st. Enroll now!",
    "Congratulations to our students for achieving a 95% pass rate in the recent exams!",
    "Admissions for the September intake are now open.",
    "Guest lecture by Mr. John Doe, CFO of a leading firm, this Friday.",
];

export const HERO_SLIDES: HeroSlide[] = [
    {
        id: 1,
        url: 'https://picsum.photos/seed/hero-campus/1920/1080',
        alt: 'Vibrant campus life at Learners Academy',
        title: {
            main: 'Shape Your Future in Finance with',
            highlighted: 'Reliant Learners Academy',
        },
        subtitle: 'Your premier destination for ACCA qualifications and professional accounting education.',
        buttons: [
            { to: '/admissions', text: 'Apply Now', variant: 'primary' },
            { to: '/courses', text: 'Explore Courses', variant: 'secondary' },
        ],
    },
    {
        id: 2,
        url: 'https://picsum.photos/seed/hero-classroom/1920/1080',
        alt: 'Students engaged in a modern classroom',
        title: {
            main: 'Expert-Led & Interactive',
            highlighted: 'ACCA Classes',
        },
        subtitle: 'Learn from industry veterans in state-of-the-art facilities designed for your success.',
        buttons: [
            { to: '/about', text: 'Meet Our Faculty', variant: 'primary' },
            { to: '/gallery', text: 'View Our Campus', variant: 'secondary' },
        ],
    },
    {
        id: 3,
        url: 'https://picsum.photos/seed/hero-students/1920/1080',
        alt: 'Successful students celebrating their achievements',
        title: {
            main: 'Join a Community of',
            highlighted: 'Successful Achievers',
        },
        subtitle: 'Benefit from our proven high pass rates and dedicated career support to launch your professional journey.',
        buttons: [
            { to: '/admissions', text: 'Start Your Journey', variant: 'primary' },
            { to: '/blog', text: 'Read Success Stories', variant: 'secondary' },
        ],
    }
];

export const FACULTY_MEMBERS: FacultyMember[] = [
    {
        id: 1,
        name: 'Kabin Pyakurel',
        username: 'kabin.p',
        password: 'password123',
        email: 'kabin.p@learners.edu',
        phone: '+977-9801112221',
        qualification: 'FCCA, MBA',
        bio: 'A passionate educator with over 10 years of experience in teaching professional accounting. Specializes in Financial Reporting and Auditing.',
        imageUrl: 'https://picsum.photos/seed/kabin/400/400',
        assignedPapers: ['FR: Financial Reporting', 'AA: Audit and Assurance', 'SBR: Strategic Business Reporting'],
        address: 'Kathmandu, Nepal'
    },
    {
        id: 2,
        name: 'Susan Bones',
        username: 'susan.b',
        password: 'password123',
        email: 'susan.b@learners.edu',
        phone: '+977-9801112222',
        qualification: 'ACCA, MSc Finance',
        bio: 'Expert in Performance Management and Financial Management, with a knack for simplifying complex topics for students.',
        imageUrl: 'https://picsum.photos/seed/susan/400/400',
        assignedPapers: ['PM: Performance Management', 'FM: Financial Management', 'APM: Advanced Performance Management'],
        address: 'Pokhara, Nepal'
    }
];


export const COURSES: Course[] = [
    {
        id: 'applied-knowledge',
        title: 'ACCA Applied Knowledge',
        level: 'Applied Knowledge',
        description: 'The Applied Knowledge exams are your starting point, providing a broad introduction to the world of finance and accounting. These exams are the essential foundation for your journey towards becoming a qualified professional.',
        duration: '6-12 months',
        eligibility: 'High School / A-Levels',
        papers: ['AB: Accountant in Business', 'MA: Management Accounting', 'FA: Financial Accounting'],
        syllabus: [
            { topic: "Business and Technology (BT)", details: "Understanding business in the context of its environment, including economic, legal, and regulatory influences on aspects like governance, employments, health and safety, data protection and security." },
            { topic: "Management Accounting (MA)", details: "Developing the knowledge and ability to apply management accounting techniques to quantitative and qualitative information for planning, decision-making, performance evaluation and control." },
            { topic: "Financial Accounting (FA)", details: "Developing knowledge and understanding of the underlying principles and concepts relating to financial accounting and technical proficiency in the use of double-entry accounting techniques." },
        ],
        learningOutcomes: [
            "Understand business structures and their purpose.",
            "Master cost accounting and budgeting techniques.",
            "Prepare and interpret financial statements for single entities."
        ],
        facultyIds: [],
        studentIds: []
    },
    {
        id: 'applied-skills',
        title: 'ACCA Applied Skills',
        level: 'Applied Skills',
        description: 'Building on your existing knowledge, the Applied Skills exams develop the strong, broad, and practical finance skills required of a strategic professional. These exams cover key technical areas that all accountants need to know.',
        duration: '12-18 months',
        eligibility: 'ACCA Applied Knowledge or equivalent',
        papers: ['LW: Corporate and Business Law', 'PM: Performance Management', 'TX: Taxation', 'FR: Financial Reporting', 'AA: Audit and Assurance', 'FM: Financial Management'],
        syllabus: [
            { topic: "Corporate and Business Law (LW)", details: "Understanding the general legal framework, and of specific legal areas relating to business, recognising the need to seek further specialist legal advice where necessary." },
            { topic: "Performance Management (PM)", details: "Applying management accounting techniques to quantitative and qualitative information for planning, decision-making, performance evaluation, and control." },
            { topic: "Taxation (TX)", details: "Understanding the tax system as applicable to individuals, single companies, and groups of companies." },
            { topic: "Financial Reporting (FR)", details: "Developing knowledge and skills in understanding and applying accounting standards and the theoretical framework in the preparation of financial statements of entities, including groups and how to analyse and interpret those financial statements." },
            { topic: "Audit and Assurance (AA)", details: "Understanding and applying assurance engagement, including the regulatory framework." },
            { topic: "Financial Management (FM)", details: "Developing the knowledge and skills expected of a financial manager." },
        ],
        learningOutcomes: [
            "Understand legal frameworks for business.",
            "Apply advanced performance management techniques.",
            "Prepare financial statements for groups (consolidated accounts).",
            "Understand the audit process from planning to reporting."
        ],
        facultyIds: [],
        studentIds: []
    },
    {
        id: 'strategic-professional',
        title: 'ACCA Strategic Professional',
        level: 'Strategic Professional',
        description: 'The Strategic Professional exams prepare you for future leadership positions. They develop the strategic vision, expertise, and professional skills needed to make an impact in the workplace and add value to any organization.',
        duration: '12-18 months',
        eligibility: 'ACCA Applied Skills or equivalent',
        papers: ['SBL: Strategic Business Leader', 'SBR: Strategic Business Reporting', 'AFM: Advanced Financial Management', 'APM: Advanced Performance Management', 'ATX: Advanced Taxation', 'AAA: Advanced Audit and Assurance'],
        options: ['SBL: Strategic Business Leader', 'SBR: Strategic Business Reporting', 'AFM: Advanced Financial Management', 'APM: Advanced Performance Management', 'ATX: Advanced Taxation', 'AAA: Advanced Audit and Assurance'],
        maxOptions: 4,
        syllabus: [
            { topic: "Strategic Business Leader (SBL)", details: "Applying excellent leadership and ethical skills to lead organisations effectively." },
            { topic: "Strategic Business Reporting (SBR)", details: "Applying professional judgment in the reporting of financial information." },
            { topic: "Advanced Financial Management (AFM)", details: "Advising management and/or clients on complex strategic financial management issues." },
            { topic: "Advanced Performance Management (APM)", details: "Applying relevant knowledge, skills and exercise professional judgement in selecting and applying strategic management accounting techniques in different business contexts." },
        ],
        learningOutcomes: [
            "Demonstrate effective leadership and ethical decision-making.",
            "Evaluate and communicate business reporting implications.",
            "Master advanced investment and financing strategies.",
            "Apply strategic management accounting techniques."
        ],
        facultyIds: [],
        studentIds: []
    }
];

export const TESTIMONIALS: Testimonial[] = [
    {
        id: 1,
        name: 'Rohan Thapa',
        program: 'ACCA Applied Skills',
        quote: "The faculty at Learners Academy is top-notch. Their guidance and personalized attention were crucial for my success in the FR and AA papers.",
        imageUrl: 'https://picsum.photos/seed/rohan/200/200',
    },
    {
        id: 2,
        name: 'Anjali Lama',
        program: 'ACCA Strategic Professional',
        quote: "I'm grateful for the supportive learning environment and the extensive mock exam practice. It made a huge difference in my confidence and exam performance.",
        imageUrl: 'https://picsum.photos/seed/anjali/200/200',
    },
    {
        id: 3,
        name: 'Bikash Shrestha',
        program: 'ACCA Foundation',
        quote: "As a beginner, the foundational courses were explained with such clarity. I built a strong base here which is helping me in the higher levels.",
        imageUrl: 'https://picsum.photos/seed/bikash/200/200',
    }
];

export const FAQ_DATA: FAQItem[] = [
    { question: 'What is the duration of the ACCA course?', answer: 'The ACCA qualification can be completed in as little as 2-3 years, but this can vary depending on your starting level, number of exemptions, and how many papers you sit per session.' },
    { question: 'Are there any entry requirements for ACCA?', answer: 'For the ACCA Qualification, you generally need a minimum of two A-Levels and three GCSEs (or their equivalents) in five separate subjects, including English and Maths. If you don\'t meet these, you can start with the Foundations in Accountancy qualifications.' },
    { question: 'How many exams are there in ACCA?', answer: 'There are a total of 13 exams, split into three levels: Applied Knowledge (3 exams), Applied Skills (6 exams), and Strategic Professional (4 exams).' },
    { question: 'Does Learners Academy provide study materials?', answer: 'Yes, we provide comprehensive, up-to-date study materials, including lecture notes, question banks, and mock exams, all included in your course fees.' },
    { question: 'Can I pay my fees in installments?', answer: 'Yes, we offer flexible installment plans to make the course more affordable. Please contact our admissions office for details on the payment schedule.' }
];

export const GALLERY_IMAGES: GalleryImage[] = [
    { id: 1, type: 'image', src: 'https://picsum.photos/seed/campus-1/600/400', alt: 'Main campus building', category: 'Campus' },
    { id: 2, type: 'image', src: 'https://picsum.photos/seed/events-1/600/400', alt: 'Annual student orientation day', category: 'Events' },
    { id: 3, type: 'image', src: 'https://picsum.photos/seed/class-1/600/400', alt: 'Modern classroom with interactive whiteboard', category: 'Classrooms' },
    { id: 4, type: 'image', src: 'https://picsum.photos/seed/students-1/600/400', alt: 'Group of students studying in the library', category: 'Students' },
    { id: 5, type: 'image', src: 'https://picsum.photos/seed/campus-2/600/400', alt: 'Campus garden area', category: 'Campus' },
    { id: 6, type: 'image', src: 'https://picsum.photos/seed/events-2/600/400', alt: 'Guest lecture seminar', category: 'Events' },
    { id: 7, type: 'image', src: 'https://picsum.photos/seed/class-2/600/400', alt: 'Computer lab session', category: 'Classrooms' },
    { id: 8, type: 'image', src: 'https://picsum.photos/seed/students-2/600/400', alt: 'Students collaborating on a project', category: 'Students' }
];

export const STUDENTS: Student[] = [
    {
        id: 1,
        name: 'Aarav Sharma',
        avatarUrl: 'https://picsum.photos/seed/aarav/100/100',
        studentId: 'S12345',
        password: 'password123',
        email: 'aarav.s@example.com',
        phone: '+977-9841000001',
        address: 'Kathmandu, Nepal',
        dob: '2002-05-15',
        enrollmentDate: '2023-09-01',
        currentLevel: 'Applied Skills',
        enrolledPapers: ['FR', 'AA', 'PM'],
        totalFee: 150000,
        discount: 10000,
        grades: {
            'FR': [{ score: 65, date: '2024-03-10', examType: 'Mock' }],
            'PM': [{ score: 72, date: '2024-03-12', examType: 'Mock' }],
        },
        attendance: { 'FR': 95, 'PM': 92 },
        paymentHistory: [
            { invoiceId: 'INV001', date: '2023-09-01', amount: 70000, status: 'Paid', method: 'eSewa', verifiedBy: 'Admin' },
            { invoiceId: 'INV002', date: '2024-01-15', amount: 70000, status: 'Paid', method: 'Khalti', verifiedBy: 'Admin' }
        ],
        dueDate: '2024-08-15'
    },
    {
        id: 2,
        name: 'Priya Gurung',
        avatarUrl: 'https://picsum.photos/seed/priya/100/100',
        studentId: 'S12346',
        password: 'password123',
        email: 'priya.g@example.com',
        phone: '+977-9841000002',
        address: 'Lalitpur, Nepal',
        dob: '2003-01-20',
        enrollmentDate: '2024-01-10',
        currentLevel: 'Applied Knowledge',
        enrolledPapers: ['AB', 'MA', 'FA'],
        totalFee: 65000,
        discount: 5000,
        grades: {
            'AB': [{ score: 85, date: '2024-06-05', examType: 'Mock' }],
        },
        attendance: { 'AB': 98 },
        paymentHistory: [
            { invoiceId: 'INV003', date: '2024-01-10', amount: 60000, status: 'Paid', method: 'Cash', verifiedBy: 'Admin' }
        ],
        dueDate: '2024-09-10'
    }
];

export const HIGH_ACHIEVERS: HighAchiever[] = [
    { id: 1, name: 'Aarav Sharma', avatarUrl: 'https://picsum.photos/seed/aarav/200/200', achievement: 'Scored 85 in AB' },
    { id: 2, name: 'Rohan Thapa', avatarUrl: 'https://picsum.photos/seed/rohan/200/200', achievement: 'Scored 91 in FR' },
    { id: 3, name: 'Anjali Lama', avatarUrl: 'https://picsum.photos/seed/anjali/200/200', achievement: 'Scored 88 in SBR' },
    { id: 4, name: 'Bikash Shrestha', avatarUrl: 'https://picsum.photos/seed/bikash/200/200', achievement: 'Scored 95 in TX' },
    { id: 5, name: 'Sita Rai', avatarUrl: 'https://picsum.photos/seed/sita/200/200', achievement: 'World Rank Holder in PM' },
    { id: 6, name: 'Gopal Verma', avatarUrl: 'https://picsum.photos/seed/gopal/200/200', achievement: 'Scored 93 in AA' },
    { id: 7, name: 'Maya Tamang', avatarUrl: 'https://picsum.photos/seed/maya/200/200', achievement: 'Topped Nepal in SBL' },
    { id: 8, name: 'Hari KC', avatarUrl: 'https://picsum.photos/seed/hari/200/200', achievement: 'Scored 90 in FM' },
];


export const CHAT_MESSAGES: ChatMessage[] = [];

export const TEACHER_QUESTIONS: TeacherQuestion[] = [];

export const LIVE_CLASSES: LiveClass[] = [
    { id: 1, paper: 'FR: Financial Reporting', topic: 'Consolidated Statement of Financial Position', instructor: 'Kabin Pyakurel', startTime: '10:00 AM', status: 'Live', joinLink: '#' },
    { id: 2, paper: 'AA: Audit and Assurance', topic: 'Audit Risk and Planning', instructor: 'Susan Bones', startTime: '02:00 PM', status: 'Upcoming', joinLink: '#' },
];

export const RECORDED_LECTURES: RecordedLecture[] = [
    { id: 1, paper: 'FR', topic: 'IFRS 15 - Revenue from Contracts with Customers', date: '2024-07-15', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 2, paper: 'FR', topic: 'IAS 16 - Property, Plant and Equipment', date: '2024-07-18', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
];

export const COURSE_MATERIALS: CourseMaterial[] = [
    { id: 1, paper: 'FR', title: 'Chapter 5 Notes - Leases', type: 'PDF', uploadDate: '2024-07-10', downloadLink: '#' },
    { id: 2, paper: 'FR', title: 'Consolidation Assignment', type: 'Assignment', uploadDate: '2024-07-20', downloadLink: '#' },
    { id: 3, paper: 'AA', title: 'Audit Risk Case Study', type: 'Notes', uploadDate: '2024-07-19', downloadLink: '#' },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
    { id: 1, date: '2024-07-22', title: 'Consolidated Statement of Financial Position', type: 'class', startTime: '10:00 AM', endTime: '12:00 PM', paper: 'FR', instructor: 'Kabin Pyakurel', joinLink: '#' },
    { id: 2, date: '2024-07-22', title: 'Audit Risk and Planning', type: 'class', startTime: '02:00 PM', endTime: '04:00 PM', paper: 'AA', instructor: 'Susan Bones', joinLink: '#' },
    { id: 3, date: '2024-07-25', title: 'Consolidation Assignment Due', type: 'deadline', paper: 'FR' },
    { id: 4, date: '2024-07-29', title: 'FR Mock Exam', type: 'exam', paper: 'FR', startTime: '09:00 AM', endTime: '12:00 PM' },
];

export const NOTIFICATIONS: Notification[] = [
    { id: 1, type: 'grade', title: 'New Grade Published', message: 'Your mock exam result for FR has been published.', timestamp: '2 hours ago', read: false },
    { id: 2, type: 'deadline', title: 'Assignment Due Soon', message: 'Your FR consolidation assignment is due in 3 days.', timestamp: '1 day ago', read: false },
    { id: 3, type: 'material', title: 'New Material Added', message: 'Chapter 6 notes for AA have been uploaded.', timestamp: '2 days ago', read: true },
];

export const GLOBAL_ANNOUNCEMENTS: Announcement[] = [
    { id: 1, title: 'Mid-term Break', content: 'The academy will be closed for mid-term break from Aug 1st to Aug 5th.', date: '2024-07-20', author: 'Admin', audience: 'All Students & Faculty' },
];
export const FACULTY_ANNOUNCEMENTS: Announcement[] = [
    { id: 101, title: 'FR Mock Exam Schedule', content: 'Please ensure all mock exam grades for the FR paper are submitted by July 28th.', date: '2024-07-22', author: 'Kabin Pyakurel', audience: 'FR: Financial Reporting' },
];

export const PENDING_APPLICATIONS: Application[] = [];

export const TEACHER_RATINGS: TeacherRating[] = [];

export const BLOG_POSTS: BlogPost[] = [
    {
        id: '5-tips-for-acca-fr-exam',
        title: '5 Essential Tips to Ace Your ACCA Financial Reporting (FR) Exam',
        authorId: 1, // Kabin Pyakurel
        authorType: 'faculty',
        publicationDate: '2024-07-20',
        excerpt: 'The Financial Reporting (FR) exam is a significant step in your ACCA journey. Here are five proven tips from our expert faculty to help you succeed.',
        content: `<h3>Introduction</h3><p>The ACCA Financial Reporting (FR) exam can be challenging, but with the right preparation, you can pass with confidence. This guide provides five essential tips to help you structure your studies and master the syllabus.</p><h3>1. Master the Accounting Standards</h3><p>A deep understanding of International Financial Reporting Standards (IFRS) is non-negotiable. Don't just memorize them; understand the principles behind each standard. Practice applying them to various scenarios, especially for standards like IFRS 15 (Revenue), IFRS 16 (Leases), and IAS 16 (Property, Plant and Equipment).</p><h3>2. Practice Consolidation Questions Religiously</h3><p>Consolidated financial statements are a cornerstone of the FR exam and often carry significant marks. Ensure you are comfortable with preparing consolidated statements of financial position, profit or loss, and other comprehensive income. Pay close attention to workings for goodwill, non-controlling interest (NCI), and retained earnings.</p><h3>3. Time Management is Key</h3><p>The exam is time-pressured. Practice questions under strict exam conditions to improve your speed and accuracy. Allocate your time based on the marks available for each question—roughly 1.8 minutes per mark. If you get stuck, move on and come back later if time permits.</p>`,
        imageUrl: 'https://picsum.photos/seed/blog-fr/1200/800',
        tags: ['ACCA', 'FR', 'Exam Tips'],
        status: 'Published',
        isFeatured: true,
        timeToRead: 5,
        comments: [
            { id: 1, authorName: 'Aarav Sharma', text: 'This is super helpful! The consolidation tip is a lifesaver.', timestamp: '2024-07-21T10:00:00Z' }
        ]
    },
    {
        id: 'a-students-guide-to-performance-management',
        title: "A Student's Guide to Performance Management (PM)",
        authorId: 2, // Priya Gurung
        authorType: 'student',
        publicationDate: '2024-07-18',
        excerpt: 'As a student currently tackling the Applied Skills level, I wanted to share my personal strategies for navigating the Performance Management (PM) paper.',
        content: `<h3>My PM Journey</h3><p>Performance Management (PM) is more than just numbers; it's about understanding how a business measures and manages its success. Initially, I found the breadth of the syllabus daunting, from costing techniques to variance analysis. Here's how I broke it down.</p><h3>Focus on Application, Not Just Theory</h3><p>The key to PM is applying techniques to real-world scenarios. Don't just learn the formula for variance; understand what it tells a manager about the business's performance. The examiner is looking for your ability to interpret the data and provide meaningful advice.</p>`,
        imageUrl: 'https://picsum.photos/seed/blog-pm/1200/800',
        tags: ['ACCA', 'PM', 'Student Life'],
        status: 'Published',
        isFeatured: false,
        timeToRead: 4,
        comments: []
    }
];

export const VLOGS: Vlog[] = [
    { id: 1, title: "A Day in the Life of an ACCA Student", description: "Follow along for a typical day of classes, study sessions, and fun at Learners Academy.", sourceType: 'url', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: 'https://picsum.photos/seed/vlog-1/600/400', publicationDate: "2024-07-15" },
    { id: 2, title: "Campus Tour", description: "Join us for a virtual tour of our state-of-the-art campus and facilities.", sourceType: 'url', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', thumbnailUrl: 'https://picsum.photos/seed/vlog-2/600/400', publicationDate: "2024-07-10" },
];

export const ACCA_FEE_STRUCTURE: AccaFeeCategory[] = [
    {
        level: 'Initial Registration & Subscription',
        items: [
            { details: 'One-time registration fee payable to ACCA', ukPounds: 89, ukFeesNrs: 14240, collegeFeesNrs: 5000 },
            { details: 'Annual Subscription Fee', ukPounds: 122, ukFeesNrs: 19520 }
        ],
    },
    {
        level: 'ACCA Knowledge Level',
        description: 'Fees per paper',
        items: [
            { paper: 'AB', details: 'Accountant in Business', ukPounds: 84, ukFeesNrs: 13440, collegeFeesNrs: 20000 },
            { paper: 'MA', details: 'Management Accounting', ukPounds: 84, ukFeesNrs: 13440, collegeFeesNrs: 20000 },
            { paper: 'FA', details: 'Financial Accounting', ukPounds: 84, ukFeesNrs: 13440, collegeFeesNrs: 20000 }
        ],
        subtotals: {
            ukFeesNrs: 40320,
            collegeFeesNrs: 60000,
        }
    },
    {
        level: 'ACCA Skills Level',
        description: 'Fees per paper',
        items: [
            { paper: 'LW', details: 'Corporate and Business Law', ukPounds: 132, ukFeesNrs: 21120, collegeFeesNrs: 25000 },
            { paper: 'PM', details: 'Performance Management', ukPounds: 132, ukFeesNrs: 21120, collegeFeesNrs: 25000 },
            { paper: 'TX', details: 'Taxation', ukPounds: 132, ukFeesNrs: 21120, collegeFeesNrs: 25000 },
            { paper: 'FR', details: 'Financial Reporting', ukPounds: 132, ukFeesNrs: 21120, collegeFeesNrs: 25000 },
            { paper: 'AA', details: 'Audit and Assurance', ukPounds: 132, ukFeesNrs: 21120, collegeFeesNrs: 25000 },
            { paper: 'FM', details: 'Financial Management', ukPounds: 132, ukFeesNrs: 21120, collegeFeesNrs: 25000 },
        ],
         subtotals: {
            ukFeesNrs: 126720,
            collegeFeesNrs: 150000,
        }
    },
    {
        level: 'Strategic Professional',
        description: 'Essentials (Compulsory)',
        items: [
             { paper: 'SBL', details: 'Strategic Business Leader', ukPounds: 245, ukFeesNrs: 39200, collegeFeesNrs: 30000 },
             { paper: 'SBR', details: 'Strategic Business Reporting', ukPounds: 180, ukFeesNrs: 28800, collegeFeesNrs: 30000 },
        ],
    },
    {
        level: 'Strategic Professional Options',
        description: 'Choose any 2 from 4',
        items: [
            { paper: 'AFM', details: 'Advanced Financial Management', ukPounds: 180, ukFeesNrs: 28800, collegeFeesNrs: 30000 },
            { paper: 'APM', details: 'Advanced Performance Management', ukPounds: 180, ukFeesNrs: 28800, collegeFeesNrs: 30000 },
            { paper: 'ATX', details: 'Advanced Taxation', ukPounds: 180, ukFeesNrs: 28800, collegeFeesNrs: 30000 },
            { paper: 'AAA', details: 'Advanced Audit and Assurance', ukPounds: 180, ukFeesNrs: 28800, collegeFeesNrs: 30000 },
        ],
        notes: "Students must select and pass two optional papers."
    }
];

export const POPUP_NOTIFICATION: PopupNotification[] = [
    {
        id: 1,
        title: "New ACCA Batch Starting Soon!",
        content: "Admissions are now open for our upcoming September intake. Secure your spot and start your journey to becoming a finance professional.",
        imageUrl: "https://picsum.photos/seed/popup-admissions/600/400",
        isActive: true,
        link: "/admissions",
        linkText: "Apply Now"
    }
];

// ... any other exports that might have been truncated