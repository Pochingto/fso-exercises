import { useEffect, useState } from 'react'

import Filter from './components/Filter'
import People from './components/People'
import PersonForm from './components/PersonFrom'

import personService from './services/person'

const Notification = ({message}) => {

  if (message === null) {
    return null
  }

  const notiStyle = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  return <div style={notiStyle}>
    <br/>
    <em> {message} </em>
  </div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilteredName] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then(data => setPersons(data))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const duplicate = persons.find(person => person.name === newName)
    if (duplicate !== undefined) {
      if (window.confirm(`${duplicate.name} is already in the phone book, update it with new number?`)) {
        personService.update({
          ...duplicate,
          number: newNumber
        })
        .then((person) => {
          setPersons(
            persons.map(p => p.id === person.id ? person : p)
          )
        })

        setNotification(`Updated ${duplicate.name} phone number.`)
        setTimeout(() => setNotification(null), 5000)
      }
    }else {
      personService.add({
        name: newName, 
        number: newNumber
      })
      .then((person) => {
        setPersons(
          persons.concat(person)
        )
      })

      setNotification(`Added ${newName} phone number.`)
      setTimeout(() => setNotification(null), 5000)
    }
    setNewName("")
    setNewNumber("")
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.remove(person.id)
      .then((response) => {
        console.log(response)
        setPersons(persons.filter(p => p.id !== person.id))
      })
    }
  }

  const filteredPerson = persons.filter( (person) => 
    person.name.toLowerCase().startsWith(filterName.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      filter shown with: <Filter filterName={filterName} setFilteredName={setFilteredName} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} 
      newName={newName} newNumber={newNumber}
      changeNewName={(event) => setNewName(event.target.value)} 
      changeNewNumber={(event) => setNewNumber(event.target.value)}/>
      <h2>Numbers</h2>
      <People filteredPerson={filteredPerson} deletePerson={deletePerson}/>
    </div>
  )
}

export default App