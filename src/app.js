const express = require('express')
const apiRoutes = require('./routes')
const app = express()

const PORT = process.env.PORT || 8000

app.use(express.json())
app.use(apiRoutes)

app.listen(PORT, () => {
    console.log(`Servidor on, utilizando a porta ${PORT}`)
})



