require('dotenv').config()
require('./config/database').connect()
const cors = require('cors')
const express = require('express')

const app = express()

app.use(express.json({ limit: '50mb' }))
app.use(cors())

const authRouter = require('./routes/auth')
app.use('/', authRouter)

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

app.options('*', cors())

// This should be the last route else any after it won't work
app.use('*', (req, res) => {
  res.status(404).json({
    success: 'false',
    message: 'Page not found',
    error: {
      statusCode: 404,
      message: 'You reached a route that is not defined on this server',
    },
  })
})

module.exports = app
