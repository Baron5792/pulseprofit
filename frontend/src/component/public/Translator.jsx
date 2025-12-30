import React, { useEffect, useState, useRef, useCallback } from 'react';
import styles from '../../assets/css/Translator.module.css';
// Ensure you have a flag-icons.css file or equivalent for the 'fi' class
// import './flag-icons.css'; 

const languages = [
  { code: '', name: 'Select language', flag: '' },
  // Map language codes to country flag codes (ISO 3166-1 alpha-2)
  { code: 'en', name: 'English', flag: 'us' }, 
  { code: 'es', name: 'Spanish', flag: 'es' }, 
  { code: 'fr', name: 'French', flag: 'fr' }, 
  { code: 'de', name: 'German', flag: 'de' }, 
  { code: 'zh-CN', name: 'Chinese', flag: 'cn' }, 
  { code: 'ja', name: 'Japanese', flag: 'jp' }, 
  { code: 'ar', name: 'Arabic', flag: 'sa' }, // Using Saudi Arabia flag
  { code: 'ru', name: 'Russian', flag: 'ru' }, 
  { code: 'pt', name: 'Portuguese', flag: 'pt' }, 
  { code: 'hi', name: 'Hindi', flag: 'in' }, 
];

const GoogleTranslateCustom = () => {
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(languages[0]);
  
  const scriptLoadedRef = useRef(false);
  const pollIntervalRef = useRef(null);
  const isChangingLanguageRef = useRef(false);
  const dropdownRef = useRef(null);
  const elementRef = useRef(null); // Ref for Google Widget placement

  // Function to click the hidden Google Translate dropdown
  const triggerGoogleChange = useCallback((langCode) => {
    setError(null);
    if (!langCode) return;

    if (!isGoogleReady) {
      setError('Translator not ready. Please wait.');
      return;
    }

    if (isChangingLanguageRef.current) return;
    isChangingLanguageRef.current = true;

    const selectors = ['select.goog-te-combo', 'select[id*="language"]'];
    const maxAttempts = 20;
    let attempts = 0;

    const tryChangeLanguage = () => {
      let googleDropdown = null;

      // 1. Check main document
      for (const selector of selectors) {
        googleDropdown = document.querySelector(selector);
        if (googleDropdown) break;
      }

      // 2. Check within iframe (if needed, but usually redundant)
      if (!googleDropdown) {
        const iframe = document.querySelector('.goog-te-banner-frame, iframe[id*="google"]');
        if (iframe && iframe.contentDocument) {
          googleDropdown = iframe.contentDocument.querySelector('select.goog-te-combo');
        }
      }

      if (googleDropdown) {
        // Find the option element in the Google dropdown
        const option = googleDropdown.querySelector(`option[value="${langCode}"]`);
        
        if (option) {
            // console.log('Dropdown value before change:', googleDropdown.value);
            googleDropdown.value = langCode;
            googleDropdown.dispatchEvent(new Event('change', { bubbles: true }));
            // console.log('Language change triggered via hidden select');
            
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
            isChangingLanguageRef.current = false;
        } else {
            console.warn(`Target language option for ${langCode} not found in Google dropdown.`);
            if (attempts >= maxAttempts) {
                clearInterval(pollIntervalRef.current);
                isChangingLanguageRef.current = false;
                setError('Failed to trigger translation.');
            } else {
                attempts++;
            }
        }
      } else if (attempts >= maxAttempts) {
        setError('Google Translate dropdown not found.');
        clearInterval(pollIntervalRef.current);
        isChangingLanguageRef.current = false;
      } else {
        attempts++;
      }
    };

    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = setInterval(tryChangeLanguage, 500);
    tryChangeLanguage();

    setTimeout(() => {
        if (isChangingLanguageRef.current) {
            isChangingLanguageRef.current = false;
        }
    }, 10000);
  }, [isGoogleReady]);


  const handleLanguageSelect = (lang) => {
    setCurrentLang(lang);
    setIsDropdownOpen(false);
    triggerGoogleChange(lang.code);
  };

  const handleOutsideClick = useCallback((event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [handleOutsideClick]);

  // Initial load effect for Google Translate script
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    scriptLoadedRef.current = true;

    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            autoDisplay: false,
            includedLanguages: languages.filter(lang => lang.code).map(lang => lang.code).join(','),
            gaTrack: false,
          },
          elementRef.current // Use the Ref to place the hidden widget
        );
        setIsGoogleReady(true);
      } catch (err) {
        console.error('Google Translate initialization failed:', err);
        setError('Failed to initialize translator.');
      }
    };

    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => setError('Failed to load translator.');
    document.head.appendChild(script);

    const timeout = setTimeout(() => {
      if (!window.google || !window.google.translate) {
        setError('Translator took too long to load.');
        setIsGoogleReady(false);
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  // Filter out the placeholder language for the map operation
  const displayLanguages = languages.filter(lang => lang.code !== '');

  return (
    <div className={styles.translateWrapper}>
      {/* Custom Flag Dropdown */}
      <div ref={dropdownRef} className={styles.customDropdown}>
        <button
          className={styles.dropdownButton}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          disabled={!isGoogleReady || !!error}
        >
          {currentLang.flag && (
            <span className={`${styles.flagIcon} fi fi-${currentLang.flag}`}></span>
          )}
          {currentLang.name}
          <span className={styles.arrowIcon}>{isDropdownOpen ? '▲' : '▼'}</span>
        </button>

        {isDropdownOpen && (
          <ul className={styles.dropdownList}>
            {displayLanguages.map((lang) => (
              <li
                key={lang.code}
                onClick={() => handleLanguageSelect(lang)}
                className={currentLang.code === lang.code ? styles.selected : ''}
              >
                <span className={`${styles.flagIcon} fi fi-${lang.flag}`}></span>
                {lang.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hidden container for Google Translate Widget */}
      <div 
        ref={elementRef} 
        className={styles.hiddenGoogleWidget} 
      />

      {error && <div className={styles.errorText}>{error}</div>}
      {!isGoogleReady && !error && (
        <div className={styles.loadingText}>Loading translator...</div>
      )}
    </div>
  );
};

export default GoogleTranslateCustom;