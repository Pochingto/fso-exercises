import axios from 'axios'
const baseURL = "http://localhost:3001/notes/"

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

const create = (objectToCreate) => {
    return axios
        .post(baseURL, objectToCreate)
        .then(response => response.data)
}

const update = (updatedNote, id) => {
    return axios
        .put(baseURL + `${id}`, updatedNote)
        .then(resposne => resposne.data)
}

export default {getAll, create, update}