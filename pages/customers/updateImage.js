import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import SessionCheck from '../components/sessionCheck';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);
    /*-----------------------------------------------------*/
    useEffect(() => {
        // Retrieve user information from session storage
        const session = sessionStorage.getItem('user');
        if (session) {
            const { id, email } = JSON.parse(session);
            setUser({ id, email });
        }
    }, []);
    /*-----------------------------------------------------*/
    useEffect(() => {
        if (user) {
            const fetchUserPhoto = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/customers/getUserPhotos/${user.id}`);
                    if (response.ok) {
                        const fileBlob = await response.blob();
                        const url = URL.createObjectURL(fileBlob);
                        setPhotoUrl(url);
                    } else {
                        console.error('Failed to fetch user photo');
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            fetchUserPhoto();
        }
    }, [user]);
    /*-----------------------------------------------------*/
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            const maxSize = 3000000;//3mb

            if (allowedFileTypes.includes(file.type) && file.size <= maxSize) {
                setSelectedFile(file);
                setError(null); // Reset error state
            } else {
                setError('Invalid file type or file size exceeds the maximum limit of 16KB.');
                setSelectedFile(null); // Reset selected file state
            }
        }
    };
    /*-----------------------------------------------------*/
    const handleUpload = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await fetch(`http://localhost:8080/customers/image/${user.id}`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const fileBlob = await response.blob();
                    const url = URL.createObjectURL(fileBlob);
                    setPhotoUrl(url);
                    setSelectedFile(null);

                    // Auto-refresh page after successful image upload
                    window.location.reload();
                } else {
                    console.error('Failed to upload user photo');
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            setError('Please select a file to upload.');
        }
    };
    /*-----------------------------------------------------*/
    return (
        <>
            {< SessionCheck />}
            <section class="text-gray-600 body-font details-section mt-2 ml-2 mr-2 h-screen" style={{ backgroundImage: `url("../images/dashboard.jpg")`, backgroundRepeat: "no-repeat", backgroundSize: 'cover' }}>
                <div>
                    <Link href="http://localhost:3000/customers/dashboard">
                        <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 mt-2 ml-10 ">Back</button>
                    </Link>
                    <h2 class="block text-white text-lg font-bold mb-2">Update Image</h2><br />
                    {photoUrl ? (
                        <img src={photoUrl} alt="User Profile" class="ml-2" />
                    ) : (
                        <div>Loading user photo...</div>
                    )}
                    <div>
                        <input type="file" onChange={handleFileChange} class="text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400 dark:focus:ring-yellow-900 ml-2" />
                        <button onClick={handleUpload} class="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Update Image</button>
                        {error && <div class="text-red-500">{error}</div>} {/* Display error message if error exists */}
                    </div>

                </div>
            </section>
        </>
    );
};
export default UserProfile;
