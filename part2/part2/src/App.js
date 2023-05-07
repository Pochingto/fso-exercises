import Note from './components/Note'
import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("add new note...")
  const [showAll, setShowAll] = useState(true)

 const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }
  useEffect(hook, [])
  console.log('render', notes.length, 'notes')
  
  const addNote = (event) => {
    event.preventDefault()
    console.log("clicked...", event.target)
    setNotes(notes.concat({
      id: notes.length + 1,
      content: newNote,
      important: Math.random() < 0.5,
    }))
    setNewNote('')
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
            <Note key={note.id} note={note} />
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