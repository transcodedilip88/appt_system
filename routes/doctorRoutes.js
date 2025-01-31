const express = require('express')
const routes = express()
const doctorController = require('../controller/doctorController')
const doctorValidation = require('../validation/doctorValidation')
const isAuthorized = require('../middleware/authentication')

routes.post('/doctor',doctorValidation.addDoctor,doctorController.addDoctor)
routes.get('/doctors',doctorValidation.getAllDoctor,doctorController.getAllDoctor)
routes.get('/doctors/:id',doctorValidation.getDoctorById,doctorController.getDoctorById)
routes.patch('/doctors/:id',isAuthorized.verifyToken,doctorValidation.updateDoctorById,doctorController.updateDoctorById)
routes.delete('/doctors/:id',isAuthorized.verifyToken,doctorValidation.deleteDoctorById,doctorController.deleteDoctorById)

module.exports = routes