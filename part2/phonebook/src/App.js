import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas',
      number: '23045'  
    }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilteredName] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const duplicate = persons.find(person => person.name === newName)
    if (duplicate !== undefined) {
      alert(`${duplicate.name} is already in the list!`)
      return
    }

    setPersons(persons.concat({
      name: newName,
      number: newNumber
    }))
    setNewName("")
    setNewNumber("")
  }

  const filteredPerson = persons.filter( (person) => 
    person.name.toLowerCase().startsWith(filterName.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      filter shown with: <input value={filterName} onChange={(event) => setFilteredName(event.target.value)}/>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={(event) => setNewName(event.target.value)}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {filteredPerson.map((person) => <div key={person.name}>{person.name} {person.number}</div>)}
    </div>
  )
}

export default App