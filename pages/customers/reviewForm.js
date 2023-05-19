import { useState, useEffect } from 'react';
import Link from 'next/link';
import SessionCheck from '../components/sessionCheck';

const ReviewForm = () => {
    const [user, setUser] = useState(null);
    const [bookList, setBookList] = useState([]);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [rating, setRating] = useState(''); // Default rating value
    const [comment, setComment] = useState('');
    const [ratingError, setRatingError] = useState("");
    const [commentError, setCommentError] = useState("");
    const [submissionMessageRating, setSubmissionMessageRating] = useState("");
    const [submissionMessageComment, setSubmissionMessageComment] = useState("");
    const [isSubmissionComplete, setIsSubmissionComplete] = useState(false);
    /*------------------------------------------------------------------------ */
    useEffect(() => {
        const session = sessionStorage.getItem('user');
        if (session) {
            const { id, email } = JSON.parse(session);
            setUser({ id, email });
        }
    }, []);
    /*------------------------------------------------------------------------ */
    useEffect(() => {
        // Fetch data from API and update bookList state
        const fetchBookList = async () => {
            try {
                if (user && user.id) {
                    const response = await fetch(`http://localhost:8080/customers/reviewOrderhistory/${user.id}`);
                    const data = await response.json();
                    setBookList(data);
                }
            } catch (error) {
                console.error('Error fetching book list:', error);
            }
        };
        fetchBookList();
    }, [user]);
    /*------------------------------------------------------------------------ */
    const handleBookSelect = (e) => {
        const selectedBook = JSON.parse(e.target.value);
        setSelectedBookId(selectedBook.bookId);
        setSelectedOrderId(selectedBook.orderId);
        setIsSubmissionComplete(false);
    };
    /*------------------------------------------------------------------------ */
    const handleRatingChange = (e) => {
        setRating(e.target.value);
    };
    /*------------------------------------------------------------------------ */
    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };
    /*------------------------------------------------------------------------ */
    const handleSubmit = async () => {
        if (rating.trim() === "") {
            setRatingError("Rating is required");
        }

        if (comment.trim() === "") {
            setCommentError("Comment is required");
        } else if (comment.length < 10) {
            setCommentError("Comment must be at least 10 characters long");
        }

        // If all validations pass, submit the form
        if (rating.trim() !== "" && comment.trim() !== "" && comment.length >= 10) {
            try {
                // Send selectedBookId, selectedOrderId, rating, and comment to server for further processing
                const response = await fetch(`http://localhost:8080/customers/createreview/${user.id}/${selectedBookId}/${selectedOrderId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ rating, comment }),
                });

                if (response.ok) {
                    setIsSubmissionComplete(true);
                    console.log('Review submitted successfully');
                } else {
                    console.error('Failed to submit review:', response.statusText);
                }
            } catch (error) {
                console.error('Error submitting review:', error);
            }
            console.log("Form submitted:", { rating, comment });
            setSubmissionMessageRating(`Rating - ${rating}`);
            setSubmissionMessageComment(`Comment - ${comment}`);
        }
    };
    /*------------------------------------------------------------------------ */
    const handleRefresh = () => {
        window.location.reload(); // Refresh the page
    };
    /*------------------------------------------------------------------------ */
    return (
        <>
            {< SessionCheck />}
            <div>
                <Link href="http://localhost:3000/customers/dashboard">
                    <button>Back</button>
                </Link>{` || `}
                <Link href="http://localhost:3000/customers/reviewForm">
                    <button onClick={handleRefresh}>Refresh</button>
                </Link>
                <h1>Review Ordered Book</h1>
                {bookList.length > 0 ? (
                    <div>
                        <label htmlFor="bookSelect">Select Book:</label>
                        <select id="bookSelect" onChange={handleBookSelect}>
                            <option value="">Select a book</option>
                            {bookList.map((book) => (
                                <option key={book.bookId} value={JSON.stringify(book)}>
                                    {book.bookName}
                                </option>
                            ))}
                        </select>
                        {selectedBookId && !isSubmissionComplete && (
                            <div>
                                <label htmlFor="ratingSelect">Rating:</label>
                                <select id="ratingSelect" value={rating} onChange={handleRatingChange}>
                                    <option value="">Select rating</option>
                                    <option value="best">Best</option>
                                    <option value="good">Good</option>
                                    <option value="poor">Poor</option>
                                </select>
                                {ratingError && <p>{ratingError}</p>}<br />
                                {/* <label htmlFor="commentInput">Comment:</label>
                                <input id="commentInput" type="text" value={comment} onChange={handleCommentChange} />
                                {commentError && <p>{commentError}</p>}<br /> */}
                                <label htmlFor="commentTextArea">Comment:</label>
                                <textarea
                                    id="commentTextArea"
                                    value={comment}
                                    onChange={handleCommentChange}
                                    rows={4}
                                    cols={50}
                                />
                                {commentError && <p>{commentError}</p>}
                                <br />
                                <button onClick={handleSubmit}>Submit</button>
                            </div>
                        )}
                        {isSubmissionComplete && (
                            <p>Submission complete. Thank you for your review!</p>
                        )}
                        {submissionMessageRating && <p>{submissionMessageRating}</p>}
                        {submissionMessageComment && <p>{submissionMessageComment}</p>}
                    </div>
                ) : (
                    <p>You haven't bought any books yet.</p>
                )}
            </div>
        </>
    );
};
export default ReviewForm;
