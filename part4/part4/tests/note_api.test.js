const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 30000)

const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const Note = require('../models/note')
const helper = require('./test_helper')

beforeEach(async () => {
    await Note.deleteMany({})
    let noteObject = new Note(helper.initialNotes[0])
    await noteObject.save()
    noteObject = new Note(helper.initialNotes[1])
    await noteObject.save()
}, 100000)

test('notes are returned as json', async() => {
    await api
        .get('/api/notes/')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 10000)

test('all notes are returned', async () => {
    const response = await api.get('/api/notes')
    expect(response.body).toHaveLength(helper.initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')
    const contents = response.body.map(r => r.content)
    expect(contents).toContain(
        'Browser can execute only JavaScript'
    )
})

test('a valid note can be added', async () => {
    const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
    }
    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const noteAtEnd = await helper.noteInDb()
    expect(noteAtEnd).toHaveLength(helper.initialNotes.length + 1)

    const contents = noteAtEnd.map(r => r.content)
    expect(contents).toContain(
        'async/await simplifies making async calls'
    )
}, 100000)

test('note without content is not added', async () => {
    const newNote = {
        important: true
    }

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)

    const noteAtEnd = await helper.noteInDb()
    expect(noteAtEnd).toHaveLength(helper.initialNotes.length)
}, 100000)

afterAll(async () => {
    await mongoose.connection.close()
})