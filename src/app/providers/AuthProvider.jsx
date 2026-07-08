import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '@/shared/lib/firebase/firebase.init';
import { clearAuthToken, createAuthToken } from '@/shared/services/authToken';
import { AuthContext } from './AuthContext';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
            .catch((err) => {
                setLoading(false);
                throw err;
            });
    }

    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
            .catch((err) => {
                setLoading(false);
                throw err;
            });
    }

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
            .catch((err) => {
                setLoading(false);
                throw err;
            });
    }

    const logOut = () => {
        setLoading(true);
        return signOut(auth)
            .catch((err) => {
                setLoading(false);
                throw err;
            });
    }

    const updateUserProfile = (profileData) => {
        return updateProfile(auth.currentUser, profileData).then(() => {
            // Refresh user state with updated info
            setUser({ ...auth.currentUser });
        });
    }

    useEffect(() => {
        let isMounted = true;

        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!isMounted) return;

            setUser(currentUser);

            try {
                if (currentUser?.email) {
                    await createAuthToken(currentUser.email);
                } else {
                    clearAuthToken();
                }
            } catch (err) {
                console.error('Failed to sync auth token:', err);
                clearAuthToken();
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    const authInfo = { user, loading, createUser, signIn, googleSignIn, logOut, updateUserProfile };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
