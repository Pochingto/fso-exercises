import Note from './components/Note'
import { useState, useEffect } from 'react'
import axios from 'axios'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("add new note...")
  const [showAll, setShowAll] = useState(true)

 const hook = () => {
    console.log('effect')
    noteService.getAll().then(notes => setNotes(notes))
  }
  useEffect(hook, [])
  console.log('render', notes.length, 'notes')
  
  const addNote = (event) => {
    event.preventDefault()
    console.log("clicked...", event.target)

    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5
    }
    noteService.create(noteObject)
      .then((note) => setNotes(notes.concat(note)))
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
        alert(`${id} has already been deleted from the server.`)
        setNotes(notes.filter(note => note.id !== id))
      })
  }
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const noteToShow = showAll ? notes : notes.filter(note => note.important)
  return (
    <div>
      <h1>Notes</h1>
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
    </div>
  )
}

export default App