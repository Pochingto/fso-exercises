import { useState } from 'react'
import loginService from '../services/login'

const LoginForm = ({setUser, setErrorMessage}) => {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        loginService.login({
            username: username, 
            password: password
        }).then(user => setUser(user))
        .catch(error => {
            console.log(error)
            setErrorMessage(error.response.data)
            setTimeout(() => setErrorMessage(''), 5000)
        })
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <p>Username: <input value={username} onChange={(event) => setUsername(event.target.value)} /></p>
                <p>Password: <input value={password} type='password' onChange={(event) => setPassword(event.target.value)} /></p>
                <button type="submit">log in</button>
            </form>
        </div>
    )
}

export default LoginForm