import { useEffect, useState } from "react";
import ResturantCard from "../UI/Card/ResturantCard";
import Rating from '@mui/material/Rating'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';



const FavoriteList = () => {

  const baseURL = import.meta.env.VITE_BASE_URL;
  const [favoriteList, setFavoriteList] = useState([]);
  const [info, setInfo] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const route = 'userData';
      const endpoint = `${baseURL}/${route}`;
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // for passing cookies
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      };
      try {
        const response = await fetch(endpoint, options);
        const data = await response.json();
        
        if (response.ok) {
          setFavoriteList(data.favoriteRestaurants); // This is a function that will update the user state with the values of the user's profile.
        } else {
          console.log('Server responded with status code', response.status);
        }
      } catch (error) {
        console.error('Exception occurred during fetch:', error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteButtonFavoritePage = async (id) => {
    const route = 'delete'
    const endpoint = `${baseURL}/${route}/${id}`
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // for passing cookies
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    };
    try {
      const response = await fetch(endpoint, options)
      const data = await response.json()
      if (response.ok) {
        setFavoriteList(data.favoriteRestaurants)
      } else {
        console.log('response was not ok, responded with this status code: ', response.status)
      }
    } catch (error) {
      console.error('Exception occured during delete fetch:', error)
    }
    
}

  const handleInfoReq = async (id) => {
    if (id === expandedId) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
    const route = 'info'
    const endpoint = `${baseURL}/${route}/${id}`
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // for passing cookies
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    };

    try {
      const response = await fetch(endpoint, options);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      } else {
          const data = await response.json();
          console.log(data);
          setInfo([...info, data]);
      }
    } catch (error) {
      console.error('Exception occured during info fetch:', error)
    }
  }

  const formatTime = (timeStr) => {
    // Split the time string into hours and minutes
    let [hours, minutes] = [timeStr.slice(0, 2), timeStr.slice(2)];
  
    // Convert to 12-hour format
    const suffix = hours >= 12 ? 'PM' : 'AM';
    hours = ((hours % 12) || 12).toString();
  
    // Add leading zero to the hours if needed
    if (hours.length < 2) hours = `0${hours}`;
  
    return `${hours}:${minutes} ${suffix}`;
  };

  const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const priceMap = {
    '$': 'Most items under $10',
    '$$': 'Most items $11-$30',
    '$$$': 'Most items $31-$60',
    '$$$$': 'Most items over $61'
  };



  const renderExtraInfo = (id) => {

    const resturantInfo = info.find((item) => item.id === id);

    return (
            <>
          <Typography sx={{fontSize:'2rem', fontFamily:'Galada'}} >More Info!</Typography>
          {resturantInfo && resturantInfo.hours && resturantInfo.hours[0] && (
            <Typography paragraph sx={{fontSize:'1.5rem', }}>
              {resturantInfo.hours[0].is_open_now ? 'Open Now!' : 'Closed'}
              {resturantInfo.hours[0].is_open_now ? <span role="img" aria-label="open">🟢</span> : <span role="img" aria-label="closed">🔴</span>}
            </Typography>
          )}
          {resturantInfo && resturantInfo.hours && resturantInfo.hours[0] && resturantInfo.hours[0].open && resturantInfo.hours[0].open[0] && (
            <Typography paragraph sx={{fontSize:'1.5rem'}}>
              {formatTime(resturantInfo.hours[0].open[0].start)} - {formatTime(resturantInfo.hours[0].open[0].end)}
            </Typography>
          )}
          {resturantInfo && (
            <Typography paragraph sx={{fontSize:'1.5rem'}}>
              {priceMap[resturantInfo.price]}
            </Typography>
          )}
          {resturantInfo && resturantInfo.transactions && resturantInfo.transactions.length > 0 && (
            <Typography component="div" sx={{fontSize:'1.5rem'}}>
              Options:
              {resturantInfo.transactions.map((item) => {
                return (
                  <ul key={item} style={{position: 'relative', top: '-25px'}}>
                    <li>{capitalizeFirstLetter(item)}</li>
                  </ul>
                );
              })}
            </Typography>
            )}
            {resturantInfo && resturantInfo.photos && resturantInfo.photos.length > 0 && (
              <Carousel showArrows={true} showThumbs={false} showStatus={false} selectedItem={0}>
                {resturantInfo.photos.slice(1, 3).map((pic) => {
                  return <img key={pic} src={pic} alt="restaurant" style={{ width: '100%' }} />;
                })}
              </Carousel>
            )}

        </>
    )
}



  return (
    <div>
      <h1 style={{color:'white', textAlign: 'center', fontSize:'2.3rem'}}>Favorites List</h1>

      <>
      <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'flex-start'
        }}>
        {favoriteList.length ? favoriteList.map((business) => {
          return (

            <ResturantCard 
              fave={true}
              key={business.id} 
              business={business} 
              handleDeleteButton={() => handleDeleteButtonFavoritePage(business.id)}
              avatar= {business.name}
              image = {business.image}
              subheader = {business.category[0]}
              showInfo={true}
              extraInfo={renderExtraInfo(business.id)}
              handleExpandClick={() => handleInfoReq(business.id)}
              expanded={business.id === expandedId}

              >
              
              <p>
                <a href={`https://maps.google.com/maps?q=${encodeURIComponent(business.address.join(' '))}`} target="_blank">
                  {business.address.join(', ')}
                </a>
              </p>
              <Rating name="read-only" value={business.rating} readOnly />
              <p><a href={`tel:${business.phone}`}>{business.phone}</a></p>
      
            </ResturantCard>
          );
        }) : <h2>Your Favorites List is Empty! :(</h2>}
        </Box>
      </>

    </div>
  )
}

export default FavoriteList;

