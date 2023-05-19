import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SessionCheck from '../components/sessionCheck';

const UpdatePasswordForm = ({ userId }) => {
    const [user, setUser] = useState({ id: null, email: '' }); // Define user state
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Retrieve user information from session storage
        const session = sessionStorage.getItem('user');
        if (session) {
            const { id, email } = JSON.parse(session);
            setUser({ id, email });
        }
    }, []);

    const handlePasswordChange = (event) => {
        const { value } = event.target;
        setPassword(value);
        setPasswordError('');
    };

    const handleSubmit = async () => {
        // Perform form submission logic
        if (password.length < 4) {
            setPasswordError('Password must be at least 4 characters long');
        } else if (!/^((?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])).{4,}$/.test(password)) {
            setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
        } else {
            // Call API to update password
            try {
                const response = await fetch(`http://localhost:8080/customers/updatepass/${user.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ password }),
                });
                if (response.ok) {
                    // Redirect to sign-in page
                    router.push('http://localhost:3000/customers/signin');
                } else {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to update password');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div>
            {<SessionCheck />}
            <section class="text-gray-600 body-font details-section mt-2 ml-2 mr-2 h-screen" style={{ backgroundImage: `url("../images/dashboard.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover' }}>
                <Link href="http://localhost:3000/customers/dashboard">
                    <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-2 ml-10 ">Back</button>
                </Link>
                <div class="flex justify-center items-center ">
                    <div class="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
                        <h2 class="text-2xl font-semibold text-black mb-6">Update Password</h2>
                        <div>
                            <label class="block text-white text-sm font-bold mb-2">Email:</label>
                            <input type="email" value={user.email} readOnly class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" /><br />
                        </div>
                        <div>
                            <label class="block text-white text-sm font-bold mb-2">Password:</label>
                            <input type="password" value={password} onChange={handlePasswordChange} class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" />
                            {passwordError && <span class="text-red-500">{passwordError}</span>}<br />
                        </div>
                        <br></br>
                        <button onClick={handleSubmit} class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Submit</button>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default UpdatePasswordForm;
