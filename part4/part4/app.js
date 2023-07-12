const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

const notesRouter = require('./controllers/note')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

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
app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app