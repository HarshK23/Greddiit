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

  const filteredUsers = users.filter(user => user.email === email)
  const id = filteredUsers[0].id

  const request = await axios.put(`${baseUrl}/${id}`, userObject)
  return request.data
}

const manageSavedPosts = async (email, postTitle, decision) => {
  const user = await getUser(email)
  let newSavedPosts

  if (decision === 'save') {
    newSavedPosts = user.savedPosts.concat(postTitle)
  } else {
    newSavedPosts = user.savedPosts.filter(post => post !== postTitle)
  }

  const newUser = { ...user, savedPosts: newSavedPosts }
  const request = await axios.put(`${baseUrl}/${user.id}`, newUser)

  return request.data
}

export default { getAll, getUser, createUser, editUser, manageSavedPosts }