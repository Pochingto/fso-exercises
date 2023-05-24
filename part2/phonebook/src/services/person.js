import axios from "axios";

const baseURL = `/api/persons`

const getAll = () => (
    axios
        .get(baseURL)
        .then(response => response.data)
)

const add = (person) => (
    axios
        .post(baseURL, person)
        .then(response => response.data)
)

const remove = (id) => (
    axios
        .delete(`${baseURL}/${id}`)
)

const update = (person) => (
    axios
        .put(`${baseURL}/${person.id}`, person)
        .then(response => response.data)
)

export default {getAll, add, update, remove}