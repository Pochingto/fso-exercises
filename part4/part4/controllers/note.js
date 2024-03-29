const jwt = require('jsonwebtoken')
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
    const notes = await Note
        .find({}).populate('user', { username: 1, name: 1 })
    response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
    const note = await Note.findById(request.params.id)
    if (note) {
        response.json(note)
    }else {
        response.status(404).end()
    }
})

const tokenFromRequest = request => {
    const authorization = request.get('authorization')
    // console.log('auth: ', authorization)
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}

notesRouter.post('/', async (request, response) => {
    const body = request.body
    const token = tokenFromRequest(request)
    // console.log(token)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return response
            .status(401)
            .json({
                error: 'invalid token'
            })
    }

    const user = await User.findById(decodedToken.id)
    // console.log('user: ', user)
    // console.log('user id? ', user.id)
    // console.log('user _id? ', user._id)
    // console.log('type of user:', typeof(user))
    const note = new Note({
        content: body.content,
        important: body.important || false,
        user: user.id
    })

    const savedNote = await note.save()
    // update user
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

notesRouter.put('/:id', async (request, response) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
    response.json(updatedNote)
})

module.exports = notesRouter