const blogRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
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