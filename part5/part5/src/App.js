import Note from './components/Note'
import LoginForm from './components/Login'
import { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from './services/notes'
import loginService from './services/login'
import login from './services/login'

const Footer = () => {
  const footerStyle = {
    color: "green",
    fontStyle: "italic",
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br/>
      <em>Hello, this is Footer </em>
    </div>
  )
}

const Notification = ({message}) => {
  if (message === null) {
    return null;
  }

  return (
  <div className="error">
    {message}
  </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState("add new note...")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log(`Logging in with ${userName} ${password}`)
    try {
      const user = await loginService.login({ 
        username: userName,
        password: password
      })
      console.log(user)
      noteService.setToken(user.token)
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user))
      setUserName('')
      setPassword('')
      setUser(user)
    } catch (error) {
      setErrorMessage(error.message)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

 const hook = () => {
    console.log('effect')
    noteService.getAll().then(notes => setNotes(notes))
  }
  useEffect(hook, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])
  // console.log('render', notes.length, 'notes')
  
  const addNote = (event) => {
    event.preventDefault()
    console.log("clicked...", event.target)

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }
    noteService.create(noteObject)
      .then((note) => {
        console.log(note)
        setNotes(notes.concat(note))
      }).catch(error => {
        console.log("caugth by frontend")
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
      })
    setNewNote('')
  }
  const toggleImportanceOf = (id) => {
    console.log(`toggling ${id} importance`)
    const note = notes.find( (note) => note.id === id)
    const changedNote = {...note, important:!note.important}

    noteService.update(changedNote, id)
      .then( (updatedNote) => {
        console.log("returned udpated note")
        const newNotes = notes.map((note) => note.id !== id? note: updatedNote)
        setNotes(newNotes)
      })
      .catch(error => {
        setErrorMessage(`${id} has already been deleted from the server.`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000);
        setNotes(notes.filter(note => note.id !== id))
      })
  }
  const handleNoteChange = (event) => {
    // console.log(event.target.value)
    setNewNote(event.target.value)
  }

  if (!notes)
    return null

  const noteToShow = showAll ? notes : notes.filter(note => note.important)

  const loginForm = () => {
    const hideWhenVisible = {display: loginVisible ? 'none': ''}
    const showWhenVisible = {display: loginVisible ? '': 'none'}

    return (<div>
      <div style={hideWhenVisible}>
        <button onClick={() => setLoginVisible(true)}>log in</button>
      </div>
      <div style={showWhenVisible}>
        <LoginForm 
          username={userName}
          password={password}
          handleSubmit={handleLogin}
          handleUserNameChange={(event) => setUserName(event.target.value)}
          handlePasswordChange={(event) => setPassword(event.target.value)}
        />
        <button onClick={() => setLoginVisible(false)}>cancel</button>
      </div>
    </div>)
  }

  const noteForm = () => (
    <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type='submit'> save </button>
    </form>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      {user === null ? loginForm(): null}
      {user && 
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      }
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        <ul>
          {noteToShow.map(note => 
            <Note key={note.id} note={note} toggleImportanceOf={() => toggleImportanceOf(note.id)}/>
          )}
        </ul>
      </ul>
      <Footer />
    </div>
  )
}

export default App