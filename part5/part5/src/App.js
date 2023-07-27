import Note from './components/Note'
import LoginForm from './components/Login'
import { useState, useEffect } from 'react'
import noteService from './services/notes'
import loginService from './services/login'
import Togglable from './components/Togglable'
import NoteForm from './components/Noteform'

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
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

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
    noteService.getAll()
      .then(notes => setNotes(notes))
      .catch(error => console.log(error.message))
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
  const createNote = async (noteObject) => {
    try {
      const note = await noteService.create(noteObject)
      console.log(note)
      setNotes(notes.concat(note))
    } catch (error) {
      console.log("caugth by frontend")
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
    }
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

  if (!notes)
    return null

  const noteToShow = showAll ? notes : notes.filter(note => note.important)

  const loginForm = () => {
    return (
      <Togglable buttonLabel='login'>
        <LoginForm 
          username={userName}
          password={password}
          handleSubmit={handleLogin}
          handleUserNameChange={(event) => setUserName(event.target.value)}
          handlePasswordChange={(event) => setPassword(event.target.value)}
        />
      </Togglable>
    )
  }

  const noteForm = () => (
    <NoteForm createNote={createNote} />
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