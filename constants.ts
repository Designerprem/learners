

import type { FacultyMember, Course, Testimonial, FAQItem, GalleryImage, Student, ChatMessage, TeacherQuestion, LiveClass, RecordedLecture, CourseMaterial, FeeSummary, PaymentHistoryItem, CalendarEvent, Notification, Admin, Announcement, Application, RecentSubmission, TeacherRating, StudentFeeRecord, BlogPost } from './types';

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

export const FACULTY_MEMBERS: FacultyMember[] = [
    { id: 1, name: 'Dr. Jane Smith', email: 'jane.smith@learners.edu', phone: '+977 9851012345', qualification: 'PhD, FCCA', bio: 'With over 15 years of teaching experience, Dr. Smith is an expert in Financial Reporting and Auditing.', imageUrl: 'https://picsum.photos/seed/jane/400/400', assignedPapers: ['FR: Financial Reporting', 'AA: Audit and Assurance', 'SBR: Strategic Business Reporting'] },
    { id: 2, name: 'Mr. Robert Brown', email: 'robert.brown@learners.edu', phone: '+977 9851023456', qualification: 'MBA, ACCA', bio: 'Mr. Brown brings a wealth of industry knowledge, specializing in Performance Management and Financial Management.', imageUrl: 'https://picsum.photos/seed/robert/400/400', assignedPapers: ['PM: Performance Management', 'FM: Financial Management', 'AFM: Advanced Financial Management'] },
    { id: 3, name: 'Ms. Emily White', email: 'emily.white@learners.edu', phone: '+977 9851034567', qualification: 'ACCA, MSc Accounting', bio: 'Ms. White is known for her engaging teaching style in Taxation and Corporate Law.', imageUrl: 'https://picsum.photos/seed/emily/400/400', assignedPapers: ['TX: Taxation', 'LW: Corporate and Business Law'] },
    { id: 4, name: 'Mr. Michael Green', email: 'michael.green@learners.edu', phone: '+977 9851045678', qualification: 'FCCA', bio: 'A seasoned professional, Mr. Green mentors students in Strategic Business Leadership and Ethics.', imageUrl: 'https://picsum.photos/seed/michael/400/400', assignedPapers: ['SBL: Strategic Business Leader'] },
    { id: 5, name: 'Mr. David Chen', email: 'david.chen@learners.edu', phone: '+977 9851056789', qualification: 'CPA, ACCA', bio: 'David is an expert in Advanced Performance Management and has a passion for case study analysis.', imageUrl: 'https://picsum.photos/seed/davidchen/400/400', assignedPapers: ['APM: Advanced Performance Management'] },
];

export const COURSES: Course[] = [
    {
        id: 'acca-knowledge',
        title: 'ACCA Applied Knowledge',
        level: 'Applied Knowledge',
        description: 'The starting point of the ACCA Qualification, this level introduces you to the world of finance and accounting. It provides a broad understanding of essential accounting techniques.',
        duration: '6-9 months',
        eligibility: 'Open entry. No previous qualifications required.',
        papers: ['BT: Business and Technology', 'MA: Management Accounting', 'FA: Financial Accounting'],
        syllabus: [
            { topic: "Business and Technology (BT)", details: "Understand the business environment and its influence on organizations." },
            { topic: "Management Accounting (MA)", details: "Learn techniques for costing, budgeting, and performance management." },
            { topic: "Financial Accounting (FA)", details: "Develop knowledge of the underlying principles and concepts of financial accounting." },
        ],
        learningOutcomes: [
            "Understand business structures and the role of accounting.",
            "Prepare basic financial statements for single entities.",
            "Use management accounting techniques to support decision-making.",
        ],
        facultyIds: [2, 3],
        studentIds: [3, 4],
    },
    {
        id: 'acca-skills',
        title: 'ACCA Applied Skills',
        level: 'Applied Skills',
        description: 'Building on your existing knowledge, this level equips you with the strong, practical finance skills required for a future as a professional accountant.',
        duration: '12-18 months',
        eligibility: 'Completion of Applied Knowledge exams or a relevant degree.',
        papers: ['LW: Corporate and Business Law', 'PM: Performance Management', 'TX: Taxation', 'FR: Financial Reporting', 'AA: Audit and Assurance', 'FM: Financial Management'],
        syllabus: [
            { topic: "Financial Reporting (FR)", details: "Learn to apply accounting standards and the theoretical framework in the preparation of financial statements." },
            { topic: "Audit and Assurance (AA)", details: "Understand the process of carrying out an assurance engagement and its application." },
            { topic: "Financial Management (FM)", details: "Develop the skills expected of a financial manager responsible for the finance function." },
        ],
        learningOutcomes: [
            "Prepare and analyze financial statements for companies.",
            "Understand the legal framework relevant to business.",
            "Apply performance management techniques.",
        ],
        facultyIds: [1, 2, 3],
        studentIds: [1, 2],
    },
    {
        id: 'acca-professional',
        title: 'ACCA Strategic Professional',
        level: 'Strategic Professional',
        description: 'This level prepares you for future leadership positions. It develops your strategic decision-making abilities and explores advanced topics required of a professional accountant.',
        duration: '12-18 months',
        eligibility: 'Completion of Applied Skills exams.',
        papers: ['SBL: Strategic Business Leader', 'SBR: Strategic Business Reporting', 'AFM: Advanced Financial Management', 'APM: Advanced Performance Management', 'ATX: Advanced Taxation', 'AAA: Advanced Audit and Assurance'],
        syllabus: [
            { topic: "Strategic Business Leader (SBL)", details: "Apply excellent leadership and ethical skills to lead an organization." },
            { topic: "Strategic Business Reporting (SBR)", details: "Apply professional judgement in the application and evaluation of financial reporting principles." },
            { topic: "Advanced Financial Management (AFM)", details: "An optional paper focusing on advanced investment and financing decisions." },
        ],
        learningOutcomes: [
            "Evaluate and recommend strategic business decisions.",
            "Assess business performance and risk.",
            "Communicate effectively to a range of stakeholders.",
        ],
        facultyIds: [1, 2, 4, 5],
        studentIds: [],
    },
];

export const TESTIMONIALS: Testimonial[] = [
    { id: 1, name: 'Priya Sharma', program: 'ACCA Professional', quote: 'The faculty at Learners Academy is exceptional. Their guidance was crucial to my success in the ACCA exams. The learning environment is top-notch.', imageUrl: 'https://picsum.photos/seed/priya/100/100' },
    { id: 2, name: 'Aarav Singh', program: 'ACCA Foundation', quote: 'I started my ACCA journey here and it was the best decision. The foundational concepts were taught with such clarity. Highly recommended!', imageUrl: 'https://picsum.photos/seed/aarav/100/100' },
    { id: 3, name: 'Anjali Gupta', program: 'ACCA Professional', quote: 'The support system and resources provided are unparalleled. The mock exams and personalized feedback sessions were incredibly helpful.', imageUrl: 'https://picsum.photos/seed/anjali/100/100' },
];

export const FAQ_DATA: FAQItem[] = [
    { question: "What is ACCA?", answer: "ACCA (the Association of Chartered Certified Accountants) is a global professional accounting body offering the Chartered Certified Accountant qualification." },
    { question: "What are the eligibility criteria for the ACCA Foundation level?", answer: "There are no minimum entry requirements for the ACCA Foundation level. It's open to everyone, regardless of their previous educational background." },
    { question: "How long does it take to complete the ACCA qualification?", answer: "On average, it takes about 3-4 years to complete the entire ACCA qualification. However, this can vary based on individual study pace and prior qualifications." },
    { question: "Does Learners Academy provide job placement assistance?", answer: "Yes, we have a dedicated careers service that assists students with CV building, interview preparation, and connecting with potential employers in our network." },
    { question: "Can I pay my fees online?", answer: "Absolutely. Our student portal has an integrated payment gateway for secure and convenient online fee payments." },
];

export const GALLERY_IMAGES: GalleryImage[] = [
    { id: 1, src: 'https://picsum.photos/seed/campus1/600/400', alt: 'Learners Academy campus building', category: 'Campus' },
    { id: 2, src: 'https://picsum.photos/seed/classroom1/600/400', alt: 'Students in a modern classroom', category: 'Classrooms' },
    { id: 3, src: 'https://picsum.photos/seed/event1/600/400', alt: 'Guest lecture event at the academy', category: 'Events' },
    { id: 4, src: 'https://picsum.photos/seed/library1/600/400', alt: 'Students studying in the library', category: 'Campus' },
    { id: 5, src: 'https://picsum.photos/seed/graduation1/600/400', alt: 'Graduation ceremony', category: 'Events' },
    { id: 6, src: 'https://picsum.photos/seed/studygroup1/600/400', alt: 'A group of students collaborating', category: 'Students' },
    { id: 7, src: 'https://picsum.photos/seed/techlab1/600/400', alt: 'Computer lab with students', category: 'Classrooms' },
    { id: 8, src: 'https://picsum.photos/seed/facultygroup1/600/400', alt: 'Faculty members discussion', category: 'Campus' },
    { id: 9, src: 'https://picsum.photos/seed/students2/600/400', alt: 'Students interacting with faculty', category: 'Students' },
    { id: 10, src: 'https://picsum.photos/seed/event2/600/400', alt: 'Annual sports day event', category: 'Events' },
    { id: 11, src: 'https://picsum.photos/seed/classroom2/600/400', alt: 'An interactive classroom session', category: 'Classrooms' },
    { id: 12, src: 'https://picsum.photos/seed/campus3/600/400', alt: 'Academy front gate', category: 'Campus' },
];

export const BLOG_POSTS: BlogPost[] = [
    {
        id: '5-tips-for-sbr-exam',
        title: '5 Essential Tips for Passing Your SBR Exam',
        authorId: 1,
        publicationDate: '2024-07-20',
        excerpt: 'The Strategic Business Reporting (SBR) exam is challenging, but with the right approach, you can excel. Here are five key tips from our expert faculty to guide your preparation.',
        content: `
        <p class="mb-4">The Strategic Business Reporting (SBR) exam is a significant hurdle in the ACCA journey, focusing on the application of accounting standards and ethical principles in complex scenarios. Success requires more than just memorization; it demands deep understanding and strategic thinking. Here are five essential tips to help you conquer the SBR exam.</p>
        <h3 class="text-xl font-bold mb-2 mt-6">1. Master the Conceptual Framework</h3>
        <p class="mb-4">The framework isn't just an introductory topic; it's the backbone of all accounting standards. Examiners often test your understanding of the principles when a specific IFRS doesn't apply. Ensure you can confidently discuss concepts like faithful representation, prudence, and substance over form.</p>
        <h3 class="text-xl font-bold mb-2 mt-6">2. Practice, Practice, Practice</h3>
        <p class="mb-4">This cannot be overstated. Work through as many past exam questions as possible under timed conditions. This builds your stamina, improves your time management, and familiarizes you with the examiner's style. Pay close attention to the professional skills marks, which can make the difference between a pass and a fail.</p>
        <h3 class="text-xl font-bold mb-2 mt-6">3. Stay Current with IFRS</h3>
        <p class="mb-4">SBR is a contemporary exam. Be aware of recent changes to IFRS, exposure drafts, and discussion papers. Examiners like to see that you are up-to-date with the latest developments in the accounting world. Reading technical articles on the ACCA website is a great way to stay informed.</p>
        <h3 class="text-xl font-bold mb-2 mt-6">4. Develop Your Ethical Acumen</h3>
        <p class="mb-4">Ethics is a guaranteed component of the SBR exam. You must be able to identify ethical dilemmas, explain their implications for stakeholders, and recommend appropriate courses of action. Use the ACCA's ethical framework (Integrity, Objectivity, Professional Competence and Due Care, Confidentiality, and Professional Behaviour) to structure your answers.</p>
        <h3 class="text-xl font-bold mb-2 mt-6">5. Perfect Your Exam Technique</h3>
        <p class="mb-4">Structure your answers clearly with headings and short paragraphs. Directly address the verb in the question (e.g., 'discuss', 'advise', 'explain'). For calculation questions, always show your workings. For narrative questions, make a point and then explain its significance ('Point, Explain'). This logical approach will earn you marks and impress the examiner.</p>
        `,
        imageUrl: 'https://picsum.photos/seed/blog1/1200/800',
        tags: ['SBR', 'Exam Tips', 'ACCA Professional']
    },
    {
        id: 'career-in-management-accounting',
        title: 'Beyond the Books: A Career in Management Accounting',
        authorId: 2,
        publicationDate: '2024-07-15',
        excerpt: 'What does a management accountant really do? We explore the dynamic and strategic role that a qualification in Performance Management (PM) can lead to.',
        content: `
        <p class="mb-4">When people think of accounting, they often picture tax returns and financial audits. While that's one side of the coin, the other, equally vital side is management accounting. This field is about looking forward, using financial data to drive business strategy and decision-making from within an organization.</p>
        <h3 class="text-xl font-bold mb-2 mt-6">What is Management Accounting?</h3>
        <p class="mb-4">At its core, management accounting involves preparing and analyzing financial information for internal use. A management accountant is a strategic partner to the business, providing insights that help leaders make informed decisions. This includes budgeting, forecasting, cost analysis, and performance evaluation.</p>
        <h3 class="text-xl font-bold mb-2 mt-6">Key Responsibilities</h3>
        <ul class="list-disc list-inside mb-4 pl-4">
            <li><strong>Budgeting and Forecasting:</strong> Creating detailed budgets and financial forecasts to plan for the future.</li>
            <li><strong>Cost Management:</strong> Analyzing costs to identify inefficiencies and opportunities for savings.</li>
            <li><strong>Performance Analysis:</strong> Using variance analysis and other techniques to compare actual results against budgets.</li>
            <li><strong>Strategic Planning:</strong> Providing financial input for long-term business planning and investment decisions.</li>
        </ul>
        <p class="mb-4">The ACCA papers in Performance Management (PM) and Advanced Performance Management (APM) are specifically designed to equip you with these critical skills. By mastering these subjects, you position yourself not just as an accountant, but as a future business leader.</p>
        `,
        imageUrl: 'https://picsum.photos/seed/blog2/1200/800',
        tags: ['Careers', 'Management Accounting', 'PM']
    },
    {
        id: 'demystifying-corporate-law',
        title: 'Demystifying the LW Paper: More Than Just Law',
        authorId: 3,
        publicationDate: '2024-07-10',
        excerpt: 'The Corporate and Business Law (LW) paper can seem daunting. Ms. Emily White breaks down why it\'s a crucial part of your accounting toolkit and how to approach it effectively.',
        content: `
        <p class="mb-4">For many students on the path to becoming an accountant, the Corporate and Business Law (LW) paper can feel like an outlier. It's less about numbers and more about rules and regulations. However, understanding the legal framework in which businesses operate is absolutely fundamental to a career in finance.</p>
        <h3 class="text-xl font-bold mb-2 mt-6">Why is Law Important for Accountants?</h3>
        <p class="mb-4">Every financial transaction, every contract, and every business decision is underpinned by law. As an accountant, you will be involved in company formation, employment contracts, and ensuring the business complies with statutory requirements. A strong grasp of law protects both your company and you from legal and financial risk.</p>
        <h3 class="text-xl font-bold mb-2 mt-6">Key Areas of the LW Syllabus</h3>
        <ul class="list-disc list-inside mb-4 pl-4">
            <li><strong>The Legal System:</strong> Understanding how laws are made and enforced.</li>
            <li><strong>Contract Law:</strong> The essential elements of a legally binding agreement.</li>
            <li><strong>Company Law:</strong> The rules governing the formation, management, and financing of companies.</li>
            <li><strong>Employment Law:</strong> The rights and responsibilities of employers and employees.</li>
        </ul>
        <h3 class="text-xl font-bold mb-2 mt-6">How to Succeed in LW</h3>
        <p class="mb-4">Success in LW comes from understanding concepts rather than rote memorization of case law. Focus on learning the legal principles and then applying them to the scenarios presented in the exam questions. Use mind maps and flashcards to remember key definitions and rules. Practice applying your knowledge to short, scenario-based questions to build your confidence.</p>
        `,
        imageUrl: 'https://picsum.photos/seed/blog3/1200/800',
        tags: ['LW', 'Exam Tips', 'Applied Skills']
    },
];


export const NOTIFICATIONS: Notification[] = [
    { id: 1, type: 'grade', title: 'New Grade Posted', message: 'Your result for Financial Reporting mock exam is available.', timestamp: '15m ago', read: false },
    { id: 2, type: 'deadline', title: 'Assignment Due Soon', message: 'Your Assignment 2 for Performance Management is due tomorrow.', timestamp: '1h ago', read: false },
    { id: 3, type: 'material', title: 'New Notes Uploaded', message: 'Chapter 5 notes for Audit and Assurance have been added.', timestamp: '3h ago', read: true },
    { id: 4, type: 'announcement', title: 'Holiday Notice', message: 'The academy will be closed this Friday for a public holiday.', timestamp: '1d ago', read: true },
];

// MOCK DATA FOR STUDENT PORTAL
export const STUDENTS: Student[] = [
    { id: 1, studentId: 'S12345', name: 'Alex Doe', avatarUrl: 'https://picsum.photos/seed/alex/100/100', email: 'alex.doe@example.com', phone: '+977 9801234567', address: '123 Learning Lane, Kathmandu', dob: '2003-01-15', enrollmentDate: '2023-09-01', currentLevel: 'Applied Skills', enrolledPapers: ['LW', 'PM', 'TX', 'FR', 'AA', 'FM'], grades: { 'FR': 72, 'AA': null, 'LW': 68, 'PM': 71 }, attendance: { 'FR': 92, 'PM': 88, 'LW': 95, 'TX': 100, 'AA': 75, 'FM': 80 } },
    { id: 2, studentId: 'S12346', name: 'Ben Carter', avatarUrl: 'https://picsum.photos/seed/ben/100/100', email: 'ben.carter@example.com', phone: '+977 9801234568', address: '456 Education Ave, Pokhara', dob: '2002-05-20', enrollmentDate: '2023-09-01', currentLevel: 'Applied Skills', enrolledPapers: ['LW', 'PM', 'TX', 'FR', 'AA', 'FM'], grades: { 'FR': 65, 'AA': 58, 'LW': 75, 'PM': null }, attendance: { 'FR': 85, 'AA': 90, 'LW': 91 } },
    { id: 3, studentId: 'S12347', name: 'Chloe Davis', avatarUrl: 'https://picsum.photos/seed/chloe/100/100', email: 'chloe.davis@example.com', phone: '+977 9801234569', address: '789 Academy Rd, Biratnagar', dob: '2004-11-30', enrollmentDate: '2024-03-01', currentLevel: 'Applied Knowledge', enrolledPapers: ['BT', 'MA', 'FA'], grades: { 'BT': 88, 'MA': 91, 'FA': 85 }, attendance: { 'BT': 98, 'MA': 96, 'FA': 100 } },
    { id: 4, studentId: 'S12348', name: 'David Evans', avatarUrl: 'https://picsum.photos/seed/david/100/100', email: 'david.evans@example.com', phone: '+977 9801234570', address: '101 University St, Lalitpur', dob: '2003-08-10', enrollmentDate: '2024-03-01', currentLevel: 'Applied Knowledge', enrolledPapers: ['BT', 'MA', 'FA'], grades: { 'BT': 78, 'MA': 82, 'FA': null }, attendance: { 'BT': 90, 'MA': 85 } },
];

export const CHAT_MESSAGES: ChatMessage[] = [
    { id: 1, studentId: 3, text: "Hey everyone, are you ready for the FR mock exam tomorrow?", timestamp: "10:30 AM" },
    { id: 2, studentId: 2, text: "A bit nervous, but I think I've covered most of the syllabus.", timestamp: "10:31 AM" },
    { id: 1, studentId: 1, text: "Same here. That new standard on leases is tricky though.", timestamp: "10:32 AM" },
    { id: 4, studentId: 4, text: "Definitely! I found a great summary video, I'll share the link.", timestamp: "10:33 AM" },
    { id: 3, studentId: 3, text: "That would be awesome, thanks David!", timestamp: "10:33 AM" },
    {
        id: 6,
        studentId: 2,
        text: "Here's a great cheatsheet for IFRS 16.",
        timestamp: "10:35 AM",
        attachment: {
            type: 'document',
            url: '#',
            name: 'IFRS-16-Summary.pdf'
        }
    },
    {
        id: 7,
        studentId: 1,
        text: "This diagram explains the audit risk model really well.",
        timestamp: "10:38 AM",
        attachment: {
            type: 'image',
            url: 'https://picsum.photos/seed/diagram/400/250',
            name: 'audit-risk-model.jpg'
        }
    },
];

export const RECENT_SUBMISSIONS: RecentSubmission[] = [
    { id: 1, studentName: 'Ben Carter', paper: 'FR: Financial Reporting', assignmentTitle: 'Assignment 2: Consolidation', submittedAt: '1h ago' },
    { id: 2, studentName: 'Alex Doe', paper: 'PM: Performance Management', assignmentTitle: 'Case Study 1', submittedAt: '3h ago' },
];

export const TEACHER_QUESTIONS: TeacherQuestion[] = [
    { 
        id: 1, 
        studentId: 1,
        studentName: 'Alex Doe',
        paper: "FR: Financial Reporting", 
        question: "Can you clarify the conditions for capitalizing development expenditure under IAS 38?",
        status: 'Answered',
        askedDate: "2024-07-15",
        answeredBy: "Dr. Jane Smith",
        answer: "Certainly, Alex. To capitalize development expenditure, you must meet all six 'PIRATE' criteria: Probable future economic benefits, Intention to complete, Resources adequate, Ability to use or sell, Technical feasibility, and Expenditure can be measured reliably. Hope that helps!",
        attachmentName: "ias-38-problem-set.pdf"
    },
    { 
        id: 2, 
        studentId: 2,
        studentName: 'Ben Carter',
        paper: "PM: Performance Management", 
        question: "I'm struggling to differentiate between absorption and marginal costing in profit reconciliation statements. Any tips?",
        status: 'Pending',
        askedDate: "2024-07-18",
    },
     { 
        id: 3, 
        studentId: 1,
        studentName: 'Alex Doe',
        paper: "AA: Audit and Assurance", 
        question: "What's the best approach to audit risk questions?",
        status: 'Pending',
        askedDate: "2024-07-24",
    }
];

export const LIVE_CLASSES: LiveClass[] = [
    { id: 1, paper: 'FR: Financial Reporting', topic: 'IAS 16: Property, Plant and Equipment', instructor: 'Dr. Jane Smith', startTime: '10:00 AM', status: 'Live', joinLink: 'https://us05web.zoom.us/j/88128644036?pwd=axw8bYYmk0upbSEKlXvvnebUth4d4U.1' },
    { id: 2, paper: 'PM: Performance Management', topic: 'Budgeting and Variance Analysis', instructor: 'Mr. Robert Brown', startTime: '1:00 PM', status: 'Upcoming', joinLink: '#' },
    { id: 3, paper: 'AA: Audit and Assurance', topic: 'Audit Risk Assessment', instructor: 'Dr. Jane Smith', startTime: '4:00 PM', status: 'Upcoming', joinLink: '#' },
];

export const RECORDED_LECTURES: RecordedLecture[] = [
    { id: 1, paper: 'FR: Financial Reporting', topic: 'Introduction to IFRS', date: '2024-07-10', videoUrl: 'https://www.youtube.com/watch?v=BREIX7zzye0' },
    { id: 2, paper: 'FR: Financial Reporting', topic: 'The Conceptual Framework', date: '2024-07-12', videoUrl: 'https://www.youtube.com/watch?v=uP2f334aI4Q' },
    { id: 3, paper: 'PM: Performance Management', topic: 'Costing Methods', date: '2024-07-11', videoUrl: 'https://www.youtube.com/watch?v=C35Ea2gH8k4' },
    { id: 4, paper: 'AA: Audit and Assurance', topic: 'Introduction to Auditing', date: '2024-07-13', videoUrl: 'https://www.youtube.com/watch?v=4T1D43s2W3Q' },
];

export const COURSE_MATERIALS: CourseMaterial[] = [
    { id: 1, paper: 'FR: Financial Reporting', title: 'Chapter 1 Notes - The Conceptual Framework.pdf', type: 'PDF', uploadDate: '2024-07-12', downloadLink: '#' },
    { id: 2, paper: 'FR: Financial Reporting', title: 'IAS 16 Summary Notes', type: 'Notes', uploadDate: '2024-07-14', downloadLink: '#' },
    { id: 3, paper: 'FR: Financial Reporting', title: 'Assignment 1 - Financial Statements', type: 'Assignment', uploadDate: '2024-07-15', downloadLink: '#' },
    { id: 4, paper: 'PM: Performance Management', title: 'Chapter 1 Notes - Costing.pdf', type: 'PDF', uploadDate: '2024-07-11', downloadLink: '#' },
    { id: 5, paper: 'PM: Performance Management', title: 'Assignment 1 - CVP Analysis', type: 'Assignment', uploadDate: '2024-07-16', downloadLink: '#' },
    { id: 6, paper: 'AA: Audit and Assurance', title: 'Chapter 1 Slides.pdf', type: 'PDF', uploadDate: '2024-07-13', downloadLink: '#' },
];

export const FEE_SUMMARY: FeeSummary = {
  outstandingBalance: 15000,
  dueDate: '2024-08-15',
  lastPaymentDate: '2024-05-10',
  lastPaymentAmount: 45000,
};

export const PAYMENT_HISTORY: PaymentHistoryItem[] = [
    { invoiceId: 'INV-2024-001', date: '2024-05-10', amount: 45000, status: 'Paid' },
    { invoiceId: 'INV-2024-002', date: '2024-02-05', amount: 45000, status: 'Paid' },
    { invoiceId: 'INV-2023-003', date: '2023-11-12', amount: 45000, status: 'Paid' },
    { invoiceId: 'INV-2023-004', date: '2023-08-09', amount: 45000, status: 'Paid' },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
    // July 2024
    { id: 1, date: '2024-07-01', title: 'IAS 1 Presentation', type: 'class', paper: 'FR: Financial Reporting', instructor: 'Dr. Jane Smith', startTime: '09:00 AM', endTime: '11:00 AM', joinLink: 'https://zoom.us/j/1234567890' },
    { id: 2, date: '2024-07-02', title: 'CVP Analysis', type: 'class', paper: 'PM: Performance Management', instructor: 'Mr. Robert Brown', startTime: '01:00 PM', endTime: '03:00 PM', joinLink: 'https://zoom.us/j/0987654321' },
    { id: 3, date: '2024-07-03', title: 'Audit Planning', type: 'class', paper: 'AA: Audit and Assurance', instructor: 'Dr. Jane Smith', startTime: '10:00 AM', endTime: '12:00 PM' },
    { id: 4, date: '2024-07-05', title: 'Assignment 2 Due', type: 'deadline', paper: 'PM: Performance Management' },
    { id: 5, date: '2024-07-15', title: 'Mid-term Mock', type: 'exam', paper: 'FR: Financial Reporting', instructor: 'Dr. Jane Smith', startTime: '09:00 AM', endTime: '12:00 PM' },
    { id: 6, date: '2024-07-16', title: 'Mid-term Mock', type: 'exam', paper: 'PM: Performance Management', instructor: 'Mr. Robert Brown', startTime: '01:00 PM', endTime: '04:00 PM' },
    { id: 7, date: '2024-07-19', title: 'Case Study Due', type: 'deadline', paper: 'AA: Audit and Assurance' },
    { id: 8, date: '2024-07-22', title: 'IFRS 15 Revenue', type: 'class', paper: 'FR: Financial Reporting', instructor: 'Dr. Jane Smith', startTime: '09:00 AM', endTime: '11:00 AM', joinLink: 'https://zoom.us/j/1122334455' },
    { id: 9, date: '2024-07-22', title: 'Budgeting Techniques', type: 'class', paper: 'PM: Performance Management', instructor: 'Mr. Robert Brown', startTime: '01:00 PM', endTime: '03:00 PM' },
    { id: 10, date: '2024-07-23', title: 'Audit Evidence', type: 'class', paper: 'AA: Audit and Assurance', instructor: 'Dr. Jane Smith', startTime: '10:00 AM', endTime: '12:00 PM' },
    { id: 11, date: '2024-07-26', title: 'Assignment 3 Due', type: 'deadline', paper: 'FR: Financial Reporting' },
    // August 2024
    { id: 12, date: '2024-08-01', title: 'Fee Payment Deadline', type: 'deadline' },
    { id: 13, date: '2024-08-05', title: 'Final Mocks Start', type: 'exam' },
];


export const PENDING_APPLICATIONS: Application[] = [
    { id: 1, fullName: 'Grace Lee', email: 'grace.lee@example.com', program: 'ACCA Applied Skills', submittedDate: '2024-07-20', status: 'Pending', phone: '+977 9812345678', photoUrl: 'https://picsum.photos/seed/grace/200/200', documentUrl: '#' },
    { id: 2, fullName: 'Henry Wilson', email: 'henry.w@example.com', program: 'ACCA Applied Knowledge', submittedDate: '2024-07-19', status: 'Pending', phone: '+977 9823456789', photoUrl: 'https://picsum.photos/seed/henry/200/200', documentUrl: '#' },
    { id: 3, fullName: 'Ivy Chen', email: 'ivy.chen@example.com', program: 'ACCA Strategic Professional', submittedDate: '2024-07-18', status: 'Pending', phone: '+977 9834567890', photoUrl: 'https://picsum.photos/seed/ivy/200/200', documentUrl: '#' },
];


export const FACULTY_ANNOUNCEMENTS: Announcement[] = [
    { id: 1, title: 'FR Mock Exam Reminder', content: 'Just a reminder that the Financial Reporting mock exam is scheduled for this Friday. Please review chapters 1-5.', date: '2024-07-22', author: 'Dr. Jane Smith', audience: 'FR: Financial Reporting' },
    { id: 2, title: 'SBR Case Study Discussion', content: 'We will be discussing the pre-seen case study material in our next class. Please come prepared.', date: '2024-07-21', author: 'Dr. Jane Smith', audience: 'SBR: Strategic Business Reporting' },
];

export const GLOBAL_ANNOUNCEMENTS: Announcement[] = [
    { id: 101, title: 'Holiday Notice: Academy Closed', content: 'The academy will be closed on Friday, August 9th, for a public holiday. Classes will resume on Sunday.', date: '2024-07-23', author: 'Admin', audience: 'All Students' },
    { id: 102, title: 'Faculty Meeting', content: 'A mandatory faculty meeting is scheduled for Thursday at 4 PM in the main conference room.', date: '2024-07-22', author: 'Admin', audience: 'All Faculty' },
];


export const TEACHER_RATINGS: TeacherRating[] = [
    { id: 1, teacherId: 1, teacherName: 'Dr. Jane Smith', studentId: 1, studentName: 'Alex Doe', rating: 5, feedback: 'The class on IAS 16 was incredibly clear. Dr. Smith explains complex topics in a very understandable way.', classTopic: 'IAS 16: Property, Plant and Equipment', date: '2024-07-22' },
    { id: 2, teacherId: 2, teacherName: 'Mr. Robert Brown', studentId: 2, studentName: 'Ben Carter', rating: 4, feedback: 'Good coverage of budgeting techniques. I would appreciate a few more real-world examples.', classTopic: 'Budgeting and Variance Analysis', date: '2024-07-21' },
    { id: 3, teacherId: 1, teacherName: 'Dr. Jane Smith', studentId: 3, studentName: 'Chloe Davis', rating: 5, feedback: 'Excellent session on audit risk. The case study was very helpful!', classTopic: 'Audit Risk Assessment', date: '2024-07-20' },
    { id: 4, teacherId: 3, teacherName: 'Ms. Emily White', studentId: 1, studentName: 'Alex Doe', rating: 4, feedback: 'The taxation concepts were explained well. The pace was a bit fast at times.', classTopic: 'Introduction to Taxation', date: '2024-07-19' },
];

export const STUDENT_FEE_RECORDS: StudentFeeRecord[] = [
    { id: 1, studentId: 'S12345', studentName: 'Alex Doe', totalFees: 60000, paidAmount: 45000, outstandingBalance: 15000, dueDate: '2024-08-15', status: 'Pending Verification' },
    { id: 2, studentId: 'S12346', studentName: 'Ben Carter', totalFees: 60000, paidAmount: 60000, outstandingBalance: 0, dueDate: '2024-08-15', status: 'Verified' },
    { id: 3, studentId: 'S12347', studentName: 'Chloe Davis', totalFees: 50000, paidAmount: 50000, outstandingBalance: 0, dueDate: '2024-07-15', status: 'Verified' },
    { id: 4, studentId: 'S12348', studentName: 'David Evans', totalFees: 50000, paidAmount: 25000, outstandingBalance: 25000, dueDate: '2024-07-15', status: 'Overdue' },
];