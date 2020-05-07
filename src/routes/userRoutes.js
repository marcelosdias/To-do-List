const express = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/auth')
const routes = express.Router()

routes
    .post('/register', userController.register)
    .post('/login', userController.login)

    .put('/user/', authMiddleware.auth, userController.update)
    .delete('/user/:id', authMiddleware.auth, userController.delete)

module.exports = routes