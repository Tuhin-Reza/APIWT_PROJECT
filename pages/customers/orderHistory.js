import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SessionCheck from '../components/sessionCheck';

export default function OrderHistory() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const session = sessionStorage.getItem('user');
        if (session) {
            const { id, email } = JSON.parse(session);
            setUser({ id, email });
        }
    }, []);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                if (user) {
                    const response = await axios.get(`http://localhost:8080/customers/orderHistory/${user.id}`);
                    console.log('Order history response:', response.data);
                    setOrders(response.data);
                }
            } catch (error) {
                console.error('Error getting order history:', error);
            }
        };

        fetchOrderHistory();
    }, [user]);

    return (
        <>
            {<SessionCheck />}
            <section class="text-gray-600 body-font details-secton mt-2 ml-2" style={{ backgroundImage: `url("../images/dashboard.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover' }}>
                <div>
                    <Link href="http://localhost:3000/customers/dashboard">
                        <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-2 ml-10">Back</button>
                    </Link>
                    <div class="relative overflow-x-auto shadow-md sm:rounded-lg ml-5 mr-5">
                        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                                Order History
                                <p class="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">Browse a list of Flowbite products designed to help you work and play, stay organized, get answers, keep in touch, grow your business, and more.</p>
                            </caption>
                            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" class="px-6 py-3">
                                        Book Name
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Price
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Order Time
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Order ID
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <tr key={order.orderId} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {order.bookName}
                                            </td>
                                            <td class="px-6 py-4">
                                                {order.price}
                                            </td>
                                            <td class="px-6 py-4">
                                                {order.orderTime}
                                            </td>
                                            <td class="px-6 py-4">
                                                {order.orderId}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td class="px-6 py-4" colspan="4">
                                            History not found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
}
