import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getItems, saveItems } from '../../services/dataService.ts';
import type { MockTest, StudentSubmission, StudentAnswer, Student } from '../../types.ts';
import { getLoggedInUser } from '../../services/authService.ts';
import ConfirmModal from '../../components/ConfirmModal.tsx';

const TakeTestPage: React.FC = () => {
    const { testId } = useParams<{ testId: string }>();
    const navigate = useNavigate();

    const [test, setTest] = useState<MockTest | null>(null);
    const [submission, setSubmission] = useState<StudentSubmission | null>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const autoSubmitTriggered = useRef(false);

    useEffect(() => {
        const loadTestSession = () => {
            const { user: student } = getLoggedInUser() as { user: Student | null };
            const numericTestId = Number(testId);
            
            if (!student || isNaN(numericTestId)) {
                navigate('/student-portal/mock-tests', { replace: true });
                return;
            }
    
            const allTests = getItems<MockTest[]>('mockTests', []);
            const allSubmissions = getItems<StudentSubmission[]>('studentSubmissions', []);
    
            let activeSubmission: StudentSubmission | undefined;
    
            // --- Method 1: Try sessionStorage first (for direct navigation) ---
            const activeSubmissionStr = sessionStorage.getItem('activeSubmission');
            if (activeSubmissionStr) {
                try {
                    const parsedSubmission = JSON.parse(activeSubmissionStr);
                    // Verify that the submission from session storage matches the URL's testId
                    if (parsedSubmission && parsedSubmission.testId === numericTestId) {
                        activeSubmission = parsedSubmission;
                    }
                } catch (e) {
                    console.error("Error parsing submission from sessionStorage", e);
                }
                // IMPORTANT: Clean up after read, regardless of success, to prevent stale data.
                sessionStorage.removeItem('activeSubmission');
            }
    
            // --- Method 2: Fallback to localStorage (for page refresh) ---
            if (!activeSubmission) {
                activeSubmission = allSubmissions.find(s => 
                    s.testId === numericTestId && 
                    s.studentId === student.id && 
                    s.status === 'In Progress'
                );
            }
            
            // --- Final Validation ---
            if (activeSubmission) {
                const correspondingTest = allTests.find(t => t.id === activeSubmission!.testId);
    
                if (correspondingTest) {
                    // Success! We have a valid submission and its corresponding test.
                    if (activeSubmission.status === 'Completed') {
                        navigate(`/student-portal/review-test/${activeSubmission.id}`, { replace: true });
                        return;
                    } else {
                        setTest(correspondingTest);
                        setSubmission(activeSubmission);
                        return;
                    }
                }
            }
            
            // --- Failure Case ---
            console.error(`Could not find a valid test session for test ID ${numericTestId}.`);
            alert("There was an error loading your test. It might have been completed or is no longer available. Please try again from the test list.");
            navigate('/student-portal/mock-tests', { replace: true });
        };
        
        loadTestSession();
    }, [testId, navigate]);

     // This separate effect handles setting the timer once the test data is loaded.
    useEffect(() => {
        if (test && submission) {
            const startTime = new Date(submission.startTime).getTime();
            const endTime = startTime + test.durationMinutes * 60 * 1000;
            const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeLeft(remaining);
            setIsLoading(false);
        }
    }, [test, submission]);

    const finishTest = useCallback((reason: 'timeout' | 'manual' | 'cheating' | 'locked') => {
        if (autoSubmitTriggered.current) return;
        autoSubmitTriggered.current = true;

        if(reason === 'cheating') {
            alert("Test automatically submitted. You are not allowed to switch tabs or copy/paste during the exam.");
        }
        if (reason === 'locked') {
            alert("The test has been locked by the instructor. Your answers have been submitted automatically.");
        }

        setSubmission(currentSubmission => {
            if (!currentSubmission || currentSubmission.status !== 'In Progress') {
                return currentSubmission; 
            }
            
            const finishedSubmission = { ...currentSubmission, status: 'Completed' as const, submittedAt: new Date().toISOString() };
    
            const allSubmissions = getItems<StudentSubmission[]>('studentSubmissions', []);
            const updatedSubmissions = allSubmissions.map(sub =>
                sub.id === finishedSubmission.id ? finishedSubmission : sub
            );
            saveItems('studentSubmissions', updatedSubmissions);
            
            navigate(`/student-portal/review-test/${finishedSubmission.id}`, { replace: true });

            return finishedSubmission;
        });
    }, [navigate]);

    // Timer countdown effect
    useEffect(() => {
        if (isLoading || submission?.status !== 'In Progress' || timeLeft === null) return;

        if (timeLeft <= 0) {
            finishTest('timeout');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => (prevTime !== null ? Math.max(0, prevTime - 1) : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, [isLoading, timeLeft, submission?.status, finishTest]);

    // Lock and Anti-cheating effects
    useEffect(() => {
        if (isLoading || submission?.status !== 'In Progress') return;

        const preventAction = (e: Event) => e.preventDefault();
        
        const handleVisibilityChange = () => {
            if (document.hidden) {
                finishTest('cheating');
            }
        };

        const handleBlur = () => {
            finishTest('cheating');
        };
        
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'mockTests' && e.newValue) {
                try {
                    const updatedTests = JSON.parse(e.newValue) as MockTest[];
                    const currentTestStatus = updatedTests.find(t => t.id === Number(testId));
                    if (currentTestStatus?.isLocked) {
                        finishTest('locked');
                    }
                } catch (error) {
                    console.error("Error checking test lock status from storage", error);
                }
            }
        };


        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('copy', preventAction);
        document.addEventListener('paste', preventAction);
        document.addEventListener('cut', preventAction);
        document.addEventListener('contextmenu', preventAction);
        window.addEventListener('storage', handleStorageChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('copy', preventAction);
            document.removeEventListener('paste', preventAction);
            document.removeEventListener('cut', preventAction);
            document.removeEventListener('contextmenu', preventAction);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [isLoading, submission?.status, finishTest, testId]);


    // Auto-save progress
    useEffect(() => {
        if (!submission || submission.status !== 'In Progress') return;

        const autoSave = () => {
            setSubmission(currentSubmission => {
                if (!currentSubmission) return null;
                const allSubmissions = getItems<StudentSubmission[]>('studentSubmissions', []);
                const updatedSubmissions = allSubmissions.map(sub => 
                    sub.id === currentSubmission.id ? currentSubmission : sub
                );
                saveItems('studentSubmissions', updatedSubmissions);
                return currentSubmission;
            });
        };
        const interval = setInterval(autoSave, 15000); // Save every 15 seconds
        window.addEventListener('beforeunload', autoSave);

        return () => {
            clearInterval(interval);
            window.removeEventListener('beforeunload', autoSave);
            autoSave(); // Save one last time on cleanup
        };
    }, [submission]);

    const handleAnswerChange = (questionId: number, answerData: Partial<StudentAnswer>) => {
        setSubmission(prevSubmission => {
            if (!prevSubmission) return null;

            const newAnswers = [...prevSubmission.answers];
            const existingIndex = newAnswers.findIndex(a => a.questionId === questionId);

            if (existingIndex > -1) {
                newAnswers[existingIndex] = { ...newAnswers[existingIndex], ...answerData };
            } else {
                newAnswers.push({ questionId, ...answerData });
            }

            return { ...prevSubmission, answers: newAnswers };
        });
    };

    const handleManualSubmit = () => {
        setIsConfirmModalOpen(true);
    };

    const handleConfirmSubmit = () => {
        setIsConfirmModalOpen(false);
        finishTest('manual');
    };
    
    if (isLoading || !test || !submission) {
        return <div className="flex h-screen items-center justify-center bg-gray-100"><p className="text-lg font-semibold">Loading your test session...</p></div>;
    }

    const minutes = Math.floor((timeLeft || 0) / 60);
    const seconds = (timeLeft || 0) % 60;

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <header className="bg-white p-4 rounded-lg shadow-md mb-8 sticky top-4 z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-brand-dark">{test.title}</h1>
                        <p className="text-gray-500">{test.paper}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Time Left</p>
                        <p className="text-2xl font-bold text-brand-red font-mono" aria-live="polite">
                            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                        </p>
                    </div>
                </div>
            </header>
            
            <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-r-lg">
                <p className="font-bold">Important Rules</p>
                <ul className="list-disc list-inside text-sm">
                    <li>This test will be automatically submitted if you switch tabs, minimize the window, or try to copy/paste.</li>
                    <li>Ensure you complete the test in one sitting.</li>
                </ul>
            </div>

            <main className="space-y-6">
                 {test.questions.length > 0 ? (
                    test.questions.map((q, index) => {
                        const currentAnswer = submission.answers.find(a => a.questionId === q.id);
                        return (
                            <div key={q.id} className="bg-white p-6 rounded-lg shadow-md">
                                <p className="font-semibold text-gray-500">Question {index + 1} ({q.points} points)</p>
                                <p className="mt-2 text-lg text-gray-800 whitespace-pre-wrap">{q.questionText}</p>
                                <div className="mt-4">
                                    {q.type === 'MCQ' && q.mcqOptions && (
                                        <div className="space-y-3">
                                            {q.mcqOptions.map(opt => (
                                                <label key={opt.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 has-[:checked]:bg-blue-50 has-[:checked]:border-blue-400">
                                                    <input
                                                        type="radio"
                                                        name={`question-${q.id}`}
                                                        checked={currentAnswer?.selectedOptionId === opt.id}
                                                        onChange={() => handleAnswerChange(q.id, { selectedOptionId: opt.id })}
                                                        className="h-4 w-4 text-brand-red border-gray-300 focus:ring-brand-red"
                                                    />
                                                    <span className="ml-3 text-gray-700">{opt.text}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    {q.type === 'Theoretical' && (
                                        <textarea
                                            rows={5}
                                            value={currentAnswer?.answerText || ''}
                                            onChange={e => handleAnswerChange(q.id, { answerText: e.target.value })}
                                            className="w-full p-2 border rounded-md focus:ring-brand-red focus:border-brand-red bg-white"
                                            placeholder="Type your answer here..."
                                            spellCheck={false}
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            autoComplete="off"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h2 className="text-2xl font-bold text-yellow-700">Test Unavailable</h2>
                        <p className="text-gray-600 mt-2">
                            This test currently has no questions. Please check back later or contact your instructor.
                        </p>
                        <Link to="/student-portal/mock-tests" className="mt-6 inline-block bg-brand-dark text-white font-semibold px-6 py-2 rounded-md">
                            &larr; Back to Test List
                        </Link>
                    </div>
                )}
            </main>

            {test.questions.length > 0 && (
                <footer className="mt-8 text-center">
                    <button
                        onClick={handleManualSubmit}
                        className="bg-brand-red text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition-transform hover:scale-105"
                    >
                        Submit Test
                    </button>
                </footer>
            )}

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                title="Submit Test"
                message="Are you sure you want to submit your test? You cannot change your answers after this."
                onConfirm={handleConfirmSubmit}
                onCancel={() => setIsConfirmModalOpen(false)}
                confirmText="Submit Test"
                cancelText="Keep Working"
            />
        </div>
    );
};

export default TakeTestPage;
