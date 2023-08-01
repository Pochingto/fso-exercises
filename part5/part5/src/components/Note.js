const Note = ({ note, toggleImportanceOf }) => {
    const label = note.important ? 'make not important' : 'make important'
    return (
        <li className="note">
            <span>{note.content}</span>
            <button onClick={toggleImportanceOf}>{label}</button>
        </li>
    )
}

export default Note