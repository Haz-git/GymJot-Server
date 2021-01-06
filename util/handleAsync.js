//Preventing the need of a try/catch block with every request handler.
//The .catch portion catches any errors that tosses it to the error handler.

module.exports = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
