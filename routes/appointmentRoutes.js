const express = require("express");
const routes = express()
const appointmentController = require('../controller/appointmentController')
const appointmentValidation = require('../validation/appointmentValidation')
const isAuthorized = require('../middleware/authentication')

routes.post('/appointments',appointmentValidation.bookAppointment,isAuthorized.verifyToken,appointmentController.bookAppointment)
routes.get('/appointments',appointmentValidation.getAllAppointments,isAuthorized.verifyToken,appointmentController.getAllAppointments)
routes.get('/appointments/:id',appointmentValidation.getAppointmentById,isAuthorized.verifyToken,appointmentController.getAppointmentById)
routes.patch('/appointments/:id',appointmentValidation.updateAppointment,isAuthorized.verifyToken,appointmentController.updateAppointment)
routes.delete('/appointments/:id',appointmentValidation.deleteAppointment,isAuthorized.verifyToken,appointmentController.deleteAppointment)

module.exports = routes