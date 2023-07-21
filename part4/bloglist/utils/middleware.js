const jwt = require('jsonwebtoken')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        request.token = authorization.replace('Bearer ', '')
    }

    next()
}

const userExtractor = async (request, response, next) => {
    const token = request.token
    const decodedUser = jwt.verify(token, process.env.SECRET)
    if (!decodedUser.id) {
        return response.status(401).send('invalid token!')
    }

    const user = await User.findById(decodedUser.id)
    if (!user) {
        return response.status(401).send('invalid token! no such user!')
    }
    request.user = user
    next()
}

const unknownEndpoint = (request, response) => {
    return response.status(404).send({ error: 'unknown endpoint!' })
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    if (error.name === 'JsonWebTokenError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

module.exports = {
    userExtractor,
    tokenExtractor,
    unknownEndpoint,
    errorHandler
}