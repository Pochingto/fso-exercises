const blogRouter = require('express').Router()
const blog = require('../models/blog')
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })
    return response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    if (!request.body.title || !request.body.url) {
        return response.status(400).send('request must contain title or url')
    }
    const user = request.user
    const blogToCreate = request.body
    blogToCreate.user = user._id
    if (!blogToCreate.likes) {
        blogToCreate.likes = 0
    }

    const blog = new Blog(blogToCreate)
    const savedBlog = await(blog.save())

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogRouter.put('/:id', async (request, response) => {
    const user = request.user
    if (!user) {
        return response.status(400).send('invalid token')
    }
    const blogToUpdate = await Blog.findById(request.params.id)
    if (blogToUpdate.user.toString() !== user._id.toString()) {
        return response.status(401).send('unauthorized user')
    }

    if (request.body.title) blogToUpdate.title = request.body.title
    if (request.body.author) blogToUpdate.author = request.body.author
    if (request.body.url) blogToUpdate.url = request.body.url
    if (request.body.likes) blogToUpdate.likes = request.body.likes

    const udpatedBlog = await blogToUpdate.save()
    response.json(udpatedBlog)
})

blogRouter.delete('/', async (request, response) => {
    const user = request.user
    if (!user) {
        return response.status(400).send('invalid token')
    }
    await blog.deleteMany({})
    response.status(204).end()
})

blogRouter.delete('/:id', async (request, response) => {
    const user = request.user
    const blogToDelete = await Blog.findById(request.params.id)
    if (!blogToDelete || !user) {
        return response.status(400).send('invalid blog id or token')
    }
    if (blogToDelete.user.toString() !== user._id.toString()) {
        return response.status(401).send('unauthorized user')
    }

    await blog.findByIdAndDelete(blogToDelete._id)
    response.status(204).end()
})

module.exports = blogRouter