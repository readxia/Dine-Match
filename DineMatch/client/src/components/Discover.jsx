import React, { useState, useEffect } from 'react';
import ResturantCard from "./UI/Card/ResturantCard";
import AlertSnackbar from './Forms/AlertSnackbar';
import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box'
import Button from './UI/Button/Button';
import LoadingScreen from '../components/LoadingScreen';
import { a } from 'react-spring';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';


const Discover = () => {

    const [businesses, setBusinesses] = useState([]);
    const baseURL = import.meta.env.VITE_BASE_URL;
    const [favoriteStatus, setFavoriteStatus] = useState({})
    const [successMessage, setSuccessMessage] = useState('');
    const [nextPage, setNextPage] = useState(0);

    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        console.log('Api fetch initiated');
        setIsLoading(true)

        const fetchData = async () => {
            const yelpEndpoint = `${baseURL}/discover`;
            const userEndpoint = `${baseURL}/userData`;

            const yelpOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                cache: 'no-cache', 
            };

            const userOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                cache: 'no-cache', 
            };

            try {
                const yelpResponse = await fetch(yelpEndpoint, yelpOptions);
                const yelpData = await yelpResponse.json();
            
                const userResponse = await fetch(userEndpoint, userOptions);
                const userData = await userResponse.json();

                if (yelpResponse.ok && userResponse.ok) {
                    setBusinesses(yelpData.businesses);
                
                    const userFavoriteRestaurants = userData.favoriteRestaurants || []; 

                    const favoriteStatus = {}; 
                    userFavoriteRestaurants.forEach(restaurant => {
                        favoriteStatus[restaurant.id] = true;
                    });
                    
                    setFavoriteStatus(favoriteStatus);

                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1500);

                } else {
                    console.log('Error: Server responded with status code', yelpResponse.status, userResponse.status);
                }
            } catch (error) {
                console.error('Exception occurred during fetch:', error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [nextPage]);

    if (isLoading) {
        return <LoadingScreen />;  // Render loading screen when data is being fetched
    }

    const handleFavoriteButton = async (business) => {
        if (favoriteStatus[business.id]) {
            setSuccessMessage('')
            setTimeout(() => {
                setSuccessMessage('Already in Favorites!');
            }, 1);
            return;
        }
        const resturantID = business.id;
        const resturantName = business.name;
        const resturantImage = business.image_url;
        const resturantRating = business.rating;
        // const resturantAddress = business.location.display_address[0];
        const resturantAddress = business.location.display_address;
        const resturantPhone = business.display_phone;
        const resturantURL = business.url;
        // const resturantCategory = business.categories[0].title;
        const resturantCategory = business.categories.map(category => category.title)

        const route = 'addFavorite';
        const endpoint = `${baseURL}/${route}`;
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            cache: 'no-cache',
            body: JSON.stringify({
                resturantID,
                resturantName,
                resturantImage,
                resturantRating,
                resturantAddress,
                resturantPhone,
                resturantURL,
                resturantCategory,
            }),
        };
        const response = await fetch(endpoint, options);

        if (response.ok) {
            console.log('Successfully updated user data');
            setFavoriteStatus({
                ...favoriteStatus,
                [business.id]: true,
            });
            setSuccessMessage('')
            setTimeout(() => {
                setSuccessMessage('Successfully added to favorites!');
            }, 1);
            setBusinesses(businesses.filter(item => item.id !== business.id));


        } else {
            console.log('Server responded with status code', response.status);
            setSuccessMessage('')
            setTimeout(() => {
                setSuccessMessage('Already in Favorites!');
            }, 1);
        }
    }

    const handleDeleteButton = (business) => {
        setBusinesses(businesses.filter(item => item.id !== business.id))
    }

    const handleNewApiCall = async () => {
        setSuccessMessage(''); 
        setNextPage(prevPage => prevPage + 1);

    }


    return (
        <>
            {/* <AlertSnackbar successMessage={successMessage} /> */}
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'flex-start'
        }}>
        
            {businesses.map((business) => 
                <ResturantCard 
                    key={business.id} 
                    business={business} 
                    handleDeleteButton={handleDeleteButton}
                    handleFavoriteButton={handleFavoriteButton} 
                    avatar= {business.name.charAt(0)}
                    image = {business.image_url}
                    subheader = {business.categories[0].title}
                    icon={<FavoriteRoundedIcon/>}
                    showInfo={false}
                >
                    
                    <p>
                        <a href={`https://maps.google.com/maps?q=${encodeURIComponent(business.location.display_address.join(' '))}`} target="_blank">
                            {business.location.display_address.join(', ')}
                        </a>
                    </p>

                    <Rating name="read-only" value={business.rating} readOnly />
                    <p><a href={`tel:${business.display_phone}`}>{business.display_phone}</a></p>
                </ResturantCard>
            )}
        </Box>
        <Box sx={{
            display:'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 2,
        }}>
            <Button 
                onClick={handleNewApiCall} 
                sx={{ 
                    backgroundColor: '#FF6616',
                    borderRadius: '20px',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: 'darkorange', 
                    },
                    '&:active': {
                    backgroundColor: 'red',
                    },
                    width : '300px',
                }}
            >
                Discover More
            </Button>
        </Box>
        </>
    );
}


export default Discover;
