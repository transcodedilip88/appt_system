const express = require('express');
const routes = express.Router();
const authRoutes = require('../routes/authRoutes')
const doctorRoutes = require('../routes/doctorRoutes')
const appointmentRoutes = require('../routes/appointmentRoutes')
const userRoutes = require('../routes/userRoutes')

/* GET home page. */
routes.use('/auth',authRoutes);
routes.use('/',doctorRoutes);
routes.use('/',appointmentRoutes);
routes.use('/',userRoutes)

module.exports = routes;
