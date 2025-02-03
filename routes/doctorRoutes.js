const express = require('express')
const routes = express()
const doctorController = require('../controller/doctorController')
const doctorValidation = require('../validation/doctorValidation')
const isAuthorized = require('../middleware/authentication')

routes.post('/doctors',doctorValidation.addDoctor,isAuthorized.verifyToken,doctorController.addDoctor)
routes.get('/doctors',doctorValidation.getAllDoctor,isAuthorized.verifyToken,doctorController.getAllDoctor)
routes.get('/doctors/:id',doctorValidation.getDoctorById,isAuthorized.verifyToken,doctorController.getDoctorById)
routes.patch('/doctors/:id',doctorValidation.updateDoctorById,isAuthorized.verifyToken,doctorController.updateDoctorById)
routes.delete('/doctors/:id',doctorValidation.deleteDoctorById,isAuthorized.verifyToken,doctorController.deleteDoctorById)

module.exports = routes