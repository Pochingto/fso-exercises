import axios from 'axios'
const baseURL = "/api/notes/"

let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const nonExisting = {
        id: 10000,
        content: 'This note is not saved to server',
        important: true,
    }
    return axios
      .get(baseURL)
      .then(response => response.data.concat(nonExisting))
}

const create = async (objectToCreate) => {
    const config = {
        headers: {'Authorization': token}
    }
    const response = await axios.post(baseURL, objectToCreate, config)
    console.log(response)
    return response.data
}

const update = (updatedNote, id) => {
    return axios
        .put(baseURL + `${id}`, updatedNote)
        .then(resposne => resposne.data)
}

export default {getAll, create, update, setToken}