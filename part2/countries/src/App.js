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

const CountryInfo = ({country, weather}) => {
  // console.log(weather_app_key_id)
  console.log("country and weather: ", country.name.common, weather)
  console.log(`https://openweathermap.org/img/wn/${weather.icon}@2x.png`)
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
      <h1>Weather in {country.capital}</h1>
      <p>temperature - {weather.temp} Celcius</p>
      <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} />
      <p>wind {weather.wind} m/s </p>
    </div>
  )
}

const ShowCountries = ({query, countries, showCountries, countriesWeather, toggleShowCountries}) => {
  const filtered = countries.filter(country => country.name.common.toLowerCase().startsWith(query.toLowerCase()))
  // console.log("countries : ", countries)
  // console.log(filtered)
  // console.log("show countries state", showCountries)

  if (filtered.length === 0) {
    return <div>No matches</div>
  }else if (filtered.length === 1) {
    return <CountryInfo country={filtered[0]} weather={countriesWeather.get(filtered[0].name.common)} />
  }else if (filtered.length <= 10) {
    return (
      <ul> {filtered.map(country => 
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={toggleShowCountries(country.name.common)}>
            {showCountries.get(country.name.common) ? "hide" : "show"}
          </button>
          {showCountries.get(country.name.common) ? <CountryInfo country={country} weather={countriesWeather.get(country.name.common)} /> : null}
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
  const [showCountries, setShowCountries] = useState(null)
  const [countriesWeather, setCountriesWeather] = useState(null)
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

        const weather = new Map(response.data.map(country => [country.name.common, {}]))
        console.log("weather", weather)
        setCountriesWeather(weather)
        // const newShow = new Map(show)
        // newShow.set("Spain", true)
        // console.log("new show", newShow)
        // console.log("spain? ", newShow.get("Spain"))
      })
  }
  useEffect(hook, [])
  const changeKey = (event) => {
    setKey(event.target.value)
  }

  const updateCountriesWeather = () => {
    // const showingCountriesName = Array.from(showCountries).filter(([k, v]) => v)
    // console.log(showingCountriesName)
    console.log(countries)
    const showingCountries = countries.filter(country => showCountries.get(country.name.common))
    console.log("showing countries: ", showingCountries)
    showingCountries.forEach((country) => {
      const capitalInfo = country.capitalInfo
      console.log(capitalInfo)
      axios
      .get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          lat: capitalInfo.latlng[0],
          lon: capitalInfo.latlng[1],
          appid: process.env.REACT_APP_API_KEY
        }
      })
      .then(response => {
        const data = response.data
        const weather = new Map(countriesWeather)
        const captialWeather = {
          temp: data.main.temp - 273,
          wind: data.wind.speed,
          icon: data.weather[0].icon
        }
        console.log(data)
        weather.set(country.name.common, captialWeather)
        console.log(captialWeather)
        setCountriesWeather(weather)
      })
    })
  }
  useEffect(updateCountriesWeather, [showCountries])

  const toggleShowCountries = (countryName) => {
    return () => {
      console.log(`Setting ${countryName} to ${!showCountries.get(countryName)}`)
      const newShowCountries = new Map(showCountries)
      newShowCountries.set(countryName, !showCountries.get(countryName))
      setShowCountries(newShowCountries)
    }
  }

  return (
    <div>
      <Search value={key} changeValue={changeKey}/>
      <ShowCountries query={key} 
          countries={countries} 
          showCountries={showCountries}
          countriesWeather={countriesWeather}
          toggleShowCountries={toggleShowCountries}/>
    </div>
  );
}

export default App;
