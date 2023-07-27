import { useState } from "react"

const NoteForm = ({createNote}) => {
    const [newNote, setNewNote] = useState('')

    const addNote = (event) => {
        event.preventDefault()
        console.log("clicked...", event.target)

        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5
        }
        createNote(noteObject)
        setNewNote('')
    }

    const handleNoteChange = (event) => setNewNote(event.target.value)
    return (
        <div>
            <h2>Create a new note</h2>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange}/>
                <button type='submit'> save </button>
            </form>
        </div>
    )
}

export default NoteForm