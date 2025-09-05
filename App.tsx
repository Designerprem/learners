import React from 'react';
// FIX: Split react-router-dom imports to resolve module export errors.
import { HashRouter } from 'react-router-dom';
import { Routes, Route, Outlet } from 'react-router';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import CoursesPage from './pages/CoursesPage.tsx';
import AdmissionsPage from './pages/AdmissionsPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import GalleryPage from './pages/GalleryPage.tsx';
import FAQPage from './pages/FAQPage.tsx';
import StudentPortalPage from './pages/StudentPortalPage.tsx';
import FacultyPortalPage from './pages/FacultyPortalPage.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';
import CourseDetailPage from './pages/CourseDetailPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import AdminPortalPage from './pages/AdminPortalPage.tsx';
import BlogPage from './pages/BlogPage.tsx';
import BlogPostPage from './pages/BlogPostPage.tsx';
import FeeStructurePage from './pages/FeeStructurePage.tsx';
import VlogsPage from './pages/VlogsPage.tsx';
import DeploymentGuidePage from './pages/DeploymentGuidePage.tsx';

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
                        {/* Add route for the new Fee Structure page. */}
                        <Route path="/fees" element={<FeeStructurePage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/faq" element={<FAQPage />} />
                        <Route path="/blog" element={<BlogPage />} />
                        <Route path="/blog/:postId" element={<BlogPostPage />} />
                        <Route path="/vlogs" element={<VlogsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                    </Route>
                    
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/student-portal/*" element={<StudentPortalPage />} />
                    <Route path="/faculty-portal/*" element={<FacultyPortalPage />} />
                    <Route path="/admin-portal/*" element={<AdminPortalPage />} />
                    <Route path="/deployment-guide" element={<DeploymentGuidePage />} />
                </Routes>
            </div>
        </HashRouter>
    );
};

export default App;