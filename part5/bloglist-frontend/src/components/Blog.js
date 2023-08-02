import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({blog}) => {
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
    const blogToUpdate = blog
    blogToUpdate.likes = blog.likes + 1
    blogToUpdate.likes = 
    console.log('try update blog from Blog: ', blog)
    blogService
      .updateBlog(blog)
      .then(response => {
        console.log('updated blog: ', response)
        setBlogLikes(blogLikes + 1)
      })
      .catch(error => console.error(error.message))
  }
  return (
  <div style={blogStyle}>
      {blog.title} by {blog.author}
      <button onClick={toggleShowDetails}>{showDetails ? 'hide': 'view'}</button>
      <div style={{display: showDetails ? '': 'none'}}>
        url: {blog.url}<br/>
        likes: {blog.likes} <button onClick={addLikes}>likes</button><br/>
        user: {blog.user.name}<br/>
      </div>
  </div>)
}

export default Blog