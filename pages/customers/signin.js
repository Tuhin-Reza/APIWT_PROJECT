import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import axios from 'axios';


export default function signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [WrongPass, setWrongPass] = useState('');
    const [WrongEmail, setWrongEmail] = useState('');
    const [responseData, setResponseData] = useState(null);
    const [User, setUser] = useState(null);
    const router = useRouter();
    const [emailError, setEmailError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/customers/login', {
                email,
                password,
            });
            console.log('res: ' + response.data.username);
            setResponseData(response.data);
            if (response.data) {
                if (response.data === 'provide correct email') {
                    setWrongEmail(response.data)
                    //console.log('checked: ' + response.data);
                }
                else if (response.data === 'provide correct password') {
                    setWrongPass(response.data)
                    //console.log('checked: ' + response.data);
                }
                else {
                    sessionStorage.setItem(
                        'user',
                        JSON.stringify({ id: response.data.id, email: response.data.email, username: response.data.username })
                    );
                    setUser({ id: response.data.id, email: response.data.email, username: response.data.username }); // Update user state with retrieved user data
                    router.push('/customers/dashboard');

                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Invalid email & password');
        }
    };
    const validateEmail = () => {
        const isValid = email.includes('@');
        setEmailError(isValid ? '' : 'Email must contain "@" symbol');
    };
    return (
        <>
            <section class="text-gray-600 body-font details-secton mt-2 ml-2 mr-2 h-screen" style={{ backgroundImage: `url("../images/signBG.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover' }}>
                <Head>
                    <title>Sign In</title>
                </Head>

                <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16 ">
                    <div class="flex flex-col justify-center">
                        <h1 class="mb-4 text-4xl font-extrabold tracking-tight leading-none  text-white md:text-5xl lg:text-6xl dark:text-white-400">Welcome to MyBooks Online Book Store  !</h1>
                        <p class="mb-6 text-lg font-normal text-white lg:text-xl dark:text-white-400">Please sign in to access your account and explore our vast collection of books.</p>

                        <a href="http://localhost:3000/" class="text-blue-600 dark:text-blue-500 hover:underline font-medium text-lg inline-flex items-center">Back To Home
                            <svg aria-hidden="true" class="w-4 h-4 ml-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria2-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                        </a>
                    </div>
                    <div >
                        <div class="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800">
                            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                                Sign in to Online Book Store
                            </h2>
                            <form class="mt-8 space-y-6" onSubmit={handleSubmit}>
                                <div class="mb-6">
                                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Email:
                                        <input type="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            onBlur={validateEmail}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com.com" />
                                    </label>
                                    <p class="mt-2 text-sm text-red-600 dark:text-red-500"><span class="font-medium"> </span>{emailError && <p>{emailError}</p>}</p>
                                    <p class="mt-2 text-sm text-red-600 dark:text-red-500"><span class="font-medium"> </span>{WrongEmail && <p>{WrongEmail}</p>}</p>
                                </div>

                                <div class="mb-6">
                                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                        Password:
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="••••••••"
                                        />
                                    </label>
                                    <p class="mt-2 text-sm text-red-600 dark:text-red-500"><span class="font-medium"> </span> {WrongPass && <p>{WrongPass}</p>}</p>
                                </div>
                                <div class="mt-2 text-sm text-red-600 dark:text-red-500"><span class="font-medium">{!WrongPass && !WrongEmail && <p>{error}</p>}</span></div>

                                <div class="flex items-start">
                                    <div class="flex items-center h-5">

                                    </div>
                                    <Link href="/customers/forgetPassword" class="ml-auto text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                                        <span>Lost Password</span>
                                    </Link>
                                </div>
                                <button type="submit" class="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800  outline outline-2  outline-offset-2 outline-cyan-500">Login to your account</button>
                                <div class="text-sm font-medium text-gray-900 dark:text-white">
                                    Not registered yet? <Link href="/customers/signup" class="text-blue-600 hover:underline dark:text-blue-500">
                                        <span>Create account</span>
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
}



