import React from 'react';
import { useSpring, animated } from 'react-spring';
import { ReactSVG } from 'react-svg';
import { Link } from 'react-router-dom';
import DineMatchLogo from '../assets/YellowLogo.svg';
import Button from './UI/Button/Button';

const Landing = () => {
    const logoAnimation = useSpring({
        from: { opacity: 0, transform: 'scale(0.5)' },
        to: { opacity: 1, transform: 'scale(1)' },
        config: { tension: 200, friction: 20 },
        delay: 500,
    });

    const titleAnimation = useSpring({
        from: { opacity: 0, transform: 'scale(0.5)' },
        to: { opacity: 1, transform: 'scale(1.3)' },
        config: { tension: 200, friction: 20 },
        delay: 800,
    });

    const buttonsAnimation = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { tension: 200, friction: 20 },
        delay: 1100,
    });

    return (
        <>
        <div className="landingBG">
            <div className="landing">
            <animated.div style={logoAnimation} className="landingLogo">
                <ReactSVG src={DineMatchLogo}  alt="DineMatch Logo" className='svg' />
            </animated.div>
            <animated.h1 style={titleAnimation}>DineMatch</animated.h1>
            <animated.div style={buttonsAnimation} className="landingButtons">
                <Link to="/Login">
                <Button>Login</Button>
                </Link>
                <Link to="/SignUp">
                <Button>Sign Up</Button>
                </Link>
            </animated.div>
            </div>
        </div>
        <div className="contentWrapper">
            <div className="contentItem">
            <iframe src="https://www.google.com/maps/d/embed?mid=1CVJ8RdXABkGwnft5aZdZXQYgcL2BAhM&ehbc=2E312F" width="100%" height="480"></iframe>
            </div>
            <div className="contentItem">
            <p>Welcome to DineMatch!</p>
            <p>We created this website with the intention of helping people discover restaurants in their area. All you have to do is choose your location, type of cuisine, and price range.</p>
            <p>We hope you find a perfect match!</p>
            </div>
        </div>
        </>
    );
}

export default Landing;

