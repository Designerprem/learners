

export type UserRole = 'student' | 'faculty' | 'admin';

export interface Admin {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface FacultyMember {
  id: number;
  name: string;
  username: string;
  password?: string;
  email: string;
  phone: string;
  qualification: string;
  bio: string;
  imageUrl: string;
  assignedPapers: string[];
  address: string;
}

export interface Course {
  id:string;
  title: string;
  level: 'Applied Knowledge' | 'Applied Skills' | 'Strategic Professional';
  description: string;
  duration: string;
  eligibility: string;
  papers: string[];
  essentials?: string[];
  options?: string[];
  maxOptions?: number;
  syllabus: { topic: string; details: string; }[];
  learningOutcomes: string[];
  facultyIds: number[];
  studentIds: number[];
}

export interface Testimonial {
  id: number;
  name: string;
  program: string;
  quote: string;
  imageUrl: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface HeroSlide {
    id: number; // Use a unique ID for management
    url: string;
    alt: string;
    title: {
        main: string;
        highlighted: string;
    };
    subtitle: string;
    buttons: {
        to: string;
        text: string;
        variant: 'primary' | 'secondary';
    }[];
}


export interface GalleryImage {
  id: number;
  type: 'image' | 'video';
  src: string; // URL for image or thumbnail for video
  alt: string;
  category: 'Campus' | 'Events' | 'Classrooms' | 'Students' | 'Vlogs';
  videoUrl?: string; // URL for the video file or embed link
  localVideoSrc?: string; // Data URL for uploaded video
}

export interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export interface Comment {
  id: number;
  authorName: string;
  authorImageUrl?: string;
  text: string;
  timestamp: string;
}

export interface BlogPost {
  id: string; // This will be the URL slug
  title: string;
  authorId: number;
  authorType: 'faculty' | 'student';
  publicationDate: string;
  excerpt: string;
  content: string; // Could be Markdown in a real app
  imageUrl: string;
  tags: string[];
  comments?: Comment[];
  status: 'Published' | 'Draft';
  isFeatured: boolean;
  timeToRead: number; // in minutes
}

export interface Vlog {
    id: number;
    title: string;
    description: string;
    sourceType: 'url' | 'upload';
    videoUrl?: string; // YouTube embed URL
    localVideoSrc?: string; // Base64 data URL for uploaded video
    thumbnailUrl: string; // Can be a URL or a Base64 data URL
    publicationDate: string;
}

export interface AccaFeeItem {
    paper?: string;
    details: string;
    ukPounds?: number;
    ukFeesNrs?: number;
    collegeFeesNrs?: number;
    notes?: string;
}

export interface AccaFeeCategory {
    level: string;
    description?: string;
    items: AccaFeeItem[];
    subtotals?: {
        ukFeesNrs?: number;
        collegeFeesNrs?: number;
    }
    notes?: string;
}

// Student Portal Specific Types
export interface GradeEntry {
  score: number;
  date: string; // e.g., '2024-07-25'
  examType: 'Mock' | 'Internal' | 'Final';
}

export interface Student {
  id: number;
  name: string;
  avatarUrl: string;
  studentId: string;
  password?: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  enrollmentDate: string;
  currentLevel: 'Applied Knowledge' | 'Applied Skills' | 'Strategic Professional';
  enrolledPapers: string[];
  totalFee: number;
  discount: number;
  feeItems?: { description: string; amount: number; }[];
  feeRemarks?: string; // Remarks from admin regarding the fee structure
  grades?: { [paperCode: string]: GradeEntry[] };
  attendance?: { [paperCode: string]: number };
  paymentHistory?: PaymentHistoryItem[];
  dueDate: string;
}

export interface ChatAttachment {
    type: 'image' | 'video' | 'document' | 'link';
    url: string; 
    name?: string;
}

export interface ChatMessage {
  id: number;
  studentId: number;
  text: string;
  timestamp: string;
  attachment?: ChatAttachment;
}

export interface TeacherQuestion {
  id: number;
  studentId?: number;
  studentName?: string;
  paper: string;
  question: string;
  status: 'Pending' | 'Answered';
  answer?: string;
  answerAttachment?: ChatAttachment;
  askedDate: string;
  answeredBy?: string;
  attachmentName?: string;
}

export interface LiveClass {
  id: number;
  paper: string;
  topic: string;
  instructor: string;
  startTime: string;
  status: 'Live' | 'Upcoming';
  joinLink: string;
}

export interface RecordedLecture {
  id: number;
  paper: string;
  topic: string;
  date: string;
  videoUrl: string;
}

export interface CourseMaterial {
  id: number;
  paper: string;
  title: string;
  type: 'PDF' | 'Notes' | 'Assignment';
  uploadDate: string;
  downloadLink: string;
}

export interface FeeSummary {
  outstandingBalance: number;
  dueDate: string;
  lastPaymentDate: string;
  lastPaymentAmount: number;
}

export interface PaymentHistoryItem {
  invoiceId: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending Verification' | 'Rejected';
  method: 'eSewa' | 'Khalti' | 'Mobile Banking' | 'ConnectIPS' | 'Cash';
  remarks?: string;
  screenshotUrl?: string; // Base64 data URL for uploaded screenshots
  rejectionReason?: string; // Reason for rejection by admin
  verifiedBy?: string; // Admin name
  verificationDate?: string;
}

export interface DownloadItem {
  id: number; // Corresponds to CourseMaterial or RecordedLecture ID
  title: string;
  progress: number;
  status: 'queued' | 'downloading' | 'paused' | 'completed' | 'canceled' | 'failed';
  size: number; // in KB, for simulation
  intervalId?: any; // To store interval ID for pausing/resuming
}

export interface CalendarEvent {
  id: number | string;
  date: string;
  title: string;
  type: 'class' | 'deadline' | 'exam';
  startTime?: string;
  endTime?: string;
  paper?: string;
  instructor?: string; // For faculty schedule
  joinLink?: string;
}


export interface Notification {
  id: number;
  type: 'grade' | 'deadline' | 'material' | 'announcement';
  title: string;
  message: string;
  timestamp: string; // e.g., "5 minutes ago"
  read: boolean;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string; // faculty name or 'Admin'
  audience: 'All Students' | 'All Faculty' | 'All Students & Faculty' | string; // string for specific paper
}

export interface Application {
    id: number;
    fullName: string;
    email: string;
    program: string;
    submittedDate: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    phone?: string;
    address?: string;
    selectedPapers?: string[];
    photoUrl?: string;
    documentUrl?: string;
    documentName?: string;
    studentId?: string;
}

export interface RecentSubmission {
    id: number;
    studentName: string;
    paper: string;
    assignmentTitle: string;
    submittedAt: string; // e.g., "2 hours ago"
}

export interface TeacherRating {
  id: number;
  teacherId: number;
  teacherName: string;
  studentId: number;
  studentName: string; 
  rating: number; // 1-5
  feedback: string;
  classTopic: string;
  date: string;
}

export interface PopupNotification {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  isActive: boolean;
  link?: string;
  linkText?: string;
}