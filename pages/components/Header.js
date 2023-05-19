import Link from 'next/link';
import Image from 'next/image'

export default function Header() {
    return (
        <header class="text-gray-600 body-font details-secton  mt-2 ml-2" style={{ backgroundImage: `url("../images/header.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover', height: '100%' }}>
            <header class="text-Black-600 body-font colo">
                <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <Link href="/" className="flex items-center">
                        <Image src="/images/logo2.png" alt="me" width="70" height="70" style={{ borderRadius: '50%' }} />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white-400 text-white">  MyBooks</span>
                    </Link>
                    <nav class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                        <Link href="/" class="text-yellow-400 hover:text-white border-b border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">
                            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 text-white text-lg rounded-md group-hover:bg-opacity-0 group-hover:underline">
                                Home
                            </span>
                        </Link>

                        <Link href="/" class="text-yellow-400 hover:text-white border-b border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">
                            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 text-white text-lg rounded-md group-hover:bg-opacity-0 group-hover:underline">
                                About
                            </span>
                        </Link>
                        <Link href="/" class="text-yellow-400 hover:text-white border-b border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">
                            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 text-white text-lg rounded-md group-hover:bg-opacity-0 group-hover:underline">
                                Contact
                            </span>
                        </Link>
                        <Link href="/" class="text-yellow-400 hover:text-white border-b border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900">
                            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 text-white text-lg rounded-md group-hover:bg-opacity-0 group-hover:underline">
                                Library
                            </span>
                        </Link>


                    </nav>

                    <Link href="http://localhost:3000/customers/signin" class="text-white bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2">
                        <span>Sign In</span>
                        <svg aria-hidden="true" class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </Link>
                </div>
            </header>
        </header >

    );
}
