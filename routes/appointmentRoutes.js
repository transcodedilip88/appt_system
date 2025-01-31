const express = require("express");
const routes = express()
const appointmentController = require('../controller/appointmentController')
const appointmentValidation = require('../validation/appointmentValidation')
const isAuthorized = require('../middleware/authentication')

routes.post('/appointments',isAuthorized.verifyToken,appointmentValidation.bookAppointment,appointmentController.bookAppointment)
routes.get('/appointments',isAuthorized.verifyToken,appointmentValidation.getAllAppointments,appointmentController.getAllAppointments)
routes.get('/appointments/:id',appointmentValidation.getAppointmentById,appointmentController.getAppointmentById)
routes.patch('/appointments/:id',appointmentValidation.updateAppointment,appointmentController.updateAppointment)
routes.delete('/appointments/:id',appointmentValidation.deleteAppointment,appointmentController.deleteAppointment)

module.exports = routes