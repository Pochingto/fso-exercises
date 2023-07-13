const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 30000)

const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const Note = require('../models/note')
const helper = require('./test_helper')

beforeEach(async () => {
    await Note.deleteMany({})

    const noteObjects = helper.initialNotes.map(note => new Note(note))
    const notePromises = noteObjects.map(note => note.save())
    await Promise.all(notePromises)
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

test('a specific note can be viewed', async () => {
    const noteAtStart = await helper.noteInDb()
    const noteToView = noteAtStart[0]
    const response = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(response.body).toEqual(noteToView)
}, 100000)

test('a note can be deleted', async () => {
    const noteAtStart = await helper.noteInDb()
    const noteToDelete = noteAtStart[0]
    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

    const noteAtEnd = await helper.noteInDb()
    expect(noteAtEnd).toHaveLength(helper.initialNotes.length - 1)

    const contents = noteAtEnd.map(note => note.content)
    expect(contents).not.toContain(noteToDelete.content)
}, 100000)

test('a note can be updated', async () => {
    const noteAtStart = await helper.noteInDb()
    const noteToUpdate = noteAtStart[0]
    const newNote = {
        content: 'this note is updated',
        important: true,
    }
    const updatedNote = await api
        .put(`/api/notes/${noteToUpdate.id}`)
        .send(newNote)
        .expect(200)

    const noteAtEnd = await helper.noteInDb()
    expect(noteAtEnd).toHaveLength(helper.initialNotes.length)

    expect(updatedNote.body.content).toEqual(newNote.content)
}, 100000)

afterAll(async () => {
    await mongoose.connection.close()
})