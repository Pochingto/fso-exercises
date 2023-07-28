import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const config = {
    headers: { Authorization : token}
  }
  const request = axios.get(baseUrl, config)
  return request
    .then(response => {
      console.log(response)
      console.log('blogs: ', response.data)
      return response.data
    })
    .catch(error => console.error(error.response.data))
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { setToken, getAll }