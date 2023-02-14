import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/posts'

const getAll = async () => {
  const request = await axios.get(baseUrl)

  return request.data
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

export default { getAll, deletePostsBySubgreddiit, deletePost }