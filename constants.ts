

import type { FacultyMember, Course, Testimonial, FAQItem, GalleryImage, Student, ChatMessage, TeacherQuestion, LiveClass, RecordedLecture, CourseMaterial, CalendarEvent, Notification, Admin, Announcement, Application, RecentSubmission, TeacherRating, BlogPost, HeroSlide, Vlog, AccaFeeCategory, PopupNotification, Comment } from './types';

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
        phone: '+977 9801234567',
        qualification: 'FCCA, PhD', 
        bio: 'Specializes in Financial and Corporate Reporting with over 15 years of teaching experience.', 
        imageUrl: 'https://picsum.photos/seed/kabin/400/400',
        assignedPapers: ['FA', 'FR'],
        address: '123 Faculty Row, Kathmandu',
    },
    { 
        id: 2, 
        name: 'Emily White', 
        username: 'emily.w',
        password: 'password123',
        email: 'emily.w@learners.edu', 
        phone: '+977 9801234568',
        qualification: 'ACCA, MBA', 
        bio: 'An expert in Taxation and Business Law, known for her practical and exam-focused teaching methods.', 
        imageUrl: 'https://picsum.photos/seed/emily/400/400',
        assignedPapers: ['LW', 'TX'],
        address: '456 Teacher Lane, Patan',
    },
    { 
        id: 3, 
        name: 'Robert Brown', 
        username: 'robert.b',
        password: 'password123',
        email: 'robert.b@learners.edu', 
        phone: '+977 9801234569',
        qualification: 'CIMA, MSc', 
        bio: 'Focuses on Performance and Financial Management, helping students master complex calculations and theories.', 
        imageUrl: 'https://picsum.photos/seed/robert/400/400',
        assignedPapers: ['PM', 'FM'],
        address: '789 Professor Street, Bhaktapur',
    },
     { 
        id: 4, 
        name: 'Susan Bones', 
        username: 'susan.b',
        password: 'password123',
        email: 'susan.b@learners.edu', 
        phone: '+977 9801234570',
        qualification: 'ACA', 
        bio: 'A specialist in Audit and Assurance, bringing real-world audit experience into the classroom.', 
        imageUrl: 'https://picsum.photos/seed/susan/400/400',
        assignedPapers: ['AA'],
        address: '101 Tutor Avenue, Lalitpur',
    },
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
        facultyIds: [1, 2],
        studentIds: [1, 2, 3]
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
        facultyIds: [1, 2, 3, 4],
        studentIds: [1, 2, 3, 4, 5, 6]
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
        facultyIds: [1, 3, 4],
        studentIds: [4, 5, 6]
    }
];

export const TESTIMONIALS: Testimonial[] = [
    { id: 1, name: 'Alex Doe', program: 'ACCA Applied Skills', quote: 'The faculty at Learners Academy are top-notch. Their guidance was instrumental in helping me pass my FR and AA exams on the first attempt!', imageUrl: 'https://picsum.photos/seed/alex/200/200' },
    { id: 2, name: 'Priya Sharma', program: 'ACCA Strategic Professional', quote: 'I highly recommend Learners Academy for their structured approach and excellent study materials. The SBL case study preparation was particularly outstanding.', imageUrl: 'https://picsum.photos/seed/priya/200/200' },
    { id: 3, name: 'Binod Chaudhary', program: 'ACCA Applied Knowledge', quote: 'As a beginner, I found the classes easy to follow and very engaging. The tutors are patient and always willing to help. A great start to my ACCA journey.', imageUrl: 'https://picsum.photos/seed/binod/200/200' }
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
        id: 1, name: 'Alex Doe', avatarUrl: 'https://picsum.photos/seed/alex/200/200', studentId: 'S12345', password: 'password123',
        email: 'alex.doe@example.com', phone: '+977 9801234567', address: '123 Learning Lane, Kathmandu',
        dob: '2003-01-15', enrollmentDate: '2023-09-01', currentLevel: 'Applied Skills',
        enrolledPapers: ['LW', 'PM', 'TX', 'FR', 'AA', 'FM'],
        totalFee: 150000, discount: 10000, feeRemarks: 'Includes 10% scholarship discount.',
        grades: {
            'LW': [{ score: 78, date: '2024-03-10', examType: 'Mock' }],
            'PM': [{ score: 65, date: '2024-03-12', examType: 'Mock' }],
            'TX': [{ score: 85, date: '2024-06-15', examType: 'Mock' }],
            'FR': [{ score: 72, date: '2024-06-18', examType: 'Mock' }],
        },
        attendance: { 'LW': 95, 'PM': 92, 'TX': 98, 'FR': 91, 'AA': 96, 'FM': 93 },
        paymentHistory: [
            { invoiceId: 'INV-2023-001', date: '2023-09-01', amount: 50000, status: 'Paid', method: 'eSewa', remarks: 'First installment.' },
            { invoiceId: 'INV-2024-005', date: '2024-01-15', amount: 50000, status: 'Paid', method: 'Cash', remarks: 'Second installment.' },
            { invoiceId: 'INV-2024-011', date: '2024-07-25', amount: 10000, status: 'Rejected', method: 'Khalti', remarks: 'Trying to pay for books.', rejectionReason: 'This payment is for books, not tuition fees.' }
        ],
        dueDate: '2024-08-15'
    },
    {
        id: 2, name: 'Priya Sharma', avatarUrl: 'https://picsum.photos/seed/priya/200/200', studentId: 'S12346', password: 'password123',
        email: 'priya.sharma@example.com', phone: '+977 9801234568', address: '456 Wisdom Way, Patan',
        dob: '2002-05-20', enrollmentDate: '2023-09-01', currentLevel: 'Applied Skills',
        enrolledPapers: ['LW', 'PM', 'TX'],
        totalFee: 75000, discount: 0,
        grades: {
            'LW': [{ score: 82, date: '2024-03-10', examType: 'Mock' }],
            'PM': [{ score: 75, date: '2024-03-12', examType: 'Mock' }],
        },
        attendance: { 'LW': 98, 'PM': 95, 'TX': 97 },
        paymentHistory: [
            { invoiceId: 'INV-2023-002', date: '2023-09-02', amount: 75000, status: 'Paid', method: 'Khalti' }
        ],
        dueDate: '2024-08-15'
    },
    {
        id: 3, name: 'Binod Chaudhary', avatarUrl: 'https://picsum.photos/seed/binod/200/200', studentId: 'S12347', password: 'password123',
        email: 'binod.chaudhary@example.com', phone: '+977 9801234569', address: '789 Success Street, Bhaktapur',
        dob: '2004-03-10', enrollmentDate: '2024-01-15', currentLevel: 'Applied Knowledge',
        enrolledPapers: ['AB', 'MA', 'FA'],
        totalFee: 60000, discount: 5000, feeRemarks: 'Early bird registration discount.',
        grades: {},
        attendance: { 'AB': 90, 'MA': 88, 'FA': 92 },
        paymentHistory: [
            { invoiceId: 'INV-2024-001', date: '2024-01-15', amount: 55000, status: 'Paid', method: 'Cash' }
        ],
        dueDate: '2024-09-15'
    },
    {
        id: 4, name: 'Sita Rai', avatarUrl: 'https://picsum.photos/seed/sita/200/200', studentId: 'S12348', password: 'password123',
        email: 'sita.rai@example.com', phone: '+977 9801234570', address: '101 Knowledge Ave, Lalitpur',
        dob: '2003-08-25', enrollmentDate: '2023-09-01', currentLevel: 'Strategic Professional',
        enrolledPapers: ['SBL', 'SBR'],
        totalFee: 90000, discount: 0,
        grades: {},
        attendance: { 'SBL': 94, 'SBR': 91 },
        paymentHistory: [
            { invoiceId: 'INV-2023-004', date: '2023-09-01', amount: 45000, status: 'Paid', method: 'Mobile Banking' }
        ],
        dueDate: '2024-09-15'
    },
    {
        id: 5, name: 'Hari Thapa', avatarUrl: 'https://picsum.photos/seed/hari/200/200', studentId: 'S12349', password: 'password123',
        email: 'hari.thapa@example.com', phone: '+977 9801234571', address: '222 Scholar Road, Kathmandu',
        dob: '2002-11-30', enrollmentDate: '2023-03-01', currentLevel: 'Strategic Professional',
        enrolledPapers: ['AFM', 'APM'],
        totalFee: 90000, discount: 15000,
        grades: {
            'AFM': [{ score: 68, date: '2024-06-20', examType: 'Mock' }]
        },
        attendance: { 'AFM': 89, 'APM': 93 },
        paymentHistory: [
            { invoiceId: 'INV-2023-005', date: '2023-03-01', amount: 45000, status: 'Paid', method: 'eSewa' },
            { invoiceId: 'INV-2024-002', date: '2024-03-01', amount: 30000, status: 'Paid', method: 'Cash' }
        ],
        dueDate: '2024-10-15'
    },
    {
        id: 6, name: 'Gita Gurung', avatarUrl: 'https://picsum.photos/seed/gita/200/200', studentId: 'S12350', password: 'password123',
        email: 'gita.gurung@example.com', phone: '+977 9801234572', address: '333 University Blvd, Patan',
        dob: '2003-06-05', enrollmentDate: '2023-03-01', currentLevel: 'Strategic Professional',
        enrolledPapers: ['ATX', 'AAA'],
        totalFee: 90000, discount: 0,
        grades: {},
        attendance: { 'ATX': 96, 'AAA': 90 },
        paymentHistory: [
            { invoiceId: 'INV-2023-006', date: '2023-03-01', amount: 45000, status: 'Paid', method: 'ConnectIPS' },
            { invoiceId: 'INV-2024-010', date: '2024-07-20', amount: 45000, status: 'Pending Verification', method: 'eSewa', remarks: 'Final installment payment.', screenshotUrl: 'https://i.imgur.com/g2yEV1g.png' }
        ],
        dueDate: '2024-08-01'
    }
];

export const CHAT_MESSAGES: ChatMessage[] = [
    { id: 1, studentId: 2, text: "Hey everyone, did anyone finish the FR assignment?", timestamp: "10:30 AM" },
    { id: 2, studentId: 1, text: "Almost done! Section B is a bit tricky.", timestamp: "10:31 AM" },
    { id: 3, studentId: 3, text: "I'm stuck on question 2. Any hints?", timestamp: "10:35 AM" },
    { id: 4, studentId: 1, text: "Check chapter 5 again, the example on leases is very similar.", timestamp: "10:36 AM", attachment: { type: 'link', url: 'https://example-resource.com/leases' } },
];

export const TEACHER_QUESTIONS: TeacherQuestion[] = [
    { id: 1, studentId: 1, studentName: 'Alex Doe', paper: 'FR: Financial Reporting', question: 'In the consolidation of financial statements, how do we treat goodwill on acquisition?', status: 'Answered', askedDate: '2024-07-20', answer: 'Goodwill is calculated as the excess of the consideration transferred over the net assets acquired at fair value. It is then tested for impairment annually.', answeredBy: 'Kabin Pyakurel' },
    { id: 2, studentId: 2, studentName: 'Priya Sharma', paper: 'PM: Performance Management', question: 'Can you explain the difference between absorption and marginal costing in profit reporting?', status: 'Pending', askedDate: '2024-07-21' },
];

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

export const PENDING_APPLICATIONS: Application[] = [
    { id: 1, fullName: 'John Stone', email: 'john.s@example.com', program: 'ACCA Applied Skills', submittedDate: '2024-07-20', status: 'Pending', phone: '+977 9801112233', photoUrl: 'https://picsum.photos/seed/john/200/200' },
];

export const TEACHER_RATINGS: TeacherRating[] = [
    { id: 1, teacherId: 1, teacherName: 'Kabin Pyakurel', studentId: 1, studentName: 'Alex Doe', rating: 5, feedback: 'Excellent explanation of consolidation concepts. Very clear and helpful.', classTopic: 'Consolidated Statement of Financial Position', date: '2024-07-22' }
];

export const BLOG_POSTS: BlogPost[] = [
    { 
        id: 'mastering-sbl', 
        title: '5 Tips for Mastering the Strategic Business Leader (SBL) Exam', 
        authorId: 2,
        authorType: 'faculty', 
        publicationDate: '2024-07-18', 
        excerpt: 'The SBL exam is unique. It\'s not about memorizing facts, but about applying your knowledge in a real-world context. Here are five tips to help you succeed.', 
        content: '<h3>Understand the Syllabus</h3><p>The SBL syllabus is vast, covering governance, risk, ethics, and strategy. Break it down into manageable chunks and focus on understanding the core concepts rather than rote learning. Create mind maps to connect different areas of the syllabus.</p><h3>Practice, Practice, Practice</h3><p>There is no substitute for practicing past exam papers. This helps you get used to the format, timing, and the type of questions asked. Pay close attention to the professional skills marks, as they can make a significant difference to your final score.</p>', 
        imageUrl: 'https://picsum.photos/seed/blog-sbl/1200/800', 
        tags: ['SBL', 'Strategic Professional', 'Exam Tips'],
        status: 'Published',
        isFeatured: true,
        timeToRead: 3
    },
    { 
        id: 'fr-vs-sbr', 
        title: 'Financial Reporting (FR) vs. Strategic Business Reporting (SBR)', 
        authorId: 1, 
        authorType: 'faculty',
        publicationDate: '2024-06-25', 
        excerpt: 'Many students wonder about the jump from FR to SBR. While both deal with reporting, their focus and depth are quite different. Let\'s explore the key distinctions.', 
        content: '<h3>Depth of Knowledge</h3><p>FR focuses on the application of accounting standards to produce financial statements. SBR, on the other hand, requires you to evaluate and advise on the reporting implications of transactions and ethical issues. It is less about calculation and more about judgement.</p>', 
        imageUrl: 'https://picsum.photos/seed/blog-fr-sbr/1200/800', 
        tags: ['FR', 'SBR', 'Syllabus'],
        status: 'Published',
        isFeatured: false,
        timeToRead: 2
    },
    { 
        id: 'acca-career-paths', 
        title: 'Top Career Paths for ACCA Graduates in Nepal', 
        authorId: 3, 
        authorType: 'faculty',
        publicationDate: '2024-05-30', 
        excerpt: 'Completing your ACCA qualification opens up a world of opportunities. Here are some of the most promising career paths for ACCA members in the current Nepali market.', 
        content: '<h3>Audit and Assurance</h3><p>This is a traditional and highly respected career path. Working for an audit firm, you will be responsible for examining the financial records of companies to ensure they are accurate and comply with regulations.</p>', 
        imageUrl: 'https://picsum.photos/seed/blog-career/1200/800', 
        tags: ['Career', 'ACCA', 'Nepal'],
        status: 'Published',
        isFeatured: false,
        timeToRead: 4
    },
    { 
        id: 'draft-post-example', 
        title: 'The Future of AI in Accounting (Draft)', 
        authorId: 1, 
        authorType: 'faculty',
        publicationDate: '2024-07-25', 
        excerpt: 'Exploring how artificial intelligence is set to revolutionize the accounting profession, from automation to predictive analysis.', 
        content: '<h3>Introduction to AI</h3><p>AI is more than just a buzzword. It\'s a powerful tool that will change how we work.</p>', 
        imageUrl: 'https://picsum.photos/seed/blog-ai/1200/800', 
        tags: ['AI', 'Future', 'Technology'],
        status: 'Draft',
        isFeatured: false,
        timeToRead: 1
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