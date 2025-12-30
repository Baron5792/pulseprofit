import { useState, useEffect } from 'react';
import styles from '../../../assets/css/Home.module.css';
import Image from '../../../assets/images/featured/success.png';

const WhoWeAre = () => {
    const [customerCount, setCustomerCount] = useState(0);
    const [expertCount, setExpertCount] = useState(0);
    const [isCounting, setIsCounting] = useState(false);

    // Target values
    const targetCustomers = 884;
    const targetExperts = 219;
    
    // Animation duration in milliseconds
    const animationDuration = 2000; // 2 seconds for counting animation
    const intervalDuration = 10000; // 10 seconds between animations

    const animateCount = (setCount, target, duration) => {
        const startTime = Date.now();
        const startValue = 0;
        
        const updateCount = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuart);
            
            setCount(currentValue);
            
            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                setCount(target); // Ensure we end exactly at the target
            }
        };
        
        requestAnimationFrame(updateCount);
    };

    useEffect(() => {
        let intervalId;

        const startCounting = () => {
            setIsCounting(true);
            animateCount(setCustomerCount, targetCustomers, animationDuration);
            animateCount(setExpertCount, targetExperts, animationDuration);
        };

        // Start first animation immediately
        startCounting();

        // Set up interval for repeating every 10 seconds
        intervalId = setInterval(() => {
            // Reset to 0 and start counting again
            setCustomerCount(0);
            setExpertCount(0);
            
            // Small delay before starting next animation
            setTimeout(() => {
                startCounting();
            }, 100);
        }, intervalDuration);

        // Cleanup interval on component unmount
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []);

    // Format numbers with K suffix
    const formatNumber = (num) => {
        return `${num} K`;
    };

    return (
        <>
            <div className="container">
                <div className={`${styles['CustomerReport']} row`}>
                    <div className={`${styles['customerReportImg']} col-12 col-md-12 col-lg-6`}>
                        <img src={Image} alt="__blank" />
                    </div>
                    <div className={`col-12 col-md-6 col-lg-3 ${styles['customerTrackRecord']}`}>
                        <div className={styles['customerTrackRecordSpace']}>
                            <p>Customers With 100% Satisfaction</p>
                            <p>{formatNumber(customerCount)}</p>
                            <p>A digital platform ready to serve and guide you through...</p>
                        </div>
                    </div>
            
                    <div className={`col-12 col-md-6 col-lg-3 ${styles['customerTrackRecord']}`}>
                        <div className={styles['customerTrackRecordSpace']}>
                            <p>Experienced & Professional Experts</p>
                            <p>{formatNumber(expertCount)}</p>
                            <p>A typical business holds many different...</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WhoWeAre;