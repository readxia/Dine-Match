import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css'
import Landing from './components/Landing'
import LoginForm from './components/Forms/LoginForm'
import TasteProfileForm from './components/Forms/TasteProfileForm'
import SignUpForm from './components/Forms/SignUpForm';
import Discover from './components/Discover';
import NavBar from './components/Navigation/Navbar'
import FavoriteList from './components/List/FavoriteList';
import Profile from './components/UI/Profile';
import Footer from './components/UI/Footer';

const Content = () => {

  console.log('Content rendered');

  const location = useLocation(); // this is a hook that will give us access to the current path of the app so we can hide the navbar on certain pages

  // these are the paths that we want the navbar to show up on
  const navbarPaths = ['/tasteprofile', '/discover', '/favorites', '/profile' ];

  // if the current path is not in the navbarPaths array, then don't show the navbar
  const showNavBar = navbarPaths.includes(location.pathname.toLowerCase());

  return (
    <>
      {showNavBar && <NavBar />} {/* This is a ternary operator that will show the navbar if the current path is in the navbarPaths array. */}
    
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/Login" element={<LoginForm />} />
          <Route path="/SignUp" element={<SignUpForm />} />
          <Route path="/TasteProfile" element={<TasteProfileForm />} />
          <Route path="/Discover" element={<Discover />} />
          <Route path="/Favorites" element={<FavoriteList />} />
          <Route path="/Profile" element={<Profile />} />
          {/* MORE ROUTES WILL BE ADDED */}
        </Routes>
    
    </>
  )
}

const App = () => {

  return (
    <>
      <Router>
        <Content /> {/* This is where we are rendering the content of the app -- we have to wrap it like this insead of all together so we can use the useLocation hook */}
        <Footer />
      </Router>
    </>
  )}

export default App
