import { useState } from "react"

const Blog = ({blog}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [showDetails, setShowDetails] = useState(false)
  const toggleShowDetails = () => setShowDetails(!showDetails)
  return (
  <div style={blogStyle}>
      {blog.title} by {blog.author}
      <button onClick={toggleShowDetails}>{showDetails ? 'hide': 'view'}</button>
      <div style={{display: showDetails ? '': 'none'}}>
        url: {blog.url}<br/>
        likes: {blog.likes} <button>likes</button><br/>
        user: {blog.user.name}<br/>
      </div>
  </div>)
}

export default Blog