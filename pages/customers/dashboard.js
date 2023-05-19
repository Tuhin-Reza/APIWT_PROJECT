import Link from 'next/link';
import SessionCheck from '../components/sessionCheck';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Image from 'next/image';
import BookBlock from '../components/bookBlock';
import check from './rap';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const router = useRouter();
    /*------------------------------------------------------------------*/
    useEffect(() => {
        const session = sessionStorage.getItem('user');
        if (session) {
            const { id, email, username } = JSON.parse(session);
            setUser({ id, email, username });
        }
    }, []);
    /*------------------------------------------------------------------*/
    useEffect(() => {
        if (user) {
            const fetchUserPhoto = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/customers/getUserPhotos/${user.id}`);
                    if (response.ok) {
                        const fileBlob = await response.blob();
                        const url = URL.createObjectURL(fileBlob);
                        setPhotoUrl(url);
                    } else {
                        console.error('Failed to fetch user photo');
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            fetchUserPhoto();
        }
    }, [user]);
    /*------------------------------------------------------------------*/
    const handleClick = () => {
        window.location.href = "http://localhost:3000/customers/updateImage";
    };
    /*------------------------------------------------------------------*/
    const handleSignOut = async () => {
        try {
            const response = await axios.get('http://localhost:8080/customers/logout');
            console.log(response.data);
            sessionStorage.removeItem('user');
            setUser(null);
            // Redirect to sign-in page after sign-out
            router.push('/customers/signin');
        } catch (error) {
            console.error(error);
        }
    };
    /*------------------------------------------------------------------*/
    return (
        <>
            {<SessionCheck />}
            <section class="text-gray-600 body-font details-secton mt-2 ml-2" style={{ backgroundImage: `url("../images/dashboard.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover' }}>
                <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div class="text-gray-600 body-font details-secton h-full mt-2 ml-2 mr-2" style={{ backgroundImage: `url("../images/header.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover', height: '100%' }}>
                        <div class="flex items-center justify-between">
                            <Link href="#" className="flex items-center">
                                <Image src="/images/logo2.png" alt="me" width="50" height="50" style={{ borderRadius: '50%' }} />
                                <span className="self-center text-2xl font-semibold whitespace-nowrap text-white"> MyBooks</span>
                            </Link>

                            <div class="flex items-center md:order-2 mr-5">
                                <button type="button" class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600  mr-5" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                                    <span class="sr-only">Open user menu</span>
                                    {photoUrl ? (
                                        <img src={photoUrl} alt="User Profile" style={{ cursor: 'pointer' }} className="w-12 h-12 rounded-full" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-500  mr-5" />
                                    )}
                                </button>

                                <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" id="user-dropdown">
                                    <div class="px-4 py-3">
                                        <span class="block text-sm text-gray-900 dark:text-white"> <p>{user?.username}</p></span>
                                        <span class="block text-sm  text-gray-500 truncate dark:text-gray-400"><p>{user?.email}</p></span>
                                    </div>
                                    <ul class="py-2" aria-labelledby="user-menu-button mr-2">
                                        <li>
                                            <a href="http://localhost:3000/customers/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Profile</a>
                                        </li>
                                        <li>
                                            <a href="http://localhost:3000/customers/updateImage" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit Profile Picture</a>
                                        </li>
                                        <li>
                                            <a href="http://localhost:3000/customers/changePassword" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Update Password</a>
                                        </li>
                                        <li>
                                            <a href="/sign-out" onClick={(e) => {
                                                e.preventDefault();
                                                handleSignOut();
                                            }} class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign Out</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
                                <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                                    <li>
                                        <a href="http://localhost:3000/customers/profile" class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Welcome To MyBooks,{user?.username}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
                <BookBlock />
                <aside id="logo-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                    <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                        <ul class="space-y-2 font-medium">
                            <li>
                                <a href="http://localhost:3000/customers/bookDetails" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg aria-hidden="true" class="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                                    <span class="ml-3">Book Details</span>
                                </a>
                            </li>
                            <li>
                                <a href="http://localhost:3000/customers/searchByGenre" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                                    <span class="flex-1 ml-3 whitespace-nowrap">Search Book By Genre</span>
                                </a>
                            </li>
                            <li>
                                <a href="http://localhost:3000/customers/chartHistory" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path><path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path></svg>
                                    <span class="flex-1 ml-3 whitespace-nowrap">Chart History</span>
                                </a>
                            </li>
                            <li>
                                <a href="http://localhost:3000/customers/orderHistory" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                                    <span class="flex-1 ml-3 whitespace-nowrap">Order History</span>
                                </a>
                            </li>
                            <li>
                                <a href="http://localhost:3000/customers/reviewForm" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd"></path></svg>
                                    <span class="flex-1 ml-3 whitespace-nowrap">Review Form</span>
                                </a>
                            </li>
                            <li>
                                <a href="http://localhost:3000/customers/complainBox" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <svg aria-hidden="true" class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path></svg>
                                    <span class="flex-1 ml-3 whitespace-nowrap">Complain Box</span>
                                </a>
                            </li>
                           
                        </ul>
                    </div>
                </aside>
            </section>

        </>
    );
}
