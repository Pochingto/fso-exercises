import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/Login'
import BlogForm from './components/Blogform'
import blogService from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (window.localStorage.getItem('user')) {
      const savedUser = JSON.parse(window.localStorage.getItem('user'))
      if (savedUser){
        console.log('saved user: ', savedUser)
        setUser(savedUser)
        blogService.setToken(savedUser.token)
      }
    }
  }, [])
  useEffect(() => {
    if (!user) {
      return
    }
    blogService.setToken(user.token)
    console.log('reset user...')
    console.log('blogs: ', blogs)
    blogService.getAll().then(blogs => {
        console.log('getAll blogs...', blogs)
        setBlogs( blogs )
      }
    )
    .catch(error => console.log(error.message))
    window.localStorage.setItem('user', JSON.stringify(user))
  }, [user])

  const handleLogOut = (event) => {
    window.localStorage.removeItem('user')
    setUser(null)
  }

  const greeting = (handleLogOut) => {
    return (
      <span>{user.name} <button onClick={handleLogOut}>log out</button></span>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      {user === null && <LoginForm setUser={setUser} />}
      {user !== null && greeting(handleLogOut)}
      {user !== null && <BlogForm blogs={blogs} setBlogs={setBlogs}/>}
      {user !== null && blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App