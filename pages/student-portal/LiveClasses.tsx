import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LIVE_CLASSES, RECORDED_LECTURES, COURSE_MATERIALS, COURSES } from '../../constants.ts';
import type { CourseMaterial, DownloadItem, LiveClass, RecordedLecture } from '../../types.ts';
import DownloadManager from '../../components/student-portal/DownloadManager.tsx';
import RatingModal from '../../components/student-portal/RatingModal.tsx';
import { useStudent } from '../StudentPortalPage.tsx';

type ResourceType = 'lectures' | 'notes' | 'assignments';

// FIX: Added 'assignments' property to 'resourceIcons' to match the 'ResourceType' type definition.
const resourceIcons: { [key in ResourceType]: JSX.Element } = {
    lectures: <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    // FIX: Set a valid 'strokeLinecap' value of "round" to resolve the SVG error.
    notes: <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
    assignments: <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>,
};

const LiveClasses: React.FC = () => {
    const { student } = useStudent();
    const [searchParams] = useSearchParams();
    
    const allStudentPapers = useMemo(() => {
        const paperMap = new Map<string, string>();
        COURSES.forEach(course => {
            course.papers.forEach(paperName => {
                const paperCode = paperName.split(':')[0].trim();
                if (student.enrolledPapers.includes(paperCode)) {
                    paperMap.set(paperName, paperCode);
                }
            });
        });
        return Array.from(paperMap.keys());
    }, [student.enrolledPapers]);
    
    const initialPaper = searchParams.get('paper') || allStudentPapers[0] || '';
    const [selectedPaper, setSelectedPaper] = useState(initialPaper);
    
    const [downloadQueue, setDownloadQueue] = useState<DownloadItem[]>([]);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [ratingTarget, setRatingTarget] = useState<{ teacherName: string; classTopic: string } | null>(null);

    // Filtered data based on selectedPaper
    const liveClassesForPaper = LIVE_CLASSES.filter(c => c.paper === selectedPaper);
    const recordedLecturesForPaper = RECORDED_LECTURES.filter(l => l.paper === selectedPaper.split(':')[0].trim());
    const courseMaterialsForPaper = COURSE_MATERIALS.filter(m => m.paper === selectedPaper.split(':')[0].trim());

    const resources = [
        ...recordedLecturesForPaper.map(l => ({ type: 'lectures' as const, data: l })),
        ...courseMaterialsForPaper.filter(m => m.type === 'Notes' || m.type === 'PDF').map(m => ({ type: 'notes' as const, data: m })),
        ...courseMaterialsForPaper.filter(m => m.type === 'Assignment').map(m => ({ type: 'assignments' as const, data: m })),
    ];
    
    const handleDownload = (item: CourseMaterial | RecordedLecture) => {
        const id = item.id;
        if (downloadQueue.some(d => d.id === id)) return; // Don't add if already in queue
        
        const newItem: DownloadItem = {
            id,
            title: 'videoUrl' in item ? item.topic : item.title,
            progress: 0,
            status: 'queued',
            size: Math.floor(Math.random() * (20000 - 2000) + 2000), // Random size for simulation
        };
        setDownloadQueue(prev => [...prev, newItem]);
    };
    
    useEffect(() => {
        const activeDownload = downloadQueue.find(d => d.status === 'queued');
        if (activeDownload) {
            setDownloadQueue(prev => prev.map(d => d.id === activeDownload.id ? { ...d, status: 'downloading' } : d));

            const intervalId = setInterval(() => {
                setDownloadQueue(prevQueue => {
                    const currentItem = prevQueue.find(i => i.id === activeDownload.id);
                    if (!currentItem || currentItem.status !== 'downloading') {
                        clearInterval(intervalId);
                        return prevQueue;
                    }
                    if (currentItem.progress >= 100) {
                        clearInterval(intervalId);
                        return prevQueue.map(d => d.id === activeDownload.id ? { ...d, status: 'completed' } : d);
                    }
                    const newProgress = currentItem.progress + 5;
                    return prevQueue.map(d => d.id === activeDownload.id ? { ...d, progress: Math.min(newProgress, 100) } : d);
                });
            }, 500);
            
            setDownloadQueue(prev => prev.map(d => d.id === activeDownload.id ? { ...d, intervalId } : d));
        }
    }, [downloadQueue]);

    const handlePauseDownload = (id: number) => {
        const item = downloadQueue.find(d => d.id === id);
        if (item && item.intervalId) {
            clearInterval(item.intervalId);
            setDownloadQueue(prev => prev.map(d => d.id === id ? { ...d, status: 'paused', intervalId: undefined } : d));
        }
    };
    
    const handleResumeDownload = (id: number) => {
        setDownloadQueue(prev => prev.map(d => d.id === id ? { ...d, status: 'queued' } : d)); // Re-queue to restart download
    };

    const handleCancelDownload = (id: number) => {
        const item = downloadQueue.find(d => d.id === id);
        if (item && item.intervalId) {
            clearInterval(item.intervalId);
        }
        setDownloadQueue(prev => prev.filter(d => d.id !== id));
    };

    const handleClearCompleted = () => {
        setDownloadQueue(prev => prev.filter(d => d.status !== 'completed'));
    };

    const handleRatingSubmit = (rating: number, feedback: string) => {
        console.log(`Submitted rating: ${rating} stars. Feedback: "${feedback}"`, ratingTarget);
        // In a real app, send this data to the server
    };


    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-8">Classes & Resources</h1>
            
            <div className="mb-6">
                <label htmlFor="paperSelect" className="block text-sm font-medium text-gray-700">Select a Paper</label>
                <select 
                    id="paperSelect"
                    value={selectedPaper}
                    onChange={(e) => setSelectedPaper(e.target.value)}
                    className="mt-1 block w-full max-w-sm pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-red focus:border-brand-red sm:text-sm rounded-md shadow-sm bg-white"
                >
                    {allStudentPapers.map(paper => <option key={paper} value={paper}>{paper}</option>)}
                </select>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Live Classes Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-brand-dark mb-4">Live Classes</h2>
                    <div className="space-y-4">
                        {liveClassesForPaper.length > 0 ? liveClassesForPaper.map(cls => (
                            <div key={cls.id} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                                <div>
                                    <p className="font-bold">{cls.topic}</p>
                                    <p className="text-sm text-gray-500">{cls.instructor} - {cls.startTime}</p>
                                </div>
                                <a href={cls.joinLink} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors ${cls.status === 'Live' ? 'bg-brand-red text-white hover:bg-red-700' : 'bg-gray-200 text-gray-700 cursor-not-allowed'}`}>
                                    {cls.status === 'Live' ? 'Join Now' : 'Upcoming'}
                                </a>
                            </div>
                        )) : <p className="text-gray-500">No live classes scheduled for this paper.</p>}
                    </div>
                </div>

                {/* All Resources Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-brand-dark mb-4">Class Resources</h2>
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {resources.map((res, index) => {
                            const title = 'videoUrl' in res.data ? res.data.topic : res.data.title;
                            return (
                                <div key={index} className="flex items-center p-3 hover:bg-gray-100 rounded-md transition-colors">
                                    {resourceIcons[res.type]}
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-800">{title}</p>
                                        <p className="text-xs text-gray-500">
                                            {'date' in res.data ? `Date: ${res.data.date}` : `Uploaded: ${res.data.uploadDate}`}
                                        </p>
                                    </div>
                                    <div className="space-x-2">
                                        {'videoUrl' in res.data && (
                                            // FIX: Used the 'title' variable which holds the topic for lectures, resolving a type inference issue within the onClick handler.
                                            <button onClick={() => setRatingTarget({ teacherName: 'Your Teacher', classTopic: title })} className="text-xs font-semibold text-yellow-600 hover:underline">Rate</button>
                                        )}
                                        <button onClick={() => handleDownload(res.data)} className="text-xs font-semibold text-blue-600 hover:underline">Download</button>
                                    </div>
                                </div>
                            );
                        })}
                        {resources.length === 0 && <p className="text-gray-500">No resources available for this paper yet.</p>}
                    </div>
                </div>
            </div>

            <DownloadManager queue={downloadQueue} onPause={handlePauseDownload} onResume={handleResumeDownload} onCancel={handleCancelDownload} onClearCompleted={handleClearCompleted} />
            
            {ratingTarget && (
                <RatingModal
                    isOpen={!!ratingTarget}
                    onClose={() => setRatingTarget(null)}
                    onSubmit={handleRatingSubmit}
                    teacherName={ratingTarget.teacherName}
                    classTopic={ratingTarget.classTopic}
                />
            )}
        </div>
    );
};

// FIX: Added default export to resolve module import error in StudentPortalPage.
export default LiveClasses;
