import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const SignOutPage = () => {
    const [user, setUser] = useState('');
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            const response = await axios.get('http://localhost:8080/customers/logout');
            console.log(response.data);

            if (typeof window !== 'undefined') {
                // Check if sessionStorage is defined in the browser environment
                sessionStorage.removeItem('user');
            }
            setUser(null);
            //  router.push('/customers/signin');
        } catch (error) {
            console.error(error);
        }
    };

    // Get session storage item and log its value
    if (typeof window !== 'undefined') {
        console.log('Session Storage Item:', sessionStorage.getItem('user'));
    }

    return (
        <>
            <div>
                <h1>Sign Out</h1>
                {/* Render your sign-out UI */}
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        </>
    );

};
export default SignOutPage;
