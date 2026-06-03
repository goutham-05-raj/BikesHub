import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Safety timeout: if Firebase doesn't respond in 8s, stop blocking
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 8000);

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            clearTimeout(timeout);
            if (currentUser) {
                // Manually set role for admin email since Firebase doesn't provide it by default
                currentUser.role = currentUser.email === 'admin@123.com' ? 'admin' : 'user';
            }
            setUser(currentUser);
            setLoading(false);
        }, (error) => {
            clearTimeout(timeout);
            console.error('Firebase auth error:', error);
            setLoading(false);
        });

        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const formatEmail = (rawEmail) => {
        let email = rawEmail ? rawEmail.trim() : '';
        if (email && email.includes('@') && !email.includes('.')) {
            email = `${email}.com`;
        }
        return email;
    };

    const login = (email, password) => {
        const formattedEmail = formatEmail(email);
        return signInWithEmailAndPassword(auth, formattedEmail, password);
    };

    const signup = (email, password) => {
        const formattedEmail = formatEmail(email);
        return createUserWithEmailAndPassword(auth, formattedEmail, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        user,
        login,
        signup,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
