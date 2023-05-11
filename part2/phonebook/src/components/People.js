const People = ({filteredPerson, deletePerson}) => (
    filteredPerson.map((person) => 
    <div key={person.name}>
      {person.name} {person.number}
      <button onClick={() => deletePerson(person)}>delete</button>
    </div>)
  )

export default People