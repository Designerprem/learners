
import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LIVE_CLASSES, RECORDED_LECTURES, COURSE_MATERIALS, COURSES } from '../../constants';
import type { CourseMaterial, DownloadItem, LiveClass, RecordedLecture } from '../../types';
import DownloadManager from '../../components/student-portal/DownloadManager';
import RatingModal from '../../components/student-portal/RatingModal';

type ResourceType = 'lectures' | 'notes' | 'assignments';

const resourceIcons: { [key in ResourceType]: JSX.Element } = {
    lectures: <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>,
    notes: <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
    assignments: <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
};


const ResourceViewerModal = ({ file, onClose }: { file: CourseMaterial; onClose: () => void; }) => {
    // A sample public PDF for demonstration
    const samplePdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose} role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-2xl w-11/12 max-w-4xl h-5/6 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-lg text-brand-dark truncate pr-4">{file.title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-brand-red text-3xl font-light" aria-label="Close viewer">&times;</button>
                </div>
                <div className="flex-1 p-2 overflow-auto bg-gray-100">
                    {file.type === 'PDF' ? (
                        <iframe src={samplePdfUrl} width="100%" height="100%" title={file.title} className="border-0"></iframe>
                    ) : (
                        <div className="p-4 bg-white h-full">
                            <h4 className="font-bold text-xl mb-2">{file.title}</h4>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                This is a placeholder for the {file.type.toLowerCase()} content. In a real application, the actual content would be displayed here.
                                {'\n\n'}
                                For assignments, this area might include the assignment brief, questions, and submission guidelines. For notes, it would contain the study material.
                                {'\n\n'}
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede.
                            </p>
                        </div>
                    )}
                </div>
                <div className="p-3 border-t bg-gray-50 text-right">
                    <a href={file.downloadLink} download className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                        Download
                    </a>
                </div>
            </div>
        </div>
    );
};


const LiveClasses: React.FC = () => {
    const [searchParams] = useSearchParams();
    const paperFromUrl = searchParams.get('paper');
    
    const [activeTab, setActiveTab] = useState<ResourceType>('lectures');
    const [selectedPaper, setSelectedPaper] = useState<string>(paperFromUrl || 'All');
    const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
    const [downloadQueue, setDownloadQueue] = useState<DownloadItem[]>([]);
    const [viewingFile, setViewingFile] = useState<CourseMaterial | null>(null);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [classToRate, setClassToRate] = useState<LiveClass | null>(null);
    
    const enrolledPapers = COURSES[1].papers;

    const liveNow = LIVE_CLASSES.find(c => c.status === 'Live');
    const upcomingClasses = LIVE_CLASSES.filter(c => c.status === 'Upcoming');

    const allCourseMaterials = useMemo(() => {
        const savedMaterials = localStorage.getItem('customMaterials');
        const customMaterials: CourseMaterial[] = savedMaterials ? JSON.parse(savedMaterials) : [];
        const baseIds = new Set(COURSE_MATERIALS.map(m => m.id));
        const uniqueCustom = customMaterials.filter(m => !baseIds.has(m.id));
        return [...COURSE_MATERIALS, ...uniqueCustom];
    }, []);

    const allRecordedLectures = useMemo(() => {
        const savedLectures = localStorage.getItem('customLectures');
        const customLectures: RecordedLecture[] = savedLectures ? JSON.parse(savedLectures) : [];
        const baseIds = new Set(RECORDED_LECTURES.map(l => l.id));
        const uniqueCustom = customLectures.filter(l => !baseIds.has(l.id));
        return [...RECORDED_LECTURES, ...uniqueCustom];
    }, []);


    const materialsById = useMemo(() => {
        const map = new Map<number, CourseMaterial>();
        allCourseMaterials.forEach(material => map.set(material.id, material));
        return map;
    }, [allCourseMaterials]);

    const filteredMaterials = useMemo(() => {
        let materials: (CourseMaterial | {id: number, paper: string; title: string; uploadDate: string; downloadLink: string; type: 'lectures'})[] = [];
        if (activeTab === 'lectures') {
             materials = allRecordedLectures.map(lec => ({ ...lec, id: lec.id, title: lec.topic, uploadDate: lec.date, downloadLink: lec.videoUrl, type: 'lectures' as const }));
        } else if (activeTab === 'notes') {
            materials = allCourseMaterials.filter(m => m.type === 'PDF' || m.type === 'Notes');
        } else {
            materials = allCourseMaterials.filter(m => m.type === 'Assignment');
        }
        if (selectedPaper !== 'All') {
            return materials.filter(m => m.paper === selectedPaper);
        }
        return materials.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    }, [activeTab, selectedPaper, allCourseMaterials, allRecordedLectures]);


    const handleToggleFileSelection = (fileId: number) => {
        setSelectedFiles(prevSelected => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(fileId)) {
                newSelected.delete(fileId);
            } else {
                newSelected.add(fileId);
            }
            return newSelected;
        });
    };

    const handleDownloadSelected = () => {
        const newDownloads: DownloadItem[] = [];
        selectedFiles.forEach(id => {
            const material = materialsById.get(id);
            if (material && !downloadQueue.some(item => item.id === id)) {
                newDownloads.push({
                    id,
                    title: material.title,
                    status: 'queued',
                    progress: 0,
                    size: Math.floor(Math.random() * (10000 - 500 + 1) + 500), // Random size 500KB-10MB
                });
            }
        });
        setDownloadQueue(prev => [...prev, ...newDownloads]);
        setSelectedFiles(new Set());
    };

    const updateDownloadProgress = (id: number, progress: number, status?: DownloadItem['status']) => {
        setDownloadQueue(prev => prev.map(item => item.id === id ? { ...item, progress: Math.min(progress, 100), status: status || item.status } : item));
    };

    const startDownload = (item: DownloadItem) => {
        const intervalId = setInterval(() => {
            setDownloadQueue(prev => {
                const currentItem = prev.find(d => d.id === item.id);
                if (currentItem && currentItem.status === 'downloading') {
                    const newProgress = currentItem.progress + Math.random() * 5;
                    if (newProgress >= 100) {
                        clearInterval(currentItem.intervalId);
                        return prev.map(d => d.id === item.id ? { ...d, progress: 100, status: 'completed', intervalId: undefined } : d);
                    }
                    return prev.map(d => d.id === item.id ? { ...d, progress: newProgress } : d);
                }
                return prev;
            });
        }, 200);

        setDownloadQueue(prev => prev.map(d => d.id === item.id ? { ...d, status: 'downloading', intervalId } : d));
    };

    useEffect(() => {
        downloadQueue.forEach(item => {
            if (item.status === 'queued') {
                startDownload(item);
            }
        });
    }, [downloadQueue]);

    const handlePauseDownload = (id: number) => {
        const item = downloadQueue.find(d => d.id === id);
        if (item && item.intervalId) {
            clearInterval(item.intervalId);
            setDownloadQueue(prev => prev.map(d => d.id === id ? { ...d, status: 'paused', intervalId: undefined } : d));
        }
    };

    const handleResumeDownload = (id: number) => {
        const item = downloadQueue.find(d => d.id === id);
        if (item && item.status === 'paused') {
            startDownload(item);
        }
    };
    
    const handleCancelDownload = (id: number) => {
        const item = downloadQueue.find(d => d.id === id);
        if (item && item.intervalId) {
            clearInterval(item.intervalId);
        }
        setDownloadQueue(prev => prev.filter(d => d.id !== id));
    };

    const handleClearCompleted = () => {
        setDownloadQueue(prev => prev.filter(item => item.status !== 'completed' && item.status !== 'canceled' && item.status !== 'failed'));
    };
    
    const isDownloadableTab = activeTab === 'notes' || activeTab === 'assignments';

    const handleJoinClassClick = (liveClass: LiveClass) => {
        setClassToRate(liveClass);
        setIsRatingModalOpen(true);
    };

    const handleRatingSubmit = (rating: number, feedback: string) => {
        if (!classToRate) return;
        // In a real application, you would send this data to your backend API
        console.log({
            classId: classToRate.id,
            teacher: classToRate.instructor,
            topic: classToRate.topic,
            rating,
            feedback,
        });
    };

    return (
        <div>
            <h1 className="text-4xl font-bold text-brand-dark mb-8">Classes & Resources</h1>

            {liveNow && (
                <div className="mb-8 bg-red-100 border-l-4 border-brand-red p-6 rounded-r-lg shadow-lg">
                    <div className="flex items-center">
                        <span className="relative flex h-3 w-3 mr-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                        <div>
                            <h2 className="text-xl font-bold text-brand-red">LIVE NOW: {liveNow.paper}</h2>
                            <p className="text-gray-700">{liveNow.topic} with {liveNow.instructor}</p>
                        </div>
                         <a href={liveNow.joinLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            onClick={() => handleJoinClassClick(liveNow)}
                            className="ml-auto bg-brand-red text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                            Join Class
                        </a>
                    </div>
                </div>
            )}

            <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-brand-dark mb-4">Upcoming Classes Today</h2>
                {upcomingClasses.length > 0 ? (
                    <ul className="space-y-3">
                        {upcomingClasses.map(c => (
                             <li key={c.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                                <div>
                                    <p className="font-semibold">{c.paper}: <span className="font-normal">{c.topic}</span></p>
                                    <p className="text-sm text-gray-500">{c.instructor}</p>
                                </div>
                                 <span className="text-sm font-semibold text-brand-dark bg-gray-200 px-3 py-1 rounded-full">{c.startTime}</span>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-500">No more classes scheduled for today.</p>}
            </div>
            
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-brand-dark mb-4">Learning Resources</h2>
                
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <div className="flex border-b">
                        <button onClick={() => setActiveTab('lectures')} className={`py-2 px-4 font-semibold ${activeTab === 'lectures' ? 'border-b-2 border-brand-red text-brand-red' : 'text-gray-500'}`}>Recorded Lectures</button>
                        <button onClick={() => setActiveTab('notes')} className={`py-2 px-4 font-semibold ${activeTab === 'notes' ? 'border-b-2 border-brand-red text-brand-red' : 'text-gray-500'}`}>Notes & PDFs</button>
                        <button onClick={() => setActiveTab('assignments')} className={`py-2 px-4 font-semibold ${activeTab === 'assignments' ? 'border-b-2 border-brand-red text-brand-red' : 'text-gray-500'}`}>Assignments</button>
                    </div>
                     <div>
                        <label htmlFor="paperFilter" className="sr-only">Filter by Paper</label>
                        <select 
                            id="paperFilter" 
                            value={selectedPaper}
                            onChange={(e) => setSelectedPaper(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-brand-red focus:border-brand-red"
                        >
                            <option value="All">All Papers</option>
                            {enrolledPapers.map(paper => <option key={paper} value={paper}>{paper}</option>)}
                        </select>
                    </div>
                </div>

                {isDownloadableTab && selectedFiles.size > 0 && (
                     <div className="bg-brand-beige p-3 rounded-md mb-4 flex justify-between items-center">
                        <p className="font-semibold">{selectedFiles.size} file(s) selected.</p>
                        <button 
                            onClick={handleDownloadSelected} 
                            className="bg-brand-red text-white font-semibold px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                            Download Selected
                        </button>
                    </div>
                )}


                <div className="space-y-3">
                    {filteredMaterials.length > 0 ? filteredMaterials.map((item) => (
                         <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md transition-colors">
                            <div className="flex items-center">
                               {isDownloadableTab && (
                                    <input 
                                        type="checkbox"
                                        className="h-4 w-4 mr-4 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                                        checked={selectedFiles.has(item.id)}
                                        onChange={() => handleToggleFileSelection(item.id)}
                                        aria-label={`Select ${item.title}`}
                                    />
                                )}
                                {resourceIcons[activeTab]}
                                <div>
                                    <p className="font-semibold text-brand-dark">{item.title}</p>
                                    <p className="text-sm text-gray-500">{item.paper || selectedPaper} - {item.uploadDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                {(activeTab === 'notes' || activeTab === 'assignments') && (
                                    <button 
                                        onClick={() => setViewingFile(item as CourseMaterial)}
                                        className="text-sm font-semibold text-blue-600 hover:underline"
                                    >
                                        View
                                    </button>
                                )}
                                <a 
                                    href={item.downloadLink} 
                                    className="text-sm font-semibold text-brand-red hover:underline"
                                    {...(activeTab === 'lectures' && { target: '_blank', rel: 'noopener noreferrer' })}
                                    {...(isDownloadableTab && { download: true })}
                                >
                                    {activeTab === 'lectures' ? 'Watch Now' : 'Download'}
                                </a>
                            </div>
                        </div>
                    )) : (
                         <div className="text-center py-8 text-gray-500">
                             <p>No resources found for the selected criteria.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {downloadQueue.length > 0 && (
                <DownloadManager 
                    queue={downloadQueue}
                    onPause={handlePauseDownload}
                    onResume={handleResumeDownload}
                    onCancel={handleCancelDownload}
                    onClearCompleted={handleClearCompleted}
                />
            )}

            {viewingFile && (
                <ResourceViewerModal file={viewingFile} onClose={() => setViewingFile(null)} />
            )}

            {classToRate && (
                 <RatingModal
                    isOpen={isRatingModalOpen}
                    onClose={() => setIsRatingModalOpen(false)}
                    onSubmit={handleRatingSubmit}
                    teacherName={classToRate.instructor}
                    classTopic={classToRate.topic}
                />
            )}
        </div>
    );
};

export default LiveClasses;
