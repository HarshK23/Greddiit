import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/posts'

const getAll = async () => {
  const request = await axios.get(baseUrl)

  return request.data
}

const getPost = async (name) => {
  try {
    const posts = await getAll()
    const concernedPost = posts.filter(post => {
      return post.title === name
    })

    const request = await axios.get(`${baseUrl}/${concernedPost[0].id}`)
    return request.data
  } catch (error) {
    console.log(error)
  }
}

const editPost = async (name, newPost) => {
  try {
    const post = await getPost(name)
    const response = await axios.put(`${baseUrl}/${post.id}`, newPost)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

const deletePostsBySubgreddiit = async (name) => {
  const response = await getAll()

  const posts = response.filter(post => {
    return post.postedIn === name
  })

  posts.forEach(post => deletePost(post.id))
}

const deletePost = async (id) => {
  return (await axios.delete(`${baseUrl}/${id}`))
}

export default { getAll, getPost, editPost, deletePostsBySubgreddiit, deletePost }