import { useState } from "react"
import blogService from '../services/blogs'

const BlogForm = ({blogs, setBlogs}) => {
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
            })
            .catch(error => console.error(error))
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