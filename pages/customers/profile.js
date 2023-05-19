import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import SessionCheck from '../components/sessionCheck';

const UpdateUserInfoForm = () => {
    const { register, handleSubmit, formState: { errors }, trigger } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [isEditMode, setIsEditMode] = useState(false); // Add state for edit mode
    const [user, setUser] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    /*---------------------------------------------------*/
    useEffect(() => {
        const session = sessionStorage.getItem('user');
        if (session) {
            const { id, email } = JSON.parse(session);
            setUser({ id, email });
        }

    }, []);
    /*---------------------------------------------------*/
    useEffect(() => {
        if (user) {
            // Fetch user's photo from API
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
    /*---------------------------------------------------*/
    useEffect(() => {
        if (user) {
            const fetchCustomerData = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/customers/getUser/${user.id}`);
                    const data = await response.json();
                    setCustomer(data);
                } catch (error) {
                    console.error('Failed to fetch user information', error);
                }
            };
            fetchCustomerData();
        }
    }, [user]);
    /*---------------------------------------------------*/
    const onSubmit = async (data) => {
        try {
            //console.log("Check:" + user.id);
            // Submit PUT request to update user information
            const response = await fetch(`http://localhost:8080/customers/userUpdateInfo/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data), // Include data in the request body

            });
            if (response.ok) {
                console.log("Check:" + data);
                setCustomer(data);
                setIsEditMode(false);
                //window.location.reload();

            } else {
                // Handle error response
                // ... Update UI or show error message
                setErrorMessage('Failed to update user information');
            }
        } catch (error) {
            setErrorMessage('Failed to update user information');
        }
    }
    /*---------------------------------------------------*/
    const handleFirstNameChange = (event) => {
        // Trigger validation for firstName field
        trigger('firstName');
        // Clear error message for firstName field
        errors.firstName && setErrorMessage('');
    }

    const handleModifyClick = () => {
        setIsEditMode(true); // Set edit mode to true when "Modify" button is clicked
    }
    /*---------------------------------------------------*/
    return (
        <>
            {< SessionCheck />}
            <section class="text-gray-600 body-font details-section mt-2 ml-2 mr-2 h-screen" style={{ backgroundImage: `url("../images/dashboard.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover', height: '710px' }}>
                <div>
                    {<SessionCheck />}
                    <Link href="http://localhost:3000/customers/dashboard">
                        <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-2 ml-10 ">Back</button>
                    </Link>
                    <div class="flex justify-center items-center text-white">
                        <div>
                            <h2 class="text-2xl font-semibold mb-6 ">Profile Picture</h2>
                            {photoUrl ? (
                                <img src={photoUrl} alt="User Profile" />
                            ) : (
                                <div>Loading user photo...</div>
                            )}<br></br>
                            <Link href="http://localhost:3000/customers/updateImage">
                                <button class=" block text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Update Image</button>
                            </Link>
                            <div class="text-center">
                                {customer && (
                                    <>
                                        <h1 class="text-xl font-semibold block text-white text-sm font-bold mb-2">User Information</h1>
                                        <p class="block text-white text-lg font-bold mb-2">ID: {user.id}</p>
                                        <p class="block text-white text-lg font-bold mb-2">First Name: {customer.firstName}</p>
                                        <p class="block text-white text-lg font-bold mb-2">Last Name: {customer.lastName}</p>
                                        <p class="block text-white text-lg font-bold mb-2">Contact: {customer.contact}</p>
                                        <p class="block text-white text-lg font-bold mb-2">Username: {customer.username}</p>
                                        <p class="block text-white text-lg font-bold mb-2">Email: {user.email}</p>
                                        {!isEditMode && (
                                            <button type="button" onClick={handleModifyClick} class="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                                Modify
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {isEditMode && (
                <section class="text-gray-600 body-font details-section mt-2 ml-2 mr-2 h-screen" style={{ backgroundImage: `url("../images/dashboard.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover' }}>
                    <div class="flex justify-center items-center text-white">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h1 class="text-lg font-bold mb-2 mt-20">Update User Information</h1>
                            <div>
                                <label htmlFor="firstName" class="block text-white text-sm font-bold mb-2">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    {...register('firstName', {
                                        required: 'First Name is required',
                                        pattern: {
                                            value: /^[A-Za-z]+$/,
                                            message: 'First Name must only contain letters',
                                        },
                                        minLength: {
                                            value: 3,
                                            message: 'First Name must have at least 3 characters',
                                        },
                                    })}
                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                />
                                {errors.firstName && <p class="text-red-500">{errors.firstName.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="lastName" class="block text-white text-sm font-bold mb-2">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    {...register('lastName', {
                                        required: 'Last Name is required',
                                        pattern: {
                                            value: /^[A-Za-z]+$/,
                                            message: 'Last Name must only contain letters'
                                        },
                                        minLength: {
                                            value: 3,
                                            message: 'Last Name must have at least 3 characters'
                                        }
                                    })}
                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                />
                                {errors.lastName && <p class="text-red-500">{errors.lastName.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="contact" class="block text-white text-sm font-bold mb-2">Contact</label>
                                <input
                                    type="text"
                                    id="contact"
                                    {...register('contact', {
                                        required: 'Contact is required',
                                        pattern: {
                                            value: /^(013|017)\d{8}$/,
                                            message: 'Contact must be in the format of 013 or 017 followed by 8 digits'
                                        }
                                    })}
                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                />
                                {errors.contact && <p class="text-red-500">{errors.contact.message}</p>}
                            </div>
                            <div>
                                <label htmlFor="username" class="block text-white text-sm font-bold mb-2">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    {...register('username', {
                                        required: 'Username is required',
                                        pattern: {
                                            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/,
                                            message: 'Username must contain at least 1 number and 3 letters'
                                        }
                                    })}
                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                />
                                {errors.username && <p class="text-red-500">{errors.username.message}</p>}
                            </div>
                            <br></br>
                            <div>
                                {errorMessage && <p class="text-red-500">{errorMessage}</p>}
                                <button type="submit" class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Update</button>{` | | `}
                                <button type="button" onClick={() => setIsEditMode(false)} class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            )}
            {errorMessage && <p>{errorMessage}</p>}

        </>
    );
};
export default UpdateUserInfoForm;