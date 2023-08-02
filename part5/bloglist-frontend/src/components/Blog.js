import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({blog, setNotification}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showDetails, setShowDetails] = useState(false)
  const [blogLikes, setBlogLikes] = useState(blog.likes)
  const toggleShowDetails = () => setShowDetails(!showDetails)

  const addLikes = (event) => {
    event.preventDefault()
    const body = {
      likes: blogLikes + 1
    }
    blogService
      .updateBlog(blog.id, body)
      .then(response => {
        console.log('updated blog: ', response)
        setBlogLikes(blogLikes + 1)
      })
      .catch(error => console.error(error.message))
  }

  const deleteBlog = (event) => {
    const blogId = blog.id
    if (window.confirm(`Remove ${blog.title} by ${blog.author} ?`)) {
      blogService
        .deleteBlog(blogId)
        .then((response) => {
          console.log('service response: ', response)
          setNotification(`${blog.title} by ${blog.author} has been removed.`)
          setTimeout(() => setNotification(''), 5000)
        })
    }
  }
  return (
  <div style={blogStyle}>
      {blog.title} by {blog.author}
      <button onClick={toggleShowDetails}>{showDetails ? 'hide': 'view'}</button>
      <div style={{display: showDetails ? '': 'none'}}>
        url: {blog.url}<br/>
        likes: {blogLikes} <button onClick={addLikes}>likes</button><br/>
        user: {blog.user.name}<br/>
        <button onClick={deleteBlog}>Remove</button>
      </div>
  </div>)
}

export default Blog