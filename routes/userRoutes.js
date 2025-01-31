const express = require('express')
const routes= express()
const userController= require('../controller/userController')
const userValidation = require('../validation/userValidation')

routes.get('/user',userValidation.getAllUser,userController.getAllUser)
routes.get('/user/:id',userValidation.getUserById,userController.getUserById)
routes.delete('/user/:id',userValidation.deleteUserById,userController.deleteUserById)
routes.put('/user/:id',userValidation.updateUserProfile,userController.updateUserProfile)
module.exports = routes
