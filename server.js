//Grabbing App:
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = require('./app.js');

//Using dotenv for env variables:
dotenv.config({
    path: `${__dirname}/config.env`,
});

//Initializing PORT:
const PORT = process.env.PORT || 7467;

//Creating server
const server = require('http').createServer(app);

//Connecting app to MongoDB Atlas via Mongoose:
const connectToDb = mongoose
    .connect(
        process.env.DATABASE.replace(
            '<PASSWORD>',
            process.env.DATABASE_PASSWORD
        ),
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    )
    .then(() => {
        console.log(`Connection to MongoDB Atlas established successfully.`);
    });

//Server Start:
server.listen(PORT, () => {
    console.log(`BarbellBuilder API is online. Listening on port ${PORT}`);
});
