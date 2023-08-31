require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const logger = require('morgan');
const passport = require('passport'); 
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const router = express.Router();
const validator = require('validator');
const $fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;
require('./passportConfig')(passport); // this is the passport configuration file 
require('./connections/mongoConnection')
const { userModel } = require('./models/userModel');
const { BEARER, SESSION_SECRET } = process.env; 
//----------------------------------------- END OF IMPORTS---------------------------------------------------

// Middleware

//body parser - we MUST use these for POST and PUT requests so we can access the req.body object. We can use Postman to test POST and PUT requests.
app.use(express.json()); // this allows us to access the req.body object
app.use(express.urlencoded({ extended: true })); // this allows us to access the req.body object

app.use(express.static('dist'));


app.use(cors({ // this allows us to make requests from our react app to our express server
        origin: 'http://localhost:5173', // this is the port of the react app
        credentials: true // this allows us to send cookies from our server to the client
    }));

app.use(logger('dev')); // this logs requests to the console - we can see incoming requests in the terminal

app.use(session({ // this allows us to use sessions with express
    secret: SESSION_SECRET,
    resave: false, // don't resave the session if nothing has changed
    saveUninitialized: true, // always create a session, even if we haven't stored anything in it
    cookie: { secure: false, maxAge:86400000, httpOnly: true }, // keep this as false while testing locally, but change to true when deploying to production
}));

app.use(cookieParser(SESSION_SECRET)); // this allows us to use cookies with express
app.use(passport.initialize()); // this starts up passport
app.use(passport.session());  // this starts up the passport session

app.use('/', router)

const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Not authenticated' });
}

//----------------------------------------- END OF MIDDLEWARE---------------------------------------------------
// ROUTES

// HOME ROUTE. We need this so the logout routes work properly
app.get('/', (req, res) => {
    res.send('This is the homepage.');
});


// LOGIN ROUTE

app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user) => {
        if (err) throw err;
        if (!user) res.status(400).json({ error: "No user exists" });
        else {
            req.logIn(user, (err) => {
            if (err) throw err;
            res.status(200).json({ success: `Logged in as ${user.username}` });
            });
        }
    })(req, res, next);
});


// LOGOUT ROUTE 
app.get('/logout', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
}, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return;
        }
        res.redirect('/');
    });
});





// TO GET A USER FROM THE DB 
app.get('/userData', async (req, res) => {
    // console.log('Session: ', req.session);
    // console.log('User: ', req.user);
    if (req.user) { // If the user is authenticated, req.user will exist
        try {
            const user = await userModel.findById(req.user._id); // Get user data from the database
            // console.log(user); // Log user data
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    } else { // If the user is not authenticated, req.user will be undefined
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// YELP CONNECTION
app.get('/discover', isLoggedIn, async (req, res) => {
    
    const city= req.user.city; 
    const state = req.user.state;
    const zip = req.user.zip;
    const location = `${city}, ${state} ${zip}`;
    const selectedOptions = req.user.selectedOptions.toString(); 
    const priceRange = req.user.priceRange;
    const offsetNumber = Math.floor(Math.random() * 150); // This will give us a random number between 0 and 150. We can use this to offset the results we get back from the API so we get different results each time.


    //NOTE: I changed it to distance and added Zip code to the location variable so we get more accurate results. We can change this I was just playing around with it.- Zoe

    //TODO: We get 50 results back from the API per call. What happens if a user swipes through all 50? Can we get back 50 more results that are different from the first 50? - Zoe

    const yelpUrl = `https://api.yelp.com/v3/businesses/search?location=${location}&term=restaurants&categories=${selectedOptions}&price=${priceRange}&limit=5&sort_by=best_match&offset=${offsetNumber}`;
    const endpoint = yelpUrl
    
    try {
        const response = await $fetch(endpoint, {
            headers: {
            Authorization: `Bearer ${BEARER}`, //Yelp API Key
            },
        });

        if (!response.ok) {
            throw new Error('Yelp API request failed');
        }
        console.log('SuccessfulTrigger')
        const data = await response.json();
        res.json(data);
    } catch (err) {
        return res.status(500).json({ message: 'Error retrieving Yelp data' });
    }   
});

//YELP CONNECTION FOR FAVORITES
app.get('/info/:id', isLoggedIn, async (req, res) => {
    const restaurantId = req.params.id;

    console.log(restaurantId)
    const endpoint = `https://api.yelp.com/v3/businesses/${restaurantId}`;
    console.log(endpoint)
    
    try {
        const response = await $fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${BEARER}`, //Yelp API Key
            },
        });

        if (!response.ok) {
            throw new Error('Yelp API request failed');
        }

        const data = await response.json();
        res.json(data);
    } catch (err) {
        return res.status(500).json({ message: 'Error retrieving Yelp data' });
    }   
});


// TO SAVE A NEW USER TO THE DB
const validatePassword = (password) => {
    // Password should be at least 8 characters long, contain at least one uppercase letter,
    // one lowercase letter, one number and one special character
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/;
    
    if (!validator.matches(password, passwordRegex)) {
        throw new Error('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character');
    }
    
    if (!validator.isLength(password, { min: 8 })) {
        throw new Error('Password must be at least 8 characters long');
    }
}
app.post('/userData', async (req, res) => {

    // Extracting fields from the request body
    const { firstname, lastname, username, password, email, city, state, zip } = req.body; // Add other fields as needed
    
    try {
        validatePassword(password);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }

    // Hashing the password
    bcrypt.hash(password, saltRounds, async function(err, hashedPassword) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Unable to hash password" });
        } else {
            // Creating a new user with the hashed password
            const newUser = new userModel({
                firstname,
                lastname,
                username,
                password: hashedPassword,
                email,
                city,
                state,
                zip
            });

            try {
                // Saving the new user
                const savedUser = await newUser.save();
                // Log in the new user
                req.login(savedUser, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ message: "Unable to login",  error: err.toString() });
                    }
                    // If there are no errors, send the saved user data as response
                    return res.json(savedUser);
                });
            } catch (error) {
                console.error(error);
                if (error.code === 11000 && error.keyPattern.username) {
                  // Duplicate username error
                    res.status(400).json({ message: "Username already in use", error: "Username already in use"});
                } else if (error.code === 11000 && error.keyPattern.email) {
                  // Duplicate email error
                    res.status(400).json({ message: "Email already in use", error: "Email already in use" });
                } else {
                    res.status(500).json({ message: "Unable to save user", error: error.toString() });
                }
            }
        }
    });
});


// TO UPDATE USER DATA IN THE DB
app.put('/updateUserData', isLoggedIn, async (req, res) => {
    if (req.user) { // If the user is authenticated, req.user will exist
        try {
            const user = await userModel.findById(req.user._id); // Get user data from the database
    
            // If the user is found in the database
            if (user) {
            // Update the fields
            user.firstname = req.body.firstname || user.firstname;
            user.lastname = req.body.lastname || user.lastname;
            user.city = req.body.city || user.city;
            user.state = req.body.state || user.state;
            user.zip = req.body.zip || user.zip;
            user.priceRange = req.body.priceRange ?? user.priceRange; // If the request body does not contain a priceRange field, use the existing priceRange value 
            user.selectedOptions = req.body.selectedOptions ?? user.selectedOptions; // If the request body does not contain a selectedOptions field, use the existing selectedOptions value 
            user.username = req.body.username || user.username;
            
            //Check if the username has changed
            if (req.body.username && req.body.username !== user.username) {
                // Check if the new username is already taken
                const existingUser = await userModel.findOne({ username: req.body.username });
                if (existingUser) {
                    return res.status(400).json({ error: 'Username already in use' });
                } else {
                    user.username = req.body.username;
                }
            }

            if(req.body.email && req.body.email !== user.email){
                // Check if the new email is already taken
                const existingUser = await userModel.findOne({ email: req.body.email });
                if (existingUser) {
                    return res.status(400).json({ error: 'Email already in use' });
                } else {
                    user.email = req.body.email;
                }
            }

            if(req.body.password){
                // Hash the new password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            // Save the updated user
            const updatedUser = await user.save();
            res.json(updatedUser);
            } else {
            res.status(404).json({ message: 'User not found' });
            }

        } catch (err) {
            if (err.code === 11000) { // Error code for duplicate key in MongoDB
                res.status(500).json({ error: 'Username already in use' });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
        } else { // If the user is not authenticated, req.user will be undefined
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// ADD A RESTAURANT TO FAVORITES 
app.post('/addFavorite', async (req, res) => {
    if (req.user) {
        try {
            const user = await userModel.findById(req.user._id);
            if (user) {
                const { 
                    resturantID: restaurantId, 
                    resturantName: restaurantName, 
                    resturantImage: restaurantImage, 
                    resturantRating: restaurantRating, 
                    resturantAddress: restaurantAddress, 
                    resturantPhone: restaurantPhone, 
                    resturantURL: restaurantUrl,
                    resturantCategory: restaurantCategory
                } = req.body;
                    // Check if the restaurant is already in the favoriteRestaurants array
                    const alreadyFavorite = user.favoriteRestaurants.some(restaurant => restaurant.id === restaurantId);

                    if (alreadyFavorite) {
                        res.status(409).json({ message: 'Restaurant is already in favorites' });
                    } else {
                        user.favoriteRestaurants.push({
                            id: restaurantId, 
                            name: restaurantName, 
                            image: restaurantImage, 
                            url: restaurantUrl, 
                            rating: restaurantRating, 
                            phone: restaurantPhone, 
                            address: restaurantAddress,
                            category: restaurantCategory
                        });

                        // Save the updated user
                        const updatedUser = await user.save();
                        res.json(updatedUser);
                    }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            console.error('Failed to add favorite:', err); // Log the error for debugging
            res.status(500).json({ message: 'Failed to add favorite', error: err.message });
        }
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// DELETE A RESTAURANT FROM FAVORITES LIST
app.delete('/delete/:id', async (req, res) => {
    if (req.user) {
        try {
            // finds the user by the user id
            const user = await userModel.findById(req.user._id);
            if (user) {
                // console.log(user.favoriteRestaurants)

                // deletes the restaurant by id from params
                let updatedFavorites = user.favoriteRestaurants.filter((restaurant) => {
                    if (restaurant.id !== req.params.id) {
                        return restaurant
                    }
                })

                user.favoriteRestaurants = updatedFavorites

                const updatedUser = await user.save()
                res.json(updatedUser)
                console.log('Favorited restaurant deleted successfully')
                // user.favoriteRestaurants.findByIdAndDelete(req.params.id)


            } else {
                res.status(404).json({ message: 'User not found when trying to delete data' });
            }
        } catch (err) {
            console.error('Failed to delete from favorites list:', err); // Log the error for debugging
            res.status(500).json({ message: 'Failed to delete restaurant from favorites list', error: err.message });
        }
    } else {
        res.status(401).json({ message: 'Not authenticated when trying to delete data' });
    }
});


//----------------------------------------- END OF ROUTES---------------------------------------------------

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})


