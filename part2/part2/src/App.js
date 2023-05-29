import Note from './components/Note'
import { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from './services/notes'

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

 const hook = () => {
    console.log('effect')
    noteService.getAll().then(notes => setNotes(notes))
  }
  useEffect(hook, [])
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
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  if (!notes)
    return null

  const noteToShow = showAll ? notes : notes.filter(note => note.important)
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
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
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type='submit'> save </button>
      </form>
      <Footer />
    </div>
  )
}

export default App