//Dependencies:
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('mongoose').model('User');
const dotenv = require('dotenv');

//Initializing dotenv:
dotenv.config({
    path: `${__dirname}/../../config.env`,
});

//Assigning options to Passport:
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    algorithms: ['HS256'],
};

//This function will run on every route that we use the passport.authenticate() middleware. Passport uses jsonwebtoken's verify method.

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(options, function (jwt_payload, done) {
            //If code is at this point, the JWT is validated.
            //Assigning 'sub' property on JWT to database ID of user.

            User.findOne({ _id: jwt_payload.id }, function (err, user) {
                if (err) {
                    return done(err, false);
                }

                if (user) {
                    //Both JWT and User is valid at this point.
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        })
    );
};
