const express = require('express')
const postController = require('../controllers/postController')
const authMiddleware = require('../middlewares/auth')
const routes = express.Router()

routes
    .get('/post', authMiddleware.auth, postController.index)
    .post('/post', authMiddleware.auth, postController.create)
    .put('/post/:id', authMiddleware.auth, postController.update)
    .delete('/post/:id', authMiddleware.auth, postController.delete)

module.exports = routes