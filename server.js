// npm init <- initialize package.json
// npm i express express-validation bcryptjs config gravatar jsonwebtoken mongoose request 
// npm i -D nodemon concurrently 

const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect Database
connectDB(); 

app.get('/', (req, res) => res.send('API Running'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));