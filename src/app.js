const express = require('express');
require('./db/mongoose');
const morganLogger = require('morgan');

const employeeRouter = require('./routers/employee');

// Express App
const app = express();
app.use(morganLogger('dev'))
app.use(express.json());

//Routes
console.log(process.env.npm_package_version)
app.use('/api/v1', employeeRouter);

module.exports = app;