import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const UserContext = createContext(null);

export const useUser = () => {
    return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    const fetchUser = async() => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_COMP_URL}check-auth.php`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                credentials: 'include'
            })

            const request = await response.json();
            if (request.status === 'success') {
                setUser(request.data);
            }

            else {
                setUser(null);
            }
        }

        catch (error) {
            setUser(null);
            // window.location.href = '/account/login';
        }   
    }

    useEffect(() => {
        fetchUser();
    }, [])

    const value = {
        user,
        refreshUser: fetchUser
    };

    return (
        <UserContext.Provider value={value}>
            { children }
        </UserContext.Provider>
    )
}