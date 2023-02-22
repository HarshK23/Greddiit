import axios from 'axios'

import subgreddiitService from '../services/subgreddiits'

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

const getPostsBySubgreddiit = async (name) => {
  try {
    const posts = await getAll()
    const concernedPosts = posts.filter(post => {
      return post.postedIn === name
    })

    return concernedPosts
  } catch (error) {
    console.log(error)
  }
}

const createPost = async (newPostObj) => {
  try {
    const response = await axios.post(`${baseUrl}`, newPostObj)

    const subgreddiit = await subgreddiitService.getSubgreddiit(newPostObj.postedIn)
    const newPosts = subgreddiit.posts.concat(response.data.title)
    const newSubgreddiit = {...subgreddiit, posts: newPosts}
    await subgreddiitService.editSubgreddiit(subgreddiit.id, newSubgreddiit)

    return response.data
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

export default { getAll, getPost, getPostsBySubgreddiit, createPost, editPost, deletePostsBySubgreddiit, deletePost }