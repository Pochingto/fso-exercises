import { useEffect, useState } from "react"
import axios from "axios"

const Search = ({value, changeValue}) => {
  console.log(value)
  return (
    <div>
      find countries 
      <input value={value} onChange={changeValue}/>
    </div>
  )
}

const CountryInfo = ({country}) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>captial {country.capital}</p>
      <p>area {country.area} </p>
      <h2>languages: </h2>
      <ul>
        {Object.keys(country.languages).map(lang => <li key={country.languages[lang]}>{country.languages[lang]}</li>)}
      </ul>
      <img src={country.flags.png} alt={country.flags.alt}/>
    </div>
  )
}

const ShowCountries = ({query, countries}) => {
  let filtered = countries.filter(country => country.name.common.toLowerCase().startsWith(query.toLowerCase()))
  console.log("countries : ", countries)
  console.log(filtered)

  if (filtered.length === 0) {
    return <div>No matches</div>
  }else if (filtered.length == 1) {
    return <CountryInfo country={filtered[0]} />
  }else if (filtered.length <= 10) {
    return (
      <ul> {filtered.map(country => <li key={country.name.common}>{country.name.common}</li>)} </ul> 
    )
  }else {
    return <div>Too many matches, specify another filter</div>
  }
}

function App() {

  const [countries, setCountries] = useState([])
  const [key, setKey] = useState("")

  const hook = () => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        setCountries(response.data)
      })
  }
  useEffect(hook, [])

  console.log(countries)
  const changeKey = (event) => {
    setKey(event.target.value)
  }

  return (
    <div>
      <Search value={key} changeValue={changeKey}/>
      <ShowCountries query={key} countries={countries}/>
    </div>
  );
}

export default App;
