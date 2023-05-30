require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

morgan.token("content", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }else {
    return null
  }
})
const logger = morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.content(req, res)
  ].join(' ')
})

app.use(cors())
app.use(express.json())
app.use(logger)

app.use(express.static('build'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get("/api/persons", (request, response, next) => {
    // response.json(persons)
    Person.find({})
      .then(result => {
        response.json(result)
      })
      .catch(error => next(error))
})

app.get("/api/info", (request, response) => {
   Person.find({})
    .then(persons => {
      const date = new Date()
      response.send(
        `<p>Phonebook has info for ${persons.length} people.</p>
        <p>${date.toString()}</p>`
      )
    })
})

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  // const person = persons.find(p => p.id === id)
  // if (person) {
  //   response.json(person)
  // }else {
  //   response.status(404).end()
  // }
  Person.findById(id)
    .then(result => response.json(result))
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
  const body = request.body
  if (body.name && body.number) {
    const newPerson = new Person({
      name: body.name,
      number: body.number
    })
    newPerson.save()
      .then(result => response.json(result))
      .catch(error => next(error))
  }else {
    response.status(400).json({
      error: "name or number missing"
    })
  }
})

app.put("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  const body = request.body
  const updatedPerson = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(id, updatedPerson, 
    {new: true, runValidators: true, context: 'query'}
  )
    .then(result => response.json(result))
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  // persons = persons.filter(p => p.id !== id)
  Person.findByIdAndDelete(id)
    .then(result => response.status(204).end())
    .catch(error => next(error))
  // response.status(204).end()
})

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log("error name: ", error.name)
  console.log("error message: ", error.message)
  if (error.name === "CastError") {
    response.status(400).send({
      "message": "invalid id"
    })
  }else if (error.name === 'ValidationError') {
    response.status(400).send({
      "error": error.message
    })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})