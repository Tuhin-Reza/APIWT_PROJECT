import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Session() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const session = sessionStorage.getItem('user');
        if (session) {
            setUser(JSON.parse(session));
        }
    }, []);

    const handleSignOut = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.get('http://localhost:8080/customers/logout');
            console.log(response.data);
            sessionStorage.removeItem('user');
            setUser(null);
            router.push('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Link href="/customers/signin">Sign in</Link>
        </>
    );
}