import React from 'react';
import { useSpring, animated } from 'react-spring';
import { ReactSVG } from 'react-svg';
import DineMatchLogo from '../assets/Orangelogo.svg';
import './Landing.css'

const LoadingScreen = () => {
    const logoStyles = useSpring({
        loop: { reverse: true },
        from: { transform: 'scale(1)' },
        to: { transform: 'scale(1.1)' },
        config: { duration: 1000 }
    });

    const ellipsisStyles = useSpring({
        loop: { reverse: true },
        from: { value: 0 },
        to: { value: 3 },
        config: { duration: 1000 }
    });

    return (
        <div className="loading-container">
            <animated.div style={logoStyles}>
                <ReactSVG src={DineMatchLogo} className="loading-image" />
            </animated.div>
            <h2 className="loading-text">
                Matchmaking in progress 
                <animated.span>
                    {ellipsisStyles.value.to((value) => '....'.substring(0, Math.round(value)))}
                </animated.span>
            </h2>
        </div>
    );
};

export default LoadingScreen;
