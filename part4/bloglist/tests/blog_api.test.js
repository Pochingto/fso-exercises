const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
mongoose.set('bufferTimeoutMS', 30000)

const config = require('../utils/config')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)

let initalBlogs = [
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
let token = null
let userId = null

beforeEach( async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const password = 'mypassword123'
    const passwordHash = await bcrypt.hash(password, 10)
    const userToCreate = new User({
        username: 'root',
        name: 'test',
        passwordHash: passwordHash
    })
    const savedUser = await userToCreate.save()
    userId = savedUser._id

    const loginResponse = await api
        .post('/api/login')
        .send({
            username: 'root',
            password: password
        })
        .expect(200)

    token = loginResponse.body.token

    initalBlogs.forEach(blog => {
        blog.user = userId
    })

    // console.log(initalBlogs)
    const savedBlogs = await Blog.insertMany(initalBlogs)
    // console.log(savedBlogs)
    const blogsId = savedBlogs.map(blog => blog._id)
    const user = await User.findById(userId)
    user.blogs = user.blogs.concat(blogsId)
    await user.save()
    // console.log(loginResponse.body)
    // console.log(token)
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
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(blogs.body).toHaveLength(initalBlogs.length)
    }, 100000)

    test('blog object has well-defined property id', async () => {
        const blogs = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(blogs.body[0].id).toBeDefined()
    }, 100000)
})

describe('API posting', () => {
    test('successful with valid data', async () => {
        const newBlog = {
            title: 'newBlog',
            author: 'newAuthor',
            url: 'newURL',
            likes: 12345
        }

        await api
            .post('/api/blogs/')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)

        const blogsAfter = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(blogsAfter.body).toHaveLength(initalBlogs.length + 1)
        const titles = blogsAfter.body.map(blog => blog.title)
        expect(titles).toContain(newBlog.title)
    }, 100000)

    test('successful added with property "likes" missing -> default to 0', async () => {
        const newBlog = {
            title: 'missingLikesBlog',
            author: 'missingLikesAuthor',
            url: 'missingLikesAuthor'
        }

        await api
            .post('/api/blogs/')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)

        const blogsAfter = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(blogsAfter.body).toHaveLength(initalBlogs.length + 1)
        const blogAdded = blogsAfter.body.find(blog => blog.title === newBlog.title)
        expect(blogAdded.likes).toBe(0)
    }, 100000)

    test('failed with status code 400 when request body "title" missing', async () => {
        const newBlog = {
            author: 'missingTitle',
            url: 'missing Title',
            likes: 0
        }
        await api
            .post('/api/blogs/')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const blogsAfter = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(blogsAfter.body).toHaveLength(initalBlogs.length)
    }, 100000)

    test('failed with status code 400 when request body "url" missing', async () => {
        const newBlog = {
            title: 'missingURL',
            author: 'missingURL',
            likes: 0
        }
        await api
            .post('/api/blogs/')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const blogsAfter = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
        expect(blogsAfter.body).toHaveLength(initalBlogs.length)
    }, 100000)
})

describe('API deleting', () => {
    test('successfully with valid id and valid user', async () => {
        const blogsBefore = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        const user = await User.findById(userId)
        const blogIdToDelete = user.blogs[0]

        await api
            .delete(`/api/blogs/${blogIdToDelete}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
        const blogsAfter = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        expect(blogsAfter.body).toHaveLength(blogsBefore.body.length - 1)
        const blogIds = blogsAfter.body.map(blog => blog.id)
        expect(blogIds).not.toContainEqual(blogIdToDelete)
    }, 100000)
})

describe('API updating', () => {
    test('successfully with valid id', async () => {
        const blogsBefore = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        const user = await User.findById(userId)
        const blogIdToUpdate = user.blogs[0]
        const blogToUpdate = await Blog.findById(blogIdToUpdate)

        const updatingBlog = {
            title: 'updatingBlog1',
            author: 'updatingAuthor1',
            url: 'updatingUrl1',
            likes: 1234
        }
        await api
            .put(`/api/blogs/${blogIdToUpdate}`)
            .send(updatingBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        const blogsAfter = await api
            .get('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)

        expect(blogsAfter.body).toHaveLength(blogsBefore.body.length)
        expect(blogsAfter.body).not.toContainEqual(blogToUpdate)
        const titles = blogsAfter.body.map(blog => blog.title)
        expect(titles).toContain(updatingBlog.title)
    }, 100000)
})

afterAll( () => {
    mongoose.connection.close()
})