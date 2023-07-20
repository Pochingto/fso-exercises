const userRouter = require('express').Router()
const { default: mongoose } = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')

userRouter.get('/', async (request, response) => {
    const results = await User.find({})
    return response.status(200).json(results)
})

userRouter.post('/', async (request, response) => {
    const body = request.body
    if (!body || !body.username || !body.password) {
        return response.status(400).json({
            error: 'request body missing username or password'
        })
    }
    if (body.password.length < 3) {
        return response.status(400).json({
            error: 'password must be at least 3 characters long'
        })
    }

    const salt = 10
    const passwordHash = await bcrypt.hash(body.password, salt)
    const userToCreate = {
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    }

    const newUser = new User(userToCreate)
    const result = await newUser.save()
    return response
        .status(201)
        .json(result)
})

module.exports = userRouter