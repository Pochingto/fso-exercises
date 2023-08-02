import axios from "axios"

const login = ({username, password}) => {
    return axios
        .post('/api/login', {
            username: username,
            password: password
        })
        .then(response => {
            console.log(response.data)
            return response.data
        })
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    login
}