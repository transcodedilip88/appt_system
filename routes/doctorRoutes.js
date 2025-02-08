const express = require('express')
const routes = express()
const doctorController = require('../controller/doctorController')
const doctorValidation = require('../validation/doctorValidation')
const {isAuthorized} = require('../middleware/authentication')

routes.post('/doctors',doctorValidation.addDoctor,isAuthorized(['admin']),doctorController.addDoctor)
routes.get('/doctors',doctorValidation.getAllDoctor,isAuthorized(['admin']),doctorController.getAllDoctor)
routes.get('/doctors/:id',doctorValidation.getDoctorById,isAuthorized(['admin']),doctorController.getDoctorById)
routes.patch('/doctors/:id',doctorValidation.updateDoctorById,isAuthorized(['admin']),doctorController.updateDoctorById)
routes.delete('/doctors/:id',doctorValidation.deleteDoctorById,isAuthorized(['admin']),doctorController.deleteDoctorById)

module.exports = routes