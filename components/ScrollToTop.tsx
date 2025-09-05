

import { useEffect } from 'react';
// FIX: Changed import from react-router-dom to react-router for core hook.
import { useLocation } from 'react-router';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

export default ScrollToTop;