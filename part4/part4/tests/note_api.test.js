const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 30000)

const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const Note = require('../models/note')
const helper = require('./test_helper')

beforeEach(async () => {
    await Note.deleteMany({})
    await Note.insertMany(helper.initialNotes)
}, 100000)

describe('when there is initially some notes saved', () => {
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
})

describe('viewing a specific note', () => {
    test('succeed with a valid ID', async () => {
        const noteAtStart = await helper.noteInDb()
        const noteToView = noteAtStart[0]
        const response = await api
            .get(`/api/notes/${noteToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(response.body).toEqual(noteToView)
    }, 100000)

    test('fails with status 404 if note does not exist', async () => {
        const invalidId = await helper.nonExistingId()
        await api
            .get(`/api/notes/${invalidId}`)
            .expect(404)
    }, 100000)

    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
        await api
            .get(`/api/notes/${invalidId}`)
            .expect(400)
    }, 100000)
})

describe('addition of a new note', () => {
    test('succeed with valid data', async () => {
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

    test('fails with status code 400 if data invalid', async () => {
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
})

describe('deletion of a note', () => {
    test('succeeds with status code 204 if id is valid', async () => {
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
})

describe('update of a note', () => {
    test('succeed with valid data', async () => {
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
})

afterAll(async () => {
    await mongoose.connection.close()
})