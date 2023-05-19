import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import SessionCheck from '../components/sessionCheck';
import Menu from './dashboard';
import Image from 'next/image';

export default function MyBookDetailsComponent() {
  const [bookDetails, setBookDetails] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [showAddChart, setShowAddChart] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [chartBooks, setChartBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isAddingChart, setIsAddingChart] = useState(false);
  const [count, setCount] = useState(0);
  /**************************************************************************** */
  useEffect(() => {
    const session = sessionStorage.getItem('user');
    if (session) {
      const { id, email } = JSON.parse(session);
      setUser({ id, email });
    }
    /**************************************************************************** */
    async function fetchBooks() {
      try {
        const response = await axios.get('http://localhost:8080/customers/bookdetails');

        setBookDetails(response.data.bookDetails);
      } catch (error) {
        console.log(error);
      }
    }
    fetchBooks();
  }, []);
  /**************************************************************************** */
  async function handleShowReviewsClick(bookId) {
    try {
      const response = await axios.get(`http://localhost:8080/customers/getreview/${bookId}`);

      setReviews(response.data);
      setSelectedBookId(bookId);
      setShowReviews(true);
      setError(null);
    } catch (error) {
      // console.log(error.response.data); // Access error response data
      if (error.response && error.response.data) {
        console.log('statusCode:', error.response.data.statusCode);
        console.log('message:', error.response.data.message);
        setError(error.response.data.message);
      }
    }
    setSelectedBookId(bookId === selectedBookId ? null : bookId);
  }
  /**************************************************************************** */
  async function handleAddChartClick(bookId) {
    try {
      const response = await axios.post(`http://localhost:8080/customers/addChart/${user?.id}/${bookId}`);
      setChartBooks(response.data);
      setSelectedBookId(bookId);
      setShowAddChart(true);
      setError(null);
    } catch (error) {
      console.log(error);
    }
  }

  const handleCountClick = () => {
    setIsAddingChart(true);
    setCount(count + 1);
    //  handleAddChartClick(book.id);
  };
  /**************************************************************************** */
  return (
    <>
      {<SessionCheck />}
      <section class="text-gray-600 body-font details-secton mt-2 ml-2 mr-2 h-screen" style={{ backgroundImage: `url("../images/dashboard.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover' }}>
        <div>
          <Link href="http://localhost:3000/customers/dashboard">
            <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-2 ml-10 ">Back</button>
          </Link>
          {bookDetails.map((book) => (

            <div key={book.id}>
              <section class="text-gray-600 body-font details-section mt-2 ml-2 mr-2 h-screen" style={{ backgroundImage: `url("../images/dashboard.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover' }}>
                <div class="container px-5 py-24 mx-auto">
                  <div class="flex flex-wrap -m-4 justify-center">
                    <div class="p-4 lg:w-1/2">
                      <div class="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative ">
                        <Link href="/" className="flex items-center ml-10">
                          <Image src="/images/cover.jpg" alt="me" width="200" height="200" />
                        </Link>
                        <p>Title : {book.title}</p>
                        <p>Author : {book.author}</p>
                        <p>Pub-Date : {book.publicationDate}</p>
                        <p>Genre : {book.genre}</p>
                        <p>Price : {book.price}</p>
                        <br />
                        <button type="button" class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                          Add Chart Book:
                          <span class="inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                            {count}
                          </span>
                        </button>
                        {'  '}
                        <button onClick={() => handleShowReviewsClick(book.id)} class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                          {selectedBookId === book.id && !isAddingChart ? 'Hide Reviews' : 'Show Reviews'}
                        </button>
                        {'  '}
                        {/* <button onClick={() => { setIsAddingChart(true); handleAddChartClick(book.id); }}>Add Chart</button> */}
                        <button onClick={() => { handleCountClick(); setIsAddingChart(true); handleAddChartClick(book.id); }} class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Add Chart</button>
                        <br />
                        {selectedBookId === book.id && !isAddingChart && ( // Check if reviews are to be shown for this book
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
                          </div>
                        )}
                        <br />

                      </div>
                    </div>
                  </div >
                </div >
              </section >
            </div >
          ))
          }
        </div >
      </section>
    </>
  );
}

