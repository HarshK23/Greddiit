import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/login'

const token = localStorage.getItem('userToken')

const config = {
  headers: {
    Authorization: 'Bearer ' + token
  }
}

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials, config)

  return response.data
}

export default { login }