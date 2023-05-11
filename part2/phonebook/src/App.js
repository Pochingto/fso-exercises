import { useEffect, useState } from 'react'
import axios from 'axios'

const Filter = ({filterName, setFilteredName}) => (
  <input value={filterName} onChange={(event) => setFilteredName(event.target.value)}/>
)

const Persons = ({filteredPerson}) => (
  filteredPerson.map((person) => <div key={person.name}>{person.name} {person.number}</div>)
)

const PersonForm = ({addPerson, newName, changeNewName, newNumber, changeNewNumber}) => {
  return <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={changeNewName}/>
    </div>
    <div>
      number: <input value={newNumber} onChange={changeNewNumber}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilteredName] = useState('')

  useEffect(() => {
    axios
      .get(`http://localhost:3001/persons`)
      .then((response) => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const duplicate = persons.find(person => person.name === newName)
    if (duplicate !== undefined) {
      alert(`${duplicate.name} is already in the list!`)
      return
    }

    axios
      .post(`http://localhost:3001/persons`, {
        name: newName, 
        number: newNumber
      })
      .then((response) => {
        setPersons(
          persons.concat(response.data)
        )
      })
    setNewName("")
    setNewNumber("")
  }

  const filteredPerson = persons.filter( (person) => 
    person.name.toLowerCase().startsWith(filterName.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      filter shown with: <Filter filterName={filterName} setFilteredName={setFilteredName} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} 
      newName={newName} newNumber={newNumber}
      changeNewName={(event) => setNewName(event.target.value)} 
      changeNewNumber={(event) => setNewNumber(event.target.value)}/>
      <h2>Numbers</h2>
      <Persons filteredPerson={filteredPerson}/>
    </div>
  )
}

export default App