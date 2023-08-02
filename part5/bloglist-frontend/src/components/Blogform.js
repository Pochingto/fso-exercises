import { useState } from "react"
import blogService from '../services/blogs'

const BlogForm = ({blogs, setBlogs, setNotification, setErrorMessage}) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')
    const handleCreateBlog = (event) => {
        event.preventDefault()
        console.log("handling in form...")
        const newBlog = {
            title: title, 
            author: author, 
            url: url
        }
        blogService
            .createNewBlog(newBlog)
            .then(blog => {
                console.log('created blog: ', blog)
                setBlogs(blogs.concat(blog))
                setNotification(`a new blog ${title} by ${author} added`)
                setTimeout(() => setNotification(''), 5000)
            })
            .catch(error => {
                if (error.response && error.response.data) setErrorMessage(error.response.data)
                else setErrorMessage(error.message)
                setTimeout(() => setErrorMessage(''), 5000)
            })
    }
    return (
        <form onSubmit={handleCreateBlog}>
            <p>title: <input value={title} onChange={(event) => setTitle(event.target.value)}/></p>
            <p>author: <input value={author} onChange={(event) => setAuthor(event.target.value)}/></p>
            <p>url: <input value={url} onChange={(event) => setUrl(event.target.value)}/></p>
            <span><button type="submit">create</button></span>
        </form>
    )
}

export default BlogForm