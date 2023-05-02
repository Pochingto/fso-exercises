import { useState } from 'react'

const Header = ({text}) => <h1> {text} </h1>
const Button = ({handleClick, text}) => (<button onClick={handleClick}> {text} </button>)

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
      <p>good: {good} </p>
      <p>neutral: {neutral} </p>
      <p>bad: {bad} </p>
    </div>
  )
}

export default App