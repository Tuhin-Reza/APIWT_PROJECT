import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SessionCheck() {
    const router = useRouter();

    useEffect(() => {
        const session = sessionStorage.getItem('user');
        if (!session) {
            router.push('/customers/signin');
        }
    }, []);

    return null;
}
