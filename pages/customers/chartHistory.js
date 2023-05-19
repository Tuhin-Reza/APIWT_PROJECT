import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SessionCheck from '../components/sessionCheck';
import Image from 'next/image';

export default function ChartBooksComponents() {
    const [chartBooks, setChartBooks] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0); // Added state for total price

    useEffect(() => {
        const session = sessionStorage.getItem('user');
        if (session) {
            const { id, email } = JSON.parse(session);
            setUser({ id, email });
        }
    }, []);

    useEffect(() => {
        if (user) {
            const fetchChartBooks = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/customers/getChartBooks/${user.id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setChartBooks(data);
                    } else {
                        setError('No chart books found');
                    }
                } catch (error) {
                    console.error('Error fetching chart books:', error);
                    setError('No chart books found');
                }
            };

            fetchChartBooks();
        }
    }, [user]);

    useEffect(() => {
        // Calculate total price whenever chartBooks state changes
        let totalPrice = 0;
        chartBooks.forEach(book => {
            totalPrice += book.bookDetails.price;
        });
        setTotalPrice(totalPrice);
    }, [chartBooks]);

    const handleRemoveChartBook = async (bookId) => {
        try {
            const response = await fetch(`http://localhost:8080/customers/removeChart/${user.id}/${bookId}`, { method: 'DELETE' });
            if (response.ok) {
                // Update chart books state after successful removal
                setChartBooks(chartBooks.filter(book => book.id !== bookId));
            } else {
                setError('Error removing chart book');
            }
        } catch (error) {
            console.error('Error removing chart book:', error);
            setError('Error removing chart book');
        }
    };

    if (error) {
        <Link href="http://localhost:3000/customers/dashboard">
            <button>Back</button>
        </Link>
        // return <div>{error}</div>;

    }

    return (
        <>
            {<SessionCheck />}
            <div>
                <section class="text-gray-600 body-font details-section mt-2 ml-2 mr-2 h-screen" style={{ backgroundImage: `url("../images/dashboard.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover', height: '1000px' }}>
                    <Link href="http://localhost:3000/customers/dashboard">
                        <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-2 ml-10 ">Back</button>
                    </Link>
                    <div class="container px-5 py-24 mx-auto">
                        <div class="flex flex-wrap -m-4 justify-center">
                            <div class="p-4 lg:w-1/2">
                                <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative ">
                                    <button class="border-b-2 border-blue-500">Chart Books</button><br></br><br></br>

                                    {chartBooks.length > 0 ? (
                                        <Link href="http://localhost:3000/customers/orderConfirm" class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                            <button>Order Confirm</button>
                                        </Link>
                                    ) : (
                                        <button disabled>Order Confirm</button>
                                    )}
                                    {`  `}
                                    {chartBooks.length > 0 ? (

                                        <div>
                                            <br />
                                            <button type="button" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                Total Price:
                                                <span class="inline-flex items-center justify-center w-10 h-10 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                                                    ${totalPrice.toFixed()}
                                                </span>
                                            </button>
                                            <br />
                                            {chartBooks.map(book => (
                                                <div key={book.id}>
                                                    <p>Title: {book.bookDetails.title}</p>
                                                    <p>Author: {book.bookDetails.author}</p>
                                                    <p>Publication Date: {book.bookDetails.publicationDate}</p>
                                                    <p>Genre: {book.bookDetails.genre}</p>
                                                    <p>Price: ${book.bookDetails.price.toFixed(2)}</p> {/* Display book price */}
                                                    <button onClick={() => handleRemoveChartBook(book.id)} class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Remove</button>
                                                    <br /><br />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (

                                        <div>No chart books found</div>
                                    )}

                                </div>
                            </div>
                        </div >
                    </div >
                </section >
            </div>
        </>
    );
};
