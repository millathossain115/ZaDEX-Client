import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations using Intersection Observer.
 * 
 * @param {Object} options
 * @param {number} options.threshold - How much of the element must be visible (0-1). Default: 0.15
 * @param {string} options.rootMargin - Margin around root. Default: '0px'
 * @param {boolean} options.triggerOnce - If false, animation replays every time element enters viewport. Default: false
 * @returns {[React.RefObject, boolean]} - [ref to attach to element, whether element is visible]
 */
const useScrollAnimation = ({ threshold = 0.15, rootMargin = '0px', triggerOnce = false } = {}) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.unobserve(element);
        };
    }, [threshold, rootMargin, triggerOnce]);

    return [ref, isVisible];
};

export default useScrollAnimation;
