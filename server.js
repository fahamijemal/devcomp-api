const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps'); //route files

dotenv.config({path: './config/config.env'}); //load env vars

const app =express();
//mount routers
app.use('/api/v1/bootcamps', bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));