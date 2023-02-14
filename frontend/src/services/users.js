import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/users'

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const getUser = async (email) => {
  try {
    const users = await getAll()
    const currentUser = await users.filter(user => user.email === email)
    const request = await axios.get(`${baseUrl}/${currentUser[0].id}`)

    return request.data
  } catch (error) {
    console.error(error.message);
  }
}

const createUser = async (newObject) => {

  const request = await axios.post(baseUrl, newObject)

  return request.data
}

const editUser = async (email, userObject) => {
  const users = await getAll()
  console.log(users, email)

  const filteredUsers = users.filter(user => user.email === email)
  const id = filteredUsers[0].id

  console.log(id)

  const request = await axios.put(`${baseUrl}/${id}`, userObject)
  return request.data
}

export default { getAll, getUser, createUser, editUser }