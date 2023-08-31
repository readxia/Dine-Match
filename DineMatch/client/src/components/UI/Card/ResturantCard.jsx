import { useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import IconButton from "../Button/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import { useSwipeable } from 'react-swipeable';
import { useSpring, animated } from 'react-spring';
import './ResturantCard.css'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';


import Collapse from '@mui/material/Collapse';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
    })(({ theme, expand }) => ({
        transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));




const ResturantCard = ({ children, extraInfo, business, image, handleFavoriteButton, handleDeleteButton, subheader, otherProps, showInfo, fave, expanded, handleExpandClick }) => {
    
    

    const [props, set] = useSpring(() => ({ 
        x: 0, 
        config: { tension: 280, friction: 60 }
    }));
        

    const swipeHandlers = useSwipeable({
        onSwiping: ({ dir }) => {
            switch (dir) {
                case 'Right':
                    set({ x: 100, opacity: 0 });
                    break;
                case 'Left':
                    set({ x: -100, opacity: 0 });
                    break;
                default:
                    break;
            }
        },
        onSwipedRight: () => {
            handleFavoriteButton(business);
            setTimeout(() => set({ x: 0, opacity: 1 }), 400);  // reset position after successful swipe
        },
        onSwipedLeft: () => {
            handleDeleteButton(business);
            setTimeout(() => set({ x: 0, opacity: 1 }), 400);  // reset position after successful swipe
        },
        onSwiped: () => { 
            set({ x: 0, opacity: 1 });  // reset position if swipe was not far enough to be a right or left swipe
        },
        delta: 30,
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });


    const resetCardPosition = () => {
        set({ x: 0, opacity: 1 });
    };
    
    
    
    return (
        <>
        <animated.div
            className="restaurant-card"
            style={{
                transform: props.x.to((x) => `translateX(${x}px)`),
                opacity: props.opacity,
            }}
            onTouchStart={resetCardPosition}
        >
            <div {...swipeHandlers}>
                <Card sx={{ 
                    width: 350,
                    // height: 500,
                    margin: 2,
                    boxShadow: 10,
                    elevation: 3,
                    position: 'relative',
                }} {...otherProps} >
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                {business.name[0]}
                            </Avatar>
                        }
                        title={business.name}
                        subheader={subheader}
                        
                    />
                    <CardMedia
                        component="img"
                        height="300"
                        image={image}
                        alt="Invalid Image From Yelp"
                    />
                    <CardContent sx={{
                            bottom: 0, 
                            height: '200px',
                        }}>
                        <Typography component="span" variant="body2" color="text.secondary" sx={{fontSize:'1rem'}}>
                        {children}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{
                            position: 'absolute',  
                            bottom: 0, 
                            left: 0,  
                            width: '100%',
                        }}>
                        <Stack spacing={32} direction="row" alignItems="flex-end" >
                        <IconButton onClick={() => handleDeleteButton(business)}>
                            <DeleteIcon />
                        </IconButton>
                        {fave ? '' : <IconButton onClick={() => handleFavoriteButton(business)}>
                        <FavoriteRoundedIcon />
                            </IconButton>}
                        

                        {showInfo && (
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <InfoIcon />
                        </ExpandMore>
                        )}
                        </Stack>
                        
                    </CardActions>
                    {showInfo && (
                        <Collapse in={expanded} timeout="auto" unmountOnExit sx={{height:'auto', marginBottom:'25px', marginTop:'-25px'}}>
                        <CardContent>
                                {extraInfo}
                        </CardContent>
                        </Collapse>
                    )}
                </Card>
            </div>
        </animated.div>
        </>
    );
}

export default ResturantCard;
