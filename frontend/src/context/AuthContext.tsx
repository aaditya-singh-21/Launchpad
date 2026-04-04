import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { fetchWithAuth } from "../lib/api";



export interface User {
    _id: string,
    name: string,
    password: string,
    email: string,
    bio?: string,
    tech?: string[],
    socials?: {
        github?: string,
        linkedin?: string,
        portfolio?: string
    }
}

interface AuthContextType {
    user: User | null,
    token: string | null,
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type Props = {
    children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadUser = async () => {
            if (!token) {
                setIsLoading(false)
                return
            }

            try {
                const response = await fetchWithAuth("/user/me");
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.User);
                } else {
                    setToken(null)
                    localStorage.removeItem("token")
                    setUser(null)
                }
            } catch (error) {
                console.error('Failed to load user', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser()
    }, [token])


    const login = (newToken: string) => {
        localStorage.setItem("token", newToken)
        setToken(newToken)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    )

}


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}