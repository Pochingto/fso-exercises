const Header = (props) => (<h1>{props.header}</h1>)
const Part = (props) => (
  <p>
    {props.name} {props.exercises}
  </p>
)

const Content = (props) => {
  console.log(props)
  return(
  <div>
    <Part {...props.parts[0]} />
    <Part {...props.parts[1]}/>
    <Part {...props.parts[2]}/>
    {/* {
      props.parts.forEach(part => <Part {...part}/>)
    } */}
  </div>
)}
const Total = (props) => {
  console.log(props)
  var total = 0
  props.parts.forEach(part => {
    total += part.exercises
  });
  return (
    <p>Number of exercises {total}</p>
  )
}
const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header header={course}/>
      <Content parts={parts}/>
      <Total parts={parts}/>
    </div>
  )
}

export default App