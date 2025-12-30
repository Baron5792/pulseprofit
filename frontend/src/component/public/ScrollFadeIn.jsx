import React, { useRef, useEffect, useState } from 'react';
import css from '../../assets/css/ScrollFadeIn.module.css';

const ScrollFadeIn = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            // isIntersecting is true when the element is visible
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                // We stop observing the element once it becomes visible
                observer.unobserve(domRef.current);
            }
        });

        // Start observing the element
        observer.observe(domRef.current);

        // Clean up observer when component unmounts
        return () => observer.disconnect();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div
        className={`${css['fade-in-section']} ${isVisible ? css['is-visible'] : ''}`} ref={domRef}
        >
            {children}
        </div>
    );
};

export default ScrollFadeIn;