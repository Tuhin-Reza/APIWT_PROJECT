import SessionCheck from '../components/sessionCheck';
import React, { useState, useEffect } from 'react';

const SendEmailForm = () => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailError, setEmailError] = useState('');

    useEffect(() => {
        const session = sessionStorage.getItem('user');
        if (session) {
            const { id, email, username } = JSON.parse(session);
            setUser({ id, email, username });
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        validateEmail();
        if (emailError) {
            setErrorMessage('Invalid email address');
            return;
        }

        if (!subject.trim()) {
            setErrorMessage('Subject is required');
            return;
        }

        if (!text.trim()) {
            setErrorMessage('Text is required');
            return;
        }



        try {
            const response = await fetch('http://localhost:8080/customers/sendemail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    subject: subject,
                    text: text,
                }),
            });

            if (response.ok) {
                setErrorMessage('');
                setSuccessMessage('Email sent successfully');
            } else {
                setErrorMessage('Failed to send email');
            }
        } catch (error) {
            setErrorMessage('Failed to send email');
        }
    };
    const validateEmail = () => {
        const isValid = email.includes('@') && email.endsWith('gmail.com');
        setEmailError(
            isValid ? '' : 'Email must contain "@" symbol and be a valid Gmail address'
        );
    };


    return (
        <>
            <section class="text-gray-600 body-font relative">
                {<SessionCheck />}
                <div className="absolute inset-0 bg-gray-300">
                    <img src="../images/feadBack.jpg" alt="Image" style={{ width: '100%', maxWidth: '1250px' }} />
                </div>

                <div class="container px-5 py-24 mx-auto flex">
                    <div class="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
                        <h2 class="text-gray-900 text-lg mb-1 font-medium title-font">Feedback</h2>
                        <p class="leading-relaxed mb-5 text-gray-600">Online Bookstore Feedback Form: We Value Your Opinion!"</p>
                        <form onSubmit={handleSubmit}>
                            <div class="relative mb-4">
                                <label htmlFor="email" class="leading-7 text-sm text-gray-600">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>

                            <div class="relative mb-4">
                                <label htmlFor="subject" class="leading-7 text-sm text-gray-600">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                />
                            </div>

                            <div class="relative mb-4" >
                                <label htmlFor="text" class="leading-7 text-sm text-gray-600">Text</label>
                                <textarea
                                    id="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                                ></textarea> </div>
                            <p class="text-xs text-red-500 dark:text-red">
                                {errorMessage && <p>{errorMessage}</p>}
                                {successMessage && <p>{successMessage}</p>}
                            </p><br />

                            <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Send
                                <svg aria-hidden="true" class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                        </form>
                    </div>
                </div >
            </section >
        </>
    );
};

export default SendEmailForm;
