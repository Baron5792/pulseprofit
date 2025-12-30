import React, { useState, useEffect, useCallback } from 'react';

// Define the API URL (Update this to your actual VITE_APP_API_URL if needed)
// Assuming your PHP script is located at this endpoint:
const API_ENDPOINT = `${import.meta.env.VITE_APP_API_URL}fetch_random_activity.php`; 

interface Activity {
    id: number;
    message: string;
    timestamp: string;
}

const ActivityFeed = () => {
    // State to hold the current activity to display
    const [currentActivity, setCurrentActivity] = useState<Activity | null>(null);
    // State to control visibility for the fade-in/out effect
    const [isVisible, setIsVisible] = useState(false);
    
    // Duration for which the popup stays visible (5 seconds)
    const DISPLAY_DURATION = 5000; 

    // Function to fetch a new random activity from the PHP API
    const fetchNewActivity = useCallback(async () => {
        try {
            const response = await fetch(API_ENDPOINT, { method: 'GET' });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.message) {
                // Set the new activity and make it visible
                const newActivity: Activity = {
                    id: Date.now(),
                    message: data.message,
                    timestamp: new Date().toLocaleTimeString(),
                };
                
                setCurrentActivity(newActivity);
                setIsVisible(true);

                // Set a timer to hide the popup after DISPLAY_DURATION
                setTimeout(() => {
                    setIsVisible(false);
                    // Clear the activity data after the fade-out is complete (e.g., 0.5s later)
                    setTimeout(() => setCurrentActivity(null), 500); 
                }, DISPLAY_DURATION);
            }
        } catch (error) {
            console.error("Failed to fetch new activity:", error);
        }
    }, []);

    // Effect to manage the random interval for fetching new activity
    useEffect(() => {
        let timerId: number | undefined;

        const setRandomInterval = () => {
            // Generate a random interval between 8 and 15 seconds (8000ms to 15000ms)
            const randomDelay = Math.floor(Math.random() * 7000) + 8000; 

            timerId = setTimeout(() => {
                fetchNewActivity();
                // After fetching, immediately set up the next random interval
                setRandomInterval(); 
            }, randomDelay);
        };

        // Start the first interval fetch after an initial delay (e.g., 5 seconds)
        setTimeout(setRandomInterval, 5000);

        // Cleanup function for when the component unmounts
        return () => clearTimeout(timerId);
    }, [fetchNewActivity]);

    // Use CSS classes for cleaner styling and animations, but here is inline for simplicity
    const popupStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: '20px', // Bottom positioning
        left: '20px',  // Left positioning
        zIndex: 1000,
        backgroundColor: '#000000e0', // Dark semi-transparent background
        color: '#ffffff',
        padding: '15px 20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        minWidth: '250px',
        opacity: isVisible ? 1 : 0, // Controlled by state for fade effect
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)', // Slide up/down effect
        transition: 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out',
        pointerEvents: 'none', // Prevents blocking clicks on elements beneath it
        display: currentActivity ? 'flex' : 'none', // Hide when there's no data
        alignItems: 'center',
        justifyContent: 'space-between'
    };

    return (
        <div style={popupStyle}>
            {currentActivity && (
                <>
                    <p style={{ margin: 0, fontSize: '15px', fontWeight: 'bold' }}>
                        {currentActivity.message}
                    </p>
                    <span style={{ fontSize: '12px', color: '#ccc', marginLeft: '10px' }}>
                        {currentActivity.timestamp}
                    </span>
                </>
            )}
        </div>
    );
};

export default ActivityFeed;