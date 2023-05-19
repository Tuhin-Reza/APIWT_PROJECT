import { Alert } from "flowbite-react";
import { Breadcrumb } from "flowbite-react";
import Link from 'next/link';
import Image from 'next/image'
import { Navbar } from './customers/rap';
import Header from './components/Header';
import Menu from './customers/dashboard';

export default function MyPage() {
    return (
        <>

            <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <caption class="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800">
                        Our products
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
                        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              
                            </th>
                            <td class="px-6 py-4">
                               
                            </td>
                            <td class="px-6 py-4">
                             
                            </td>
                            <td class="px-6 py-4">
                              
                            </td>
                          
                        </tr>
                      
                       
                    </tbody>
                </table>
            </div>


        </>
    );
}