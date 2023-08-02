import Togglable from "./Togglable"

const Blog = ({blog}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
  <div style={blogStyle}>
    <Togglable header={blog.title + ' ' + blog.author} buttonLabel={'view'}>
      title: {blog.title}<br/>
      url: {blog.url}<br/>
      likes: {blog.likes} <button>likes</button><br/>
      author: {blog.author}<br/>
    </Togglable>
  </div>)
}

export default Blog