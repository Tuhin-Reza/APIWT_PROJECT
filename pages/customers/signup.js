import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image'

const SignupForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contact, setContact] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const [account, setAccount] = useState('');

    const validateForm = () => {
        let formErrors = {};
        const nameRegex = /^[A-Za-z]+$/;
        const contactRegex = /^(013|017)\d{8}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

        if (firstName === '') {
            formErrors.firstName = 'First Name is required.';
        } else if (!nameRegex.test(firstName)) {
            formErrors.firstName = 'First Name should only contain letters.';
        } else if (firstName.length < 3) {
            formErrors.firstName = 'First Name should be at least 3 characters long.';
        }

        if (lastName === '') {
            formErrors.lastName = 'Last Name is required.';
        } else if (!nameRegex.test(lastName)) {
            formErrors.lastName = 'Last Name should only contain letters.';
        } else if (lastName.length < 3) {
            formErrors.lastName = 'Last Name should be at least 3 characters long.';
        }

        if (contact === '') {
            formErrors.contact = 'Contact is required.';
        } else if (!contactRegex.test(contact)) {
            formErrors.contact = 'Contact must be in the format of 013 or 017 followed by 8 digits.';
        }

        if (email === '') {
            formErrors.email = 'Email is required.';
        } else if (!emailRegex.test(email)) {
            formErrors.email = 'Email should be in a valid format.';
        } else if (!email.endsWith('@gmail.com')) {
            formErrors.email = 'Email should be a valid Gmail address.';
        }

        if (username === '') {
            formErrors.username = 'Username is required.';
        } else if (!usernameRegex.test(username)) {
            formErrors.username = 'Username must contain at least 1 number and 3 letters.';
        } else if (!/\d/.test(username)) {
            formErrors.username = 'Username should contain at least one number.';
        } else if (username.length < 4) {
            formErrors.username = 'Username should be at least 4 characters long.';
        }


        if (password === '') {
            formErrors.password = 'Password is required.';
        } else if (!passwordRegex.test(password)) {
            formErrors.password =
                'Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
        }

        if (confirmPassword === '') {
            formErrors.confirmPassword = 'Confirm Password is required.';
        } else if (confirmPassword !== password) {
            formErrors.confirmPassword = 'Confirm Password does not match.';
        }

        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validateForm();
        if (isValid) {
            // Perform form submission
            fetch('http://localhost:8080/customers/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    contact,
                    email,
                    username,
                    password
                })
            })
                .then(response => {
                    console.log(response.status);
                    if (response.ok) {
                        console.log('Form submitted successfully');
                        router.push('http://localhost:3000/customers/signin');

                    } else {
                        console.log('Form submission failed1');
                        if (response.status === 409) {
                            setAccount("use unique email");
                        }

                    }
                })
                .catch(error => {
                    console.log('Form submission failed1');
                    // Handle error
                });
        }
    };

    React.useEffect(() => {
        window.history.pushState(null, null, window.location.href);
        window.addEventListener('popstate', function (event) {
            window.history.pushState(null, null, window.location.href);
        });
    }, []);

    return (
        <div>
            <section class="text-gray-600 body-font details-secton mt-2 ml-2 mr-2 h-screen" style={{ backgroundImage: `url("../images/signBG.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover' }}>
                <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <Link href="/" className="flex items-center">
                        <Image src="/images/logo2.png" alt="me" width="50" height="0" style={{ borderRadius: '50%' }} />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">MyBooks</span>
                    </Link>
                    <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create and Account
                            </h1>
                            <form onSubmit={handleSubmit}>
                                <div class="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
                                    <div class="w-full">
                                        <label htmlFor="firstName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name:</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="First Name"
                                        />
                                        <p class="text-xs text-red-500 dark:text-red">{errors.firstName && <span>{errors.firstName}</span>}</p>
                                    </div>
                                    <div class="w-full">
                                        <label htmlFor="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name:</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Last Name"
                                        />
                                        <p class="text-xs text-red-500 dark:text-red">{errors.lastName && <span>{errors.lastName}</span>}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="contact" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact:</label>
                                        <input
                                            type="text"
                                            id="contact"
                                            value={contact}
                                            onChange={(e) => setContact(e.target.value)}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="xxx-xxxxxxxx"
                                        />
                                        <p class="text-xs text-red-500 dark:text-red"> {errors.contact && <span>{errors.contact}</span>}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username:</label>
                                        <input
                                            type="text"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="user name"
                                        />
                                        <p class="text-xs text-red-500 dark:text-red"> {errors.username && <span>{errors.username}</span>}</p>
                                    </div>

                                    <div class="sm:col-span-2">
                                        <label htmlFor="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com"
                                        />
                                        <p class="text-xs text-red-500 dark:text-red"> {errors.email && <span>{errors.email}</span>}</p>
                                        <p class="text-xs text-red-500 dark:text-red">{account && <span>{account}</span>}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password:</label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        />
                                        <p class="text-xs text-red-500 dark:text-red">  {errors.password && <span>{errors.password}</span>}</p>
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password:</label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        />
                                        <p class="text-xs text-red-500 dark:text-red"> {errors.confirmPassword && <span>{errors.confirmPassword}</span>}</p>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <button type="submit" class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                            SignUp
                                        </span>
                                    </button>
                                    <p>
                                        Have an account?{' '}
                                        <Link href="http://localhost:3000/customers/signin" class="ml-auto text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                                            <span>Signin</span>
                                        </Link>{` || `}
                                        <Link href="/" class="ml-auto text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                                            <span>Home</span>
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );

};
export default SignupForm;
