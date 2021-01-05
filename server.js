//Grabbing App:
const app = require('./app.js');

//Initializing PORT:
const PORT = 7467;

//Creating server
const server = require('http').createServer(app);

//Server Start:
server.listen(PORT, () => {
    console.log(`BarbellBuilder API is online. Listening on port ${PORT}`);
});
