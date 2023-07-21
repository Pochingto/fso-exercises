const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body
    if (!username || !password) {
        return response.status(400).send('username or password missing!')
    }
    const user = await User.findOne({ username: username })
    if (!user) {
        return response.status(401).send('username not found!')
    }
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
        return response.status(401).send('password incorrect!')
    }

    const userForToken = {
        username: username,
        id: user._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    response
        .status(200)
        .json({
            token: token,
            username: username,
            name: user.name
        })
})

module.exports = loginRouter