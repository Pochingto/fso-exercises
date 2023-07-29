import { useState } from 'react'

const NoteForm = ({ createNote }) => {
    const [newNote, setNewNote] = useState('')

    const addNote = (event) => {
        event.preventDefault()
        // console.log('clicked...', event.target)

        const noteObject = {
            content: newNote,
            important: true
        }
        createNote(noteObject)
        setNewNote('')
    }

    const handleNoteChange = (event) => setNewNote(event.target.value)
    return (
        <div className='formDiv'>
            <h2>Create a new note</h2>
            <form onSubmit={addNote}>
                <input value={newNote} onChange={handleNoteChange} id='newNoteInput' placeholder='write note content here'/>
                <button id='saveNewNoteButton' type='submit'> save </button>
            </form>
        </div>
    )
}

export default NoteForm