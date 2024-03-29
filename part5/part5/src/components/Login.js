import PropTypes from 'prop-types'

const LoginForm = ({ handleSubmit, handleUserNameChange, handlePasswordChange, username, password }) => (
    <div>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
            <div>
           username
                <input
                    id='username'
                    value={username}
                    onChange={handleUserNameChange}
                />
            </div>
            <div>
           password
                <input
                    id='password'
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                />
            </div>
            <button id='login-button' type="submit">login</button>
        </form>
    </div>
)

LoginForm.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    handleUserNameChange: PropTypes.func.isRequired,
    handlePasswordChange: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
}

export default LoginForm