const cors = require('cors')
const express = require('express')
require('express-async-errors')
const app = express()
const mongoose = require('mongoose')

const notesRouter = require('./controllers/note')
const userRouter = require('./controllers/user')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const loginRouter = require('./controllers/login')
const testRouter = require('./controllers/test')

mongoose.set('strictQuery', false)
const MONGODB_URI = process.env.NODE_ENV === 'test'
    ? config.TEST_MONGODB_URI
    : config.MONGODB_URI

logger.info('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
if (process.env.NODE_ENV === 'test') {
    app.use('/api/testing', testRouter)
}
app.use('/api/notes', notesRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app