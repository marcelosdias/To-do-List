const express = require('express')
const userController = require('../controllers/userController')
const routes = express.Router()

routes
    .post('/register', userController.register)
    .post('/login', userController.login)
    .put('/user/:id', userController.update)
    .delete('/user/:id', userController.delete)

module.exports = routes