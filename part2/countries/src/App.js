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

const ShowCountries = ({query, countries, showCountries, toggleShowCountries}) => {
  const filtered = countries.filter(country => country.name.common.toLowerCase().startsWith(query.toLowerCase()))
  // console.log("countries : ", countries)
  // console.log(filtered)
  // console.log("show countries state", showCountries)

  if (filtered.length === 0) {
    return <div>No matches</div>
  }else if (filtered.length == 1) {
    return <CountryInfo country={filtered[0]} />
  }else if (filtered.length <= 10) {
    return (
      <ul> {filtered.map(country => 
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={toggleShowCountries(country.name.common)}>
            {showCountries.get(country.name.common) ? "hide" : "show"}
          </button>
          {showCountries.get(country.name.common) ? <CountryInfo country={country} /> : null}
        </li>)} 
      </ul> 
    )
  }else {
    return <div>Too many matches, specify another filter</div>
  }
}

function App() {
  console.log("App rerendered")
  const [countries, setCountries] = useState([])
  const [showCountries, setShowCountries] = useState({})
  const [key, setKey] = useState("")
  const hook = () => {
    axios
      .get("https://restcountries.com/v3.1/all")
      .then((response) => {
        console.log(response.data)
        setCountries(response.data)
        const show = new Map(response.data.map(country => [country.name.common, false]))
        console.log("show", show)
        setShowCountries(show)

        const newShow = new Map(show)
        newShow.set("Spain", true)
        console.log("new show", newShow)
        console.log("spain? ", newShow.get("Spain"))
      })
  }
  useEffect(hook, [])
  const changeKey = (event) => {
    setKey(event.target.value)
  }

  const toggleShowCountries = (countryName) => {
    return () => {
      console.log(`Setting ${countryName} to ${!showCountries.get(countryName)}`)
      const newShowCountries = new Map(showCountries)
      newShowCountries.set(countryName, !newShowCountries.get(countryName))
      setShowCountries(newShowCountries)
    }
  }

  return (
    <div>
      <Search value={key} changeValue={changeKey}/>
      <ShowCountries query={key} 
          countries={countries} 
          showCountries={showCountries}
          toggleShowCountries={toggleShowCountries}/>
    </div>
  );
}

export default App;
