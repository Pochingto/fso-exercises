import { useState } from 'react'

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

const Button = ({handleClick, text}) => <button onClick={handleClick}>{text}</button>
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))
  const [mostVoted, setMostVoted] = useState({"index": 0, "count": 0})

  const nextAnecdotes = () => {
    let i = getRandomInt(0, anecdotes.length - 1)
    while (i == selected) {
      i = getRandomInt(0, anecdotes.length - 1)
    }
    setSelected(i)
  }

  const increaseVote = () => {
    const new_votes = [...votes]
    new_votes[selected] += 1
    setVotes(new_votes)

    if (new_votes[selected] > mostVoted.count) {
      setMostVoted({
        "index": selected,
        "count": new_votes[selected]
      })
    }
  }

  return (
    <div>
      <h1>Anecodte of the day</h1>
      <p>{anecdotes[selected]} </p>
      <p>has {votes[selected]} votes</p>
      <Button handleClick={increaseVote} text="vote" />
      <Button handleClick={nextAnecdotes} text="next anecdote"/>
      <h1>Anecodte with the most vote</h1>
      <p>{anecdotes[mostVoted.index]}</p>
      <p>has {mostVoted.count} votes.</p>
    </div>
  )
}

export default App