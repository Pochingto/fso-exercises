import { useState } from 'react'

const Header = ({text}) => <h1> {text} </h1>
const Button = ({handleClick, text}) => (<button onClick={handleClick}> {text} </button>)
const Score = ({good, neutral, bad}) => {
  let all = good + neutral + bad
  let score = 0
  if (all != 0) {
    score = (good - bad) / all
  }

  return <p>score: {score}</p>
}
const Percentage = ({good, all}) => {
  if (all == 0) {
    return <p>positive 0% </p>
  }else {
    return <p>positive {good / all * 100}% </p>
  }
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  if (all == 0) {
    return <p>No feedback given.</p>
  }

  
  return (
    <div>
      <p>good: {good} </p>
      <p>neutral: {neutral} </p>
      <p>bad: {bad} </p>
      <p>all: {all} </p>
      <Score good={good} neutral={neutral} bad={bad} />
      <Percentage good={good} all={all} />
    </div>
  )
}


const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const addFeedback = (feedback, setFeedback) => {
    return () => setFeedback(feedback + 1)
  }

  return (
    <div>
      <Header text="Give feedback" />
      <Button handleClick={addFeedback(good, setGood)} text="good" />
      <Button handleClick={addFeedback(neutral, setNeutral)} text="neutral" />
      <Button handleClick={addFeedback(bad, setBad)} text="bad" />
      <Header text="Statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App