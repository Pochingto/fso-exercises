const bcrypt = require('bcrypt')
const supertest = require('supertest')
const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 30000)

const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({
            username: 'root',
            passwordHash
        })
        await user.save()
    }, 1000000)

    test('creation succeeds with a fresh username', async () => {
        const usersBefore = await helper.userInDb()
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }
        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await helper.userInDb()
        expect(usersAfter).toHaveLength(usersBefore.length + 1)
        const usernames = usersAfter.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    }, 1000000)

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersBefore = await helper.userInDb()
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }
        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')
        const usersAfter = await helper.userInDb()
        expect(usersAfter).toEqual(usersBefore)
    })
})

afterAll(() => {
    mongoose.connection.close()
})