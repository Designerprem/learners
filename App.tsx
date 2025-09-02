
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CoursesPage from './pages/CoursesPage';
import AdmissionsPage from './pages/AdmissionsPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import FAQPage from './pages/FAQPage';
import StudentPortalPage from './pages/StudentPortalPage';
import FacultyPortalPage from './pages/FacultyPortalPage';
import ScrollToTop from './components/ScrollToTop';
import CourseDetailPage from './pages/CourseDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPortalPage from './pages/AdminPortalPage';

const MainLayout = () => (
    <>
        <Header />
        <main className="flex-grow">
            <Outlet />
        </main>
        <Footer />
    </>
);


const App: React.FC = () => {
    return (
        <HashRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
                 <Routes>
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/courses/:courseId" element={<CourseDetailPage />} />
                        <Route path="/admissions" element={<AdmissionsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                    </Route>
                    
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/student-portal/*" element={<StudentPortalPage />} />
                    <Route path="/faculty-portal/*" element={<FacultyPortalPage />} />
                    <Route path="/admin-portal/*" element={<AdminPortalPage />} />
                </Routes>
            </div>
        </HashRouter>
    );
};

export default App;