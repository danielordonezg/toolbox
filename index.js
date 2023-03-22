const express = require('express')
const app = express()
const port = 7001
const cors = require('cors')
const morgan = require('morgan')
const routes = require('./src/routes/index')

app.use(cors())
app.use(morgan('dev'))
app.use('/', routes)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    }
)