import { useState } from 'react'

const Display = ({text}) => (<div> {text} </div>)

const Button = ({handleClick, text}) => {
  return <button onClick={handleClick}>
    {text}
  </button>
}

const History = ({allClicks}) => {
  if (allClicks.length == 0) {
    return <div> this app works by pressing the button</div>
  }else {
    return <div> {allClicks.join(" ")} </div>
  }
}

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeft = () => {
    setAll(allClicks.concat("L"))
    setTotal(left + 1 + right)
    setLeft(left + 1)
  }

  const handleRight = () => {
    setAll(allClicks.concat("R"))
    setTotal(left + right + 1)
    setRight(right + 1)
  }
  
  return (
    <div>
      {left}
      <Button handleClick={handleLeft} text="left" />
      <Button handleClick={handleRight} text="right" />
      {right}
      <History allClicks={allClicks} />
      <Display text={total} />
    </div>
  )
} 

export default App