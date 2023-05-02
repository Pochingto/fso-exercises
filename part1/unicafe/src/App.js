import { useState } from 'react'

const Header = ({text}) => <h1> {text} </h1>
const Button = ({handleClick, text}) => (<button onClick={handleClick}> {text} </button>)

const StatisticsLine = ({name, stat}) => <p>{name}: {stat}</p>
const calculateScore = (good, neutral, bad) => (good - bad) / (good + neutral + bad)
const calculatePercentage = (good, all) => (good / all * 100)

const Statistics = ({good, neutral, bad}) => {
  const all = good + neutral + bad
  if (all == 0) {
    return <p>No feedback given.</p>
  }

  return (
    <div>
      <StatisticsLine name="good" stat={good} />
      <StatisticsLine name="neutral" stat={neutral} />
      <StatisticsLine name="bad" stat={bad} />
      <StatisticsLine name="all" stat={all} />
      <StatisticsLine name="score" stat={calculateScore(good, neutral, bad)} />
      <StatisticsLine name="positive percentage" stat={calculatePercentage(good, all)} />
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