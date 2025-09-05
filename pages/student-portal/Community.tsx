import React, { useState, useRef, useEffect } from 'react';
import { COURSES, STUDENTS, CHAT_MESSAGES, TEACHER_QUESTIONS } from '../../constants.ts';
import type { Student, ChatMessage, TeacherQuestion, ChatAttachment } from '../../types.ts';
import { useStudent } from '../StudentPortalPage.tsx';

const Community: React.FC = () => {
    const { student: currentUser } = useStudent();
    const [activeTab, setActiveTab] = useState('chat');
    const [allStudents, setAllStudents] = useState<Student[]>([]);

    useEffect(() => {
        const storedStudents = localStorage.getItem('students');
        setAllStudents(storedStudents ? JSON.parse(storedStudents) : STUDENTS);
    }, []);

    if (!currentUser) {
        return <div>Loading...</div>;
    }

    const AskTeacher = () => {
        const [questions, setQuestions] = useState<TeacherQuestion[]>(() => {
            const savedQuestions = localStorage.getItem('teacherQuestions');
            return savedQuestions ? JSON.parse(savedQuestions) : TEACHER_QUESTIONS;
        });

        const [file, setFile] = useState<File | null>(null);
        const [isSubmitted, setIsSubmitted] = useState(false);

        useEffect(() => {
            localStorage.setItem('teacherQuestions', JSON.stringify(questions));
        }, [questions]);

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
            } else {
                setFile(null);
            }
        };
        
        const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const newQuestion: TeacherQuestion = {
                id: Date.now(),
                studentId: currentUser.id,
                studentName: currentUser.name,
                paper: formData.get('course') as string,
                question: formData.get('question') as string,
                status: 'Pending',
                askedDate: new Date().toISOString().split('T')[0],
                attachmentName: file ? file.name : undefined,
            };
            
            setQuestions(prev => [newQuestion, ...prev]);

            setIsSubmitted(true);
            setTimeout(() => setIsSubmitted(false), 3000);
            form.reset();
            setFile(null);
        };

        const myQuestions = questions.filter(q => q.studentId === currentUser.id);

        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Ask a Teacher</h2>
                <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50 space-y-4">
                    <div>
                        <label htmlFor="course" className="block text-sm font-medium text-gray-700">Select Paper</label>
                        <select id="course" name="course" className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red">
                            {COURSES.flatMap(c => c.papers).map(paper => <option key={paper}>{paper}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="question" className="block text-sm font-medium text-gray-700">Your Question</label>
                        <textarea id="question" name="question" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red bg-white" placeholder="Type your academic question here..."></textarea>
                    </div>
                     <div>
                        <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">Attach File (Optional)</label>
                        <input type="file" id="attachment" name="attachment" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-brand-red hover:file:bg-red-100"/>
                    </div>

                    {file && (
                        <div className="flex items-center justify-between text-sm bg-gray-200 p-2 rounded-md">
                            <span className="truncate font-medium text-gray-700">{file.name}</span>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setFile(null);
                                    const fileInput = document.getElementById('attachment') as HTMLInputElement;
                                    if (fileInput) fileInput.value = '';
                                }} 
                                className="text-brand-red font-bold ml-2 text-lg"
                                aria-label="Remove attachment"
                            >&times;</button>
                        </div>
                    )}

                     <button type="submit" className="w-full bg-brand-red text-white py-2 px-4 rounded-md font-semibold hover:bg-red-700 transition-colors">Submit Question</button>
                     {isSubmitted && <p className="text-sm text-green-600 text-center">Your question has been submitted successfully!</p>}
                </form>

                <h3 className="text-xl font-bold text-brand-dark mb-4">Your Question History</h3>
                <div className="space-y-4">
                    {myQuestions.map(q => (
                        <div key={q.id} className="border rounded-lg overflow-hidden">
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <p className="font-semibold">{q.question}</p>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${q.status === 'Answered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{q.status}</span>
                                </div>
                                <p className="text-sm text-gray-500 mt-1">{q.paper} - Asked on {q.askedDate}</p>
                                {q.attachmentName && (
                                    <div className="mt-2 flex items-center text-sm text-gray-600 bg-gray-100 p-2 rounded-md w-fit">
                                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                        <span className="truncate">{q.attachmentName}</span>
                                    </div>
                                )}
                            </div>
                            {q.status === 'Answered' && (
                                <div className="bg-green-50 p-4 border-t">
                                    <p className="font-semibold text-sm text-green-800">Answer from {q.answeredBy}:</p>
                                    {q.answer && <p className="text-gray-700 mt-1 text-sm">{q.answer}</p>}
                                    {q.answerAttachment && (
                                        <div className="mt-2">
                                            <RenderAttachment attachment={q.answerAttachment} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    const ChatAttachmentPreview = ({ attachment, onRemove }: { attachment: ChatAttachment; onRemove: () => void; }) => (
        <div className="p-2 border-t relative bg-gray-50">
            <div className="flex items-center text-sm">
                {attachment.type === 'image' && <img src={attachment.url} alt="preview" className="w-12 h-12 object-cover rounded-md mr-2"/>}
                <div className="truncate">
                    <p className="font-semibold truncate">{attachment.name}</p>
                    <p className="text-gray-500 capitalize">{attachment.type}</p>
                </div>
            </div>
            <button onClick={onRemove} className="absolute top-1 right-1 bg-gray-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center hover:bg-brand-red">&times;</button>
        </div>
    );
    
    
    const RenderAttachment = ({ attachment }: { attachment: ChatAttachment }) => {
        switch (attachment.type) {
            case 'image':
                return <img src={attachment.url} alt={attachment.name || 'attachment'} className="mt-2 rounded-lg max-w-xs max-h-64 object-cover cursor-pointer" />;
            case 'video':
                return <video src={attachment.url} controls className="mt-2 rounded-lg max-w-xs" />;
            case 'document':
                return (
                    <a href={attachment.url} download={attachment.name} className="mt-2 flex items-center p-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                        <svg className="w-6 h-6 mr-2 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <span className="text-sm font-medium text-brand-dark truncate">{attachment.name}</span>
                    </a>
                );
            case 'link':
                return (
                     <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="mt-2 block p-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                        <p className="text-sm font-semibold text-blue-600">Link</p>
                        <p className="text-xs text-gray-700 truncate">{attachment.url}</p>
                    </a>
                );
            default:
                return null;
        }
    };
    
    
    const StudentChat = () => {
        const [messages, setMessages] = useState<ChatMessage[]>(() => {
            try {
                const savedMessages = localStorage.getItem('studentChatMessages');
                return savedMessages ? JSON.parse(savedMessages) : CHAT_MESSAGES;
            } catch {
                return CHAT_MESSAGES;
            }
        });

        useEffect(() => {
            try {
                localStorage.setItem('studentChatMessages', JSON.stringify(messages));
            } catch (error) {
                console.error("Failed to save chat messages to localStorage", error);
            }
        }, [messages]);

        const [newMessage, setNewMessage] = useState('');
        const [attachmentPreview, setAttachmentPreview] = useState<ChatAttachment | null>(null);
        const chatEndRef = useRef<HTMLDivElement>(null);
        const fileInputRef = useRef<HTMLInputElement>(null);
    
    
        const studentMap = allStudents.reduce((acc, student) => {
            acc[student.id] = student;
            return acc;
        }, {} as Record<number, Student>);
    
        const scrollToBottom = () => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };
    
        useEffect(scrollToBottom, [messages]);
        
        const urlRegex = /(https?:\/\/[^\s]+)/g;
    
        const handleSendMessage = (e: React.FormEvent) => {
            e.preventDefault();
            if (!newMessage.trim() && !attachmentPreview) return;
            
            let finalAttachment = attachmentPreview;
            
            if (!finalAttachment && newMessage.match(urlRegex)) {
                const url = newMessage.match(urlRegex)![0];
                 finalAttachment = { type: 'link', url };
            }
    
            const newMsg: ChatMessage = {
                id: messages.length + 1,
                studentId: currentUser.id,
                text: newMessage.trim(),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                attachment: finalAttachment || undefined,
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
            setAttachmentPreview(null);
            if(fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        };
        
        const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;
    
            let type: ChatAttachment['type'] = 'document';
            if (file.type.startsWith('image/')) type = 'image';
            if (file.type.startsWith('video/')) type = 'video';
    
            const fileUrl = URL.createObjectURL(file);
            setAttachmentPreview({
                type,
                url: fileUrl,
                name: file.name
            });
        };
        
        return (
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Chat Window */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md flex flex-col h-[70vh]">
                    <h2 className="text-2xl font-bold text-brand-dark mb-4 border-b pb-2">#FR-study-group</h2>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        {messages.map(msg => {
                            const student = studentMap[msg.studentId];
                            if (!student) return null; // Gracefully handle if a student is deleted
                            const isCurrentUserMsg = student.id === currentUser.id;
                            return (
                                <div key={msg.id} className={`flex items-start gap-3 ${isCurrentUserMsg ? 'justify-end' : ''}`}>
                                    {!isCurrentUserMsg && <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full" />}
                                    <div>
                                        <div className={`text-sm p-3 rounded-lg max-w-sm ${isCurrentUserMsg ? 'bg-brand-red text-white' : 'bg-gray-100'}`}>
                                            <p className={`font-bold mb-1 ${isCurrentUserMsg ? 'hidden' : 'block'}`}>{student.name}</p>
                                            {msg.text && <p>{msg.text}</p>}
                                            {msg.attachment && <RenderAttachment attachment={msg.attachment} />}
                                        </div>
                                        <p className={`text-xs text-gray-400 mt-1 ${isCurrentUserMsg ? 'text-right' : ''}`}>{msg.timestamp}</p>
                                    </div>
                                    {isCurrentUserMsg && <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full" />}
                                </div>
                            );
                        })}
                        <div ref={chatEndRef} />
                    </div>
                     <div className="mt-4 border rounded-lg">
                        {attachmentPreview && <ChatAttachmentPreview attachment={attachmentPreview} onRemove={() => setAttachmentPreview(null)} />}
                        <form onSubmit={handleSendMessage} className="flex items-center p-2">
                            <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-brand-red">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                            </button>
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-1 border-none p-2 focus:outline-none focus:ring-0 bg-white" 
                            />
                            <button type="submit" className="bg-brand-red text-white px-4 py-2 rounded-md hover:bg-red-700">Send</button>
                        </form>
                    </div>
                </div>
    
                {/* Friends List */}
                <div className="lg:w-64">
                     <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="font-bold text-brand-dark mb-3">Classmates (Online)</h3>
                        <ul className="space-y-3">
                            {allStudents.map(s => (
                                 <li key={s.id} className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={s.avatarUrl} alt={s.name} className="w-10 h-10 rounded-full" />
                                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                                    </div>
                                    <span className="font-medium text-sm">{s.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-8">Community Hub</h1>
            <div className="mb-6 flex border-b">
                <button 
                    onClick={() => setActiveTab('chat')} 
                    className={`py-2 px-4 font-semibold ${activeTab === 'chat' ? 'border-b-2 border-brand-red text-brand-red' : 'text-gray-500'}`}
                >
                    Student Chat
                </button>
                <button 
                    onClick={() => setActiveTab('ask')} 
                    className={`py-2 px-4 font-semibold ${activeTab === 'ask' ? 'border-b-2 border-brand-red text-brand-red' : 'text-gray-500'}`}
                >
                    Ask a Teacher
                </button>
            </div>

            <div>
                {activeTab === 'chat' && <StudentChat />}
                {activeTab === 'ask' && <AskTeacher />}
            </div>
        </div>
    );
};

export default Community;