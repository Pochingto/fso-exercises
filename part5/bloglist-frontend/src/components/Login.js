import { useState } from 'react'
import loginService from '../services/login'

const LoginForm = ({setUser}) => {
    
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (event) => {
        event.preventDefault()
        loginService.login({
            username: username, 
            password: password
        }).then(user => setUser(user))
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