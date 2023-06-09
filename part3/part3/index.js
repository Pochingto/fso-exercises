require('dotenv').config()
const express = require('express')
const cors = require('cors')

const Note = require('./models/note')

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const app = express()
console.log('starting server...')
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(requestLogger)

app.get('/', (request, response) => {
    response.send('<h1>Hello world!</h1>')
})

app.get('/api/notes', (request, response) => {
    // response.json(notes)
    Note.find({}).then(result => {
        console.log('getAll result: ', result)
        response.json(result)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then((note) => {
            console.log('note: ', note)
            if (note) {
                response.json(note)
            }else {
                response.status(404).end()
            }
        })
        .catch((error) => next(error))
})

app.post('/api/notes', (request, response, next) => {
    if (!request.body.content) {
        return response.status(400).json({
            error: 'content missing!'
        })
    }

    // const note = request.body
    // console.log(note)
    // console.log(generateId(notes))
    
    // const newNote = {
    //     id: generateId(notes), 
    //     content: request.body.content,
    //     important: request.body.important || false
    // }
    const newNote = new Note({
        content: request.body.content,
        important: request.body.important || false
    })

    newNote.save()
        .then((savedNote) => {
            console.log(savedNote)
            response.json(savedNote)
        })
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    const newNote = request.body
    const updatedNote = {
        content: newNote.content, 
        important: newNote.important || false
    }
    Note.findByIdAndUpdate(id, updatedNote, {
        new: true, 
        runValidators: true,
        context: 'query'
    })
        .then(note => response.json(note))
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
        .then(result => response.status(204).end())
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log('error name: ', error.name)
    console.log('error message: ', error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({error: error.message})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})