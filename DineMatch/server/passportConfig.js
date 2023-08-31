const { userModel } = require('./models/userModel');
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
    passport.use(
        new localStrategy(async (username, password, done) => {
            try {
            const user = await userModel.findOne({ username: username });
            if (!user) return done(null, false);

            console.log(user);
    
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result === true) {
                return done(null, user);
                } else {
                return done(null, false);
                }
            });
            } catch (err) {
            done(err);
            }
        })
        );
    
        passport.serializeUser((user, cb) => {
        cb(null, user.id);
        });
    
        passport.deserializeUser(async (id, cb) => {
            try {
                const user = await userModel.findOne({ _id: id });
                const userInformation = {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstname,
                    lastName: user.lastname,
                    city: user.city,
                    state: user.state,
                    zip: user.zip,
                    priceRange: user.priceRange,
                    selectedOptions: user.selectedOptions
                };
                cb(null, userInformation);
            } catch (err) {
                cb(err);
            }
        });
        
};
