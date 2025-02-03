const express = require('express')
const routes= express()
const userController= require('../controller/userController')
const userValidation = require('../validation/userValidation')
const isAuthorized = require('../middleware/authentication')

routes.get('/user',userValidation.getAllUser,isAuthorized.verifyToken,userController.getAllUser)
routes.get('/user/:id',userValidation.getUserById,isAuthorized.verifyToken,userController.getUserById)
routes.delete('/user/:id',userValidation.deleteUserById,isAuthorized.verifyToken,userController.deleteUserById)
routes.put('/user/:id',userValidation.updateUserProfile,isAuthorized.verifyToken,userController.updateUserProfile)
module.exports = routes
