const blogRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    if (!request.body.title || !request.body.url) {
        response.status(400).end()
        return
    }
    if (!request.body.likes) {
        request.body.likes = 0
    }
    const user = await User.findOne({})
    request.body.user = user._id

    const blog = new Blog(request.body)
    const result = await(blog.save())
    response.status(201).json(result)
})

blogRouter.put('/:id', async (request, response) => {
    if (!request.body.title || !request.body.url) {
        response.status(400).end()
        return
    }
    if (!request.body.likes) {
        request.body.likes = 0
    }

    const udpatedBlog = await(Blog.findByIdAndUpdate(request.params.id, request.body, { new: true }))
    response.json(udpatedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
    await blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

module.exports = blogRouter