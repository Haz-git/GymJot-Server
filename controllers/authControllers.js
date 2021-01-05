exports.testController = (req, res, next) => {
    res.status(200).json({
        status: 'Success',
        message: 'The server has been successfully initialized!',
    });
};
