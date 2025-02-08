const express = require('express')
const routes= express()
const userController= require('../controller/userController')
const userValidation = require('../validation/userValidation')
const {isAuthorized} = require('../middleware/authentication')

routes.get('/user',userValidation.getAllUser,isAuthorized(['admin','doctor']),userController.getAllUser)
routes.get('/user/:id',userValidation.getUserById,isAuthorized(['admin','doctor']),userController.getUserById)
routes.delete('/user/:id',userValidation.deleteUserById,isAuthorized(['admin','doctor']),userController.deleteUserById)
routes.put('/user/:id',userValidation.updateUserProfile,isAuthorized(['admin','doctor']),userController.updateUserProfile)
module.exports = routes
