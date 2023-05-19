import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import OrderConfirmationPage from './OrderConfirmationPage';
import SessionCheck from '../components/sessionCheck';


export default function AddressComponent() {
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState(null);
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [streetError, setStreetError] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');
    const [countryError, setCountryError] = useState('');
    const router = useRouter();

    const [userEmail, setUserEmail] = useState('');
    const [totalBookCount, setTotalBookCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderTime, setOrderTime] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showModifyForm, setShowModifyForm] = useState(false);

    /*------------------------------------------------------------------------*/
    useEffect(() => {
        const session = sessionStorage.getItem('user');
        if (session) {
            const { id, email } = JSON.parse(session);
            setUser({ id, email });
        }
    }, []);
    /*------------------------------------------------------------------------*/
    useEffect(() => {
        if (user) {
            const fetchAddress = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/customers/getAddress/${user.id}`);
                    if (response.data) {
                        setAddress(response.data);
                        setStreet(response.data.street);
                        setCity(response.data.city);
                        setState(response.data.state);
                        setCountry(response.data.country);
                    }
                } catch (error) {
                    console.error('Error fetching address:', error);
                }
            };
            fetchAddress();
        }
    }, [user]);
    /*------------------------------------------------------------------------*/
    const handleOrderConfirmation = async () => {
        try {
            const response = await axios.post(`http://localhost:8080/customers/orderConfirmation/${user.id}`);
            console.log('Order confirmation response:', response.data);
            if (response.data.message === 'Order created successfully') {
                const { userName, totalBookCount, totalPrice, orderTime } = response.data.order;
                // Update the state with the data from the response
                setUserEmail(userName);
                setTotalBookCount(totalBookCount);
                setTotalPrice(totalPrice);
                setOrderTime(orderTime);
                setShowConfirmation(true);
                //window.history.replaceState(null, null, window.location.href);
            }
        } catch (error) {
            console.error('Error getting order confirmation:', error);
        }
    };

    if (showConfirmation) {
        // Render the OrderConfirmationPage with the data as props
        return (
            <OrderConfirmationPage
                userEmail={userEmail}
                totalBookCount={totalBookCount}
                totalPrice={totalPrice}
                orderTime={orderTime}
            />
        );
    };
    /*------------------------------------------------------------------------*/
    const handleModifyAddress = async (event) => {
        event.preventDefault(); // Prevent page refresh
        const isValid = validateForm();

        if (!isValid) {
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8080/customers/createAddress/${user.id}`, {
                street,
                city,
                state,
                country
            });

            if (response.data) {
                console.log('Address updated successfully:', response.data);
                setAddress(response.data);
                setShowModifyForm(false);
            }
        } catch (error) {
            console.error('Error updating address:', error);
        }
    };
    /*------------------------------------------------------------------------*/
    const handleCreateAddress = async (event) => {
        event.preventDefault(); // Prevent page refresh

        const isValid = validateForm();

        if (!isValid) {
            return;
        }
        try {
            const response = await axios.post(`http://localhost:8080/customers/createAddress/${user.id}`, {
                street,
                city,
                state,
                country
            });

            if (response.data) {
                console.log('Address updated successfully:', response.data);
                setAddress(response.data);
                setShowModifyForm(false);
            }
        } catch (error) {
            console.error('Error updating address:', error);
        }
        //window.location.reload();
    };
    /*------------------------------------------------------------------------*/
    const handleShowModifyForm = () => {
        setShowModifyForm(true);
    };
    const handleHideModifyForm = () => {
        setShowModifyForm(false);
    };
    const validateForm = () => {
        let isValid = true;

        if (street.trim() === '') {
            setStreetError('Street is required');
            isValid = false;
        } else if (street.length < 3) {
            setStreetError('Street must be at least 3 characters long');
            isValid = false;
        } else {
            setStreetError('');
        }

        if (city.trim() === '') {
            setCityError('City is required');
            isValid = false;
        } else if (city.length < 3) {
            setCityError('City must be at least 3 characters long');
            isValid = false;
        } else {
            setCityError('');
        }

        if (state.trim() === '') {
            setStateError('State is required');
            isValid = false;
        } else if (state.length < 3) {
            setStateError('State must be at least 2 characters long');
            isValid = false;
        } else {
            setStateError('');
        }

        if (country.trim() === '') {
            setCountryError('Country is required');
            isValid = false;
        } else if (country.length < 3) {
            setCountryError('Country must be at least 3 characters long');
            isValid = false;
        } else {
            setCountryError('');
        }

        return isValid;
    };
    /*------------------------------------------------------------------------*/
    return (
        <div>
            {<SessionCheck />}
            <section class="text-gray-600 body-font details-section mt-2 ml-2 mr-2 h-screen" style={{ backgroundImage: `url("../images/dashboard.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover', height: '1000px' }}>
                <Link href="http://localhost:3000/customers/dashboard">
                    <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-2 ml-10 ">Back</button>
                </Link>
                {' '}
                <Link href="http://localhost:3000/customers/dashboard">
                    <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-2 ml-10 ">Chart History</button>
                </Link>
                {address ? (
                    <div>
                        <div class="flex justify-center items-center bg-gray-200 p-4 rounded-full w-60 h-48 ml-50 mr-50 mb-2">
                            <div class="text-center">
                                <h1 class="text-black text-lg font-bold mb-4">Address Details</h1>
                                <p class="text-black ml-2 mr-2 mb-2">Street: {address.street}</p>
                                <p class="text-black ml-2 mr-2 mb-2">City: {address.city}</p>
                                <p class="text-black ml-2 mr-2 mb-2">State: {address.state}</p>
                                <p class="text-black ml-2 mr-2 mb-2">Country: {address.country}</p>
                            </div>
                        </div>



                        {/*------------------------------------------------------------------------*/}
                        {showModifyForm ? (
                            <div>
                                <div class="flex justify-center items-center min-h-screen bg-black-100">
                                    <div class="max-w-md w-full mx-auto p-8 bg-transparent rounded-lg shadow-md">
                                        <h2 class="text-2xl font-semibold text-white mb-6">Modify Address</h2>
                                        <form onSubmit={handleModifyAddress}>
                                            <label class="block text-white text-sm font-bold mb-2">
                                                Street
                                                <input
                                                    type="text"
                                                    value={street}
                                                    onChange={(e) => {
                                                        setStreet(e.target.value);
                                                        if (streetError) {
                                                            setStreetError('');
                                                        }
                                                    }}
                                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                                />
                                            </label>
                                            {streetError && <p class="text-red-500">{streetError}</p>}
                                            <br />
                                            <label class="block text-white text-sm font-bold mb-2">
                                                City
                                                <input
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => {
                                                        setCity(e.target.value);
                                                        if (cityError) {
                                                            setCityError('');
                                                        }
                                                    }}
                                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                                />
                                            </label>
                                            {cityError && <p class="text-red-500">{cityError}</p>}
                                            <br />
                                            <label class="block text-white text-sm font-bold mb-2">
                                                State
                                                <input
                                                    type="text"
                                                    value={state}
                                                    onChange={(e) => {
                                                        setState(e.target.value);
                                                        if (stateError) {
                                                            setStateError('');
                                                        }
                                                    }}
                                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                                />
                                            </label>
                                            {stateError && <p class="text-red-500">{stateError}</p>}
                                            <br />
                                            <label class="block text-white text-sm font-bold mb-2">
                                                Country
                                                <input
                                                    type="text"
                                                    value={country}
                                                    onChange={(e) => {
                                                        setCountry(e.target.value);
                                                        if (countryError) {
                                                            setCountryError('');
                                                        }
                                                    }}
                                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                                />
                                            </label>
                                            {countryError && <p class="text-red-500">{countryError}</p>}
                                            <br />
                                            <button onClick={handleModifyAddress} class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Update Address</button>{` || `}
                                            <button onClick={handleHideModifyForm} class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Cancel</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <button onClick={handleShowModifyForm} class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Modify Address</button>{` || `}
                                <button onClick={handleOrderConfirmation} class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Confirm Order</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h1 class="text-red-500">No Address Found</h1>
                        {/*------------------------------------------------------------------------*/}
                        {showModifyForm ? (
                            <div>
                                <div class="flex justify-center items-center min-h-screen bg-black-100">
                                    <div class="max-w-md w-full mx-auto p-8 bg-transparent rounded-lg shadow-md">
                                        <h2 class="text-2xl font-semibold text-white mb-6">Create Address</h2>
                                        <form onSubmit={handleModifyAddress}>
                                            <label class="block text-white text-sm font-bold mb-2">
                                                Street
                                                <input
                                                    type="text"
                                                    value={street}
                                                    onChange={(e) => {
                                                        setStreet(e.target.value);
                                                        if (streetError) {
                                                            setStreetError('');
                                                        }
                                                    }}
                                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                                />
                                            </label>
                                            {streetError && <p class="text-red-500">{streetError}</p>}
                                            <br />
                                            <label class="block text-white text-sm font-bold mb-2">
                                                City
                                                <input
                                                    type="text"
                                                    value={city}
                                                    onChange={(e) => {
                                                        setCity(e.target.value);
                                                        if (cityError) {
                                                            setCityError('');
                                                        }
                                                    }}
                                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                                />
                                            </label>
                                            {cityError && <p class="text-red-500">{cityError}</p>}
                                            <br />
                                            <label class="block text-white text-sm font-bold mb-2">
                                                State
                                                <input
                                                    type="text"
                                                    value={state}
                                                    onChange={(e) => {
                                                        setState(e.target.value);
                                                        if (stateError) {
                                                            setStateError('');
                                                        }
                                                    }}
                                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                                                />
                                            </label>
                                            {stateError && <p class="text-red-500">{stateError}</p>}
                                            <br />
                                            <label class="block text-white text-sm font-bold mb-2">
                                                Country
                                                <input
                                                    type="text"
                                                    value={country}
                                                    onChange={(e) => {
                                                        setCountry(e.target.value);
                                                        if (countryError) {
                                                            setCountryError('');
                                                        }
                                                    }}
                                                    class="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500" s
                                                />
                                            </label>
                                            {countryError && <p class="text-red-500">{countryError}</p>}
                                            <br />
                                            <button onClick={handleCreateAddress} class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Create Address</button>{` || `}
                                            <button onClick={handleHideModifyForm} class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Cancel</button>{` || `}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <button onClick={handleShowModifyForm} class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Create Address</button>
                            </div>
                        )}

                    </div>
                )
                }
                {/*------------------------------------------------------------------------*/}
            </section >
        </div >
    );
}