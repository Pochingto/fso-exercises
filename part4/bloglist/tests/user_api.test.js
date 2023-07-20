const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 30000)

const config = require('../utils/config')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

const initialUser = [
    {
        username: 'root',
        name: 'root',
        passwordHash: 'fakepasswordHash'
    }
]

beforeEach( async () => {
    await User.deleteMany({})
    await User.insertMany(initialUser)
}, 100000)

describe('API Testing environment', () => {
    test('using test mongodb uri', () => {
        expect(config.MONGODB_URI).toBe(process.env.TEST_MONGODB_URI)
    })
})

describe('API getting', () => {
    test('all users return correct number of users', async () => {
        const blogs = await api
            .get('/api/users')
            .expect(200)
        expect(blogs.body).toHaveLength(initialUser.length)
    }, 100000)

    test('user object has well-defined property id', async () => {
        const users = await api
            .get('/api/blogs')
            .expect(200)
        expect(users.body[0].id).toBeDefined()
    }, 100000)
})

describe('API posting', () => {
    test('successful with valid data', async () => {
        const newUser = {
            username: 'pochingto',
            name: 'pochingto',
            password: 'mypassword123'
        }

        await api
            .post('/api/users/')
            .send(newUser)
            .expect(201)

        const userAfter = await api
            .get('/api/users')
            .expect(200)
        expect(userAfter.body).toHaveLength(initialUser.length + 1)
        const usernames = userAfter.body.map(user => user.username)
        expect(usernames).toContain(newUser.username)
    }, 100000)

    test('failed with status code 400 when request body "username" length < 3', async () => {
        const newUser = {
            username: 'a',
            name: 'thisshouldfail',
            password: 'mypassword123'
        }

        await api
            .post('/api/users/')
            .send(newUser)
            .expect(400)

        const userAfter = await api
            .get('/api/users')
            .expect(200)
        expect(userAfter.body).toHaveLength(initialUser.length)
    }, 100000)

    test('failed with status code 400 when request body "password" length < 3', async () => {
        const newUser = {
            username: 'usernameiOK',
            name: 'thisshouldfail',
            password: 'a'
        }

        await api
            .post('/api/users/')
            .send(newUser)
            .expect(400)

        const userAfter = await api
            .get('/api/users')
            .expect(200)
        expect(userAfter.body).toHaveLength(initialUser.length)
    }, 100000)
})

afterAll( () => {
    mongoose.connection.close()
})