const blogRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    if (!blog.title || !blog.url) {
        response.status(400).end()
        return
    }

    if (!blog.likes) {
        blog.likes = 0
    }

    const result = await(blog.save())
    response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
    await blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

module.exports = blogRouter