const mongoose = require('mongoose')
mongoose.set('bufferTimeoutMS', 30000)

const config = require('../utils/config')
const supertest = require('supertest')
const Blog = require('../models/blog')
const app = require('../app')

const api = supertest(app)

const initalBlogs = [
    {
        title: 'blog1',
        author: 'author1',
        url: 'url1',
        likes: 1000
    },
    {
        title: 'blog2',
        author: 'author1',
        url: 'url2',
        likes: 2002
    },
    {
        title: 'blog3',
        author: 'author1',
        url: 'url3',
        likes: 3030
    },
    {
        title: 'blog4',
        author: 'author2',
        url: 'url4',
        likes: 14400
    }
]

beforeEach( async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initalBlogs)
}, 100000)

describe('API Testing environment', () => {
    test('using test mongodb uri', () => {
        expect(config.MONGODB_URI).toBe(process.env.TEST_MONGODB_URI)
    })
})

describe('API getting', () => {
    test('all blogs return correct number of blogs', async () => {
        const blogs = await api
            .get('/api/blogs')
            .expect(200)
        expect(blogs.body).toHaveLength(initalBlogs.length)
    })
})

afterAll( () => {
    mongoose.connection.close()
})