import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/Login'
import BlogForm from './components/Blogform'
import Togglable from './components/Togglable'
import blogService from './services/blogs'

const Notification = ({notification}) => {
  console.log('noti: ', notification)
  const style = {
      color: 'green',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
  }
  return (<p style={style} id='notification'>{notification}</p>)
}

const ErrorMessage = ({errorMessage}) => {
  console.log('errorMessage: ', errorMessage)
  const style = {
      color: 'red',
      background: 'lightgrey',
      fontSize: '20px',
      borderStyle: 'solid',
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
  }
  return (<p style={style} id='errorMessage'>{errorMessage}</p>)
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
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

  // sort blogs
  blogs.sort((a, b) => b.likes - a.likes)
  return (
    <div>
      {errorMessage !== '' && <ErrorMessage errorMessage={errorMessage}/>}
      {notification !== '' && <Notification notification={notification}/> }
      <h2>blogs</h2>
      {user === null && 
        <LoginForm setUser={setUser} setNotification={setNotification} setErrorMessage={setErrorMessage}/>
      }
      {user !== null && greeting(handleLogOut)}
      {user !== null && 
      <Togglable buttonLabel={'create blog'}>
        <BlogForm blogs={blogs} user={user} setBlogs={setBlogs} setNotification={setNotification} setErrorMessage={setErrorMessage}/>
      </Togglable>
      }
      {user !== null && blogs.map(blog =>
        <Blog key={blog.id} blog={blog} setNotification={setNotification}/>
      )}
    </div>
  )
}

export default App