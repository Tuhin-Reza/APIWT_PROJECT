import React from 'react';
import Link from 'next/link';
import SessionCheck from '../components/sessionCheck';

const OrderConfirmationPage = ({ userEmail, totalBookCount, totalPrice, orderTime }) => {
    return (
        <>  {<SessionCheck />}
            <div>
                <h1>Order Confirmation</h1>
                <p>
                    User Email: {userEmail}<br />
                    Total Book Count: {totalBookCount}<br />
                    Total Price: {totalPrice}<br />
                    Order Time: {orderTime}
                </p>
                <Link href="http://localhost:3000/customers/dashboard">
                    <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-2 ml-10 ">Back</button>
                </Link>
            </div>
        </>
    );
};

export default OrderConfirmationPage;
