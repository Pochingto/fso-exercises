const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateID = () => {
  return Math.floor(Math.random() * 100000000);
}

app.get("/api/persons", (request, response) => {
    response.json(persons)
})

app.get("/api/info", (request, response) => {
  const date = new Date()
  response.send(
    `<p>Phonebook has info for ${persons.length} people.</p>
    <p>${date.toString()}</p>`
  )
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  }else {
    response.status(404).end()
  }
})

app.post("/api/persons", (request, response) => {
  const body = request.body
  if (body.name && body.number) {
    const duplicate = persons.find(person => person.name === body.name)
    if (duplicate) {
      return response.status(400).json({
        error: `Name ${body.name} already exist`
      })
    }

    const newPerson = {
      id: generateID(),
      name: body.name, 
      number: body.number 
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
  }else {
    response.status(400).json({
      error: "name or number missing"
    })
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})