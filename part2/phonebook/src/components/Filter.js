const Filter = ({filterName, setFilteredName}) => (
    <input value={filterName} onChange={(event) => setFilteredName(event.target.value)}/>
  )

export default Filter