const express = require('express')
const userRoutes = require('./userRoutes')
const postRoutes = require('./postRoutes')

const routes = express()

routes.use(userRoutes)
routes.use(postRoutes)

module.exports = routes