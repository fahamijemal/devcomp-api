const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const bootcamps = require('./routes/bootcamps'); //route files
dotenv.config({ path: './config/config.env' }); //load env vars


//body parser
//create express app
const app = express();

//body parser
app.use(express.json());

//connect to database
connectDB();

// morgan middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));

// Use error handler middleware
app.use(errorHandler);