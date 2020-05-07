const express = require('express')
const apiRoutes = require('./routes')
const cors = require('cors')
const app = express()

const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(apiRoutes)

app.listen(PORT, () => {
    console.log(`Servidor on, utilizando a porta ${PORT}`)
})



