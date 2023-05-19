import { useState, useEffect } from 'react';
import SessionCheck from '../components/sessionCheck';
import axios from 'axios';
import Link from 'next/link';

export default function BooksByGenre() {
    const [genre, setGenre] = useState('');
    const [books, setBooks] = useState([]);

    const [bookDetails, setBookDetails] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [showReviews, setShowReviews] = useState(false);
    const [showAddChart, setShowAddChart] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [chartBooks, setChartBooks] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const session = sessionStorage.getItem('user');
        if (session) {
            const { id, email } = JSON.parse(session);
            setUser({ id, email });
        }
        async function fetchBooks() {
            const response = await fetch(`http://localhost:8080/customers/serchbookByGenre?genre=${genre}`);
            const books = await response.json();
            setBooks(books);
        }
        fetchBooks();

    }, [genre]);


    async function handleShowReviewsClick(bookId) {
        try {
            const response = await axios.get(`http://localhost:8080/customers/getreview/${bookId}`);
            if (response.statusCode === 409) {
                console.log("not found");
            }
            setReviews(response.data);
            setSelectedBookId(bookId);
            setShowReviews(true);
            setError(null);
        } catch (error) {
            if (error.response && error.response.data) {
                console.log('statusCode:', error.response.data.statusCode);
                console.log('message:', error.response.data.message);
                setError(error.response.data.message);
            }
        }
    }

    async function handleAddChartClick(bookId) {
        try {
            const response = await axios.post(`http://localhost:8080/customers/addChart/${user?.id}/${bookId}`);
            if (response.statusCode === 409) {
                console.log("not found");
            }
            setChartBooks(response.data);
            setSelectedBookId(bookId);
            setShowAddChart(true);
            setError(null);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            {< SessionCheck />}
            <div>
                <Link href="http://localhost:3000/customers/dashboard">
                    <button>Back</button>
                </Link>
                <h1>Books by Genre</h1>
                <label htmlFor="genre-select">Select Genre:</label>
                <select id="genre-select" value={genre} onChange={(event) => setGenre(event.target.value)}>
                    <option value="">Select Genre</option>
                    <option value="comedy">Comedy</option>
                    <option value="drama">Drama</option>
                    <option value="crime">Crime</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="horror">Horror</option>
                </select>
                {books.length > 0 ? (
                    <ul>
                        {books.map(book => (
                            <li key={book.id}>
                                <br></br>
                                <p>Book ID: {book.id}</p>
                                <p>Title: {book.title}</p>
                                <p>Author: {book.author}</p>
                                <p>publication Date: {book.publicationDate}</p>
                                <p>Genre : {book.genre}</p>
                                <p>Price : {book.price}</p>
                                <br></br>
                                <br />
                                <button onClick={() => handleShowReviewsClick(book.id)}>Show Reviews</button>{` || `}
                                <button onClick={() => handleAddChartClick(book.id)}>Add Chart</button>
                                <br />
                                {showReviews && selectedBookId === book.id && ( // Check if reviews are to be shown for this book
                                    <div>
                                        <h1>Reviews for Book {book.title} :</h1>
                                        {error && <p>{error}</p>} {/* Display error message */}
                                        <ul>
                                            {reviews.map((review) => (
                                                <li key={review.id}>
                                                    <p>Customer Name : {review.userName}</p>
                                                    <p>Rating : {review.rating}</p>
                                                    <p>Comment : {review.comment}</p><br />
                                                </li>

                                            ))}
                                        </ul>
                                        <button onClick={() => setShowReviews(false)}>Hide Reviews</button> {/* Add Hide Reviews button */}
                                    </div>
                                )}
                                <br />
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No books found.</p>
                )}

            </div>
        </>);
}


