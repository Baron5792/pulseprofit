import { useState, useEffect, createContext, useContext } from "react";
import { toast } from "react-toastify";

const CsrfTokenContext = createContext();

export const useCsrfToken = () => {
    if (!CsrfTokenContext) {
        throw new Error("useCsrfToken must be used within a CsrfTokenProvider");
    }
    return useContext(CsrfTokenContext);
}

export const CsrfTokenProvider = ({ children }) => {
    const [csrfToken, setCsrfToken] = useState('');
    const fetchCsrfToken = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_MIDDLEWARE}csrf_token.php`, {
                method: 'GET',
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error("Network response was not ok", {toastId: 'csrf_token_network_error'});
            }
            else {
                const data = await response.json();
                setCsrfToken(data.token);
            }

        } catch (error) {
            toast.error("Something went wrong.", {toastId: 'csrf_token_error'});
        }
    }

    useEffect(() => {
        fetchCsrfToken();
    }, []);

    const value = {
        csrfToken,
        refreshCsrfToken: fetchCsrfToken
    }

    return (
        <CsrfTokenContext.Provider value={value}>
            {children}
        </CsrfTokenContext.Provider>
    )
}