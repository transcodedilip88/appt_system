const express = require("express");
const routes = express()
const appointmentController = require('../controller/appointmentController')
const appointmentValidation = require('../validation/appointmentValidation')
const {isAuthorized} = require('../middleware/authentication')

routes.post('/appointments',appointmentValidation.bookAppointment,isAuthorized(['admin','patinet']),appointmentController.bookAppointment)
routes.get('/appointments',appointmentValidation.getAllAppointments,isAuthorized(['admin','patinet']),appointmentController.getAllAppointments)
routes.get('/appointments/:id',appointmentValidation.getAppointmentById,isAuthorized(['admin','patinet']),appointmentController.getAppointmentById)
routes.patch('/appointments/:id',appointmentValidation.updateAppointment,isAuthorized(['admin','patinet']),appointmentController.updateAppointment)
routes.delete('/appointments/:id',appointmentValidation.deleteAppointment,isAuthorized(['admin','patinet']),appointmentController.deleteAppointment)

module.exports = routes