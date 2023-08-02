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
}

const createNewBlog = (blog) => {
  const config = {
    headers: { Authorization: token }
  }

  return axios
    .post(baseUrl, blog, config)
    .then(response => response.data)
}

// eslint-disable-next-line import/no-anonymous-default-export
export default { setToken, getAll, createNewBlog}