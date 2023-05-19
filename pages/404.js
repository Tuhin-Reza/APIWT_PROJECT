import Link from 'next/link';

export default function Custom404() {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <Link href="http://localhost:3000">
                <button>Back To Home Page</button>
            </Link>
        </div>
    );
}
