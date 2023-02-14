import axios from 'axios'

import postsService from './posts'

const baseUrl = 'http://localhost:3001/api/subgreddiits'

const getAll = async () => {
  const request = await axios.get(baseUrl)

  return request.data
}

const getSubgreddiit = async (name) => {
  try {
    const subs = await getAll();

    const subgreddiit = subs.filter(subgreddiit => {
      return subgreddiit.name === name
    })

    const id = subgreddiit[0].id

    try {
      const request = await axios.get(`${baseUrl}/${id}`)
      return request.data
    } catch (error) {
      console.error(error.message);
    }

  } catch (error) {
    console.error(error.message);
  }
}

const handleJoinRequest = async (subName, userEmail, decision) => {
  try {
    const subgreddiit = await getSubgreddiit(subName)
    const joinRequests = subgreddiit.joinRequests
    let newJoinRequests, newFollowers

    if (decision === 'accept') {
      newJoinRequests = joinRequests.filter(request => {
        return request !== userEmail
      })

      newFollowers = subgreddiit.followers.concat(userEmail)
    } else {
      newJoinRequests = joinRequests.filter(request => {
        return request !== userEmail
      })

      newFollowers = subgreddiit.followers
    }

    const newObject = {
      name: subgreddiit.name,
      description: subgreddiit.description,
      tags: subgreddiit.tags,
      bannedKeywords: subgreddiit.bannedKeywords,
      followers: newFollowers,
      createdBy: subgreddiit.createdBy,
      posts: subgreddiit.posts,
      blockedUsers: subgreddiit.blockedUsers,
      joinRequests: newJoinRequests,
      image: subgreddiit.image
    }
    
    const response = await axios.put(`${baseUrl}/${subgreddiit.id}`, newObject)

    return response.data
  } catch (error) {
    console.error(error.message);
  }
}

const createSubgreddiit = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)

  return response.data
}

const deleteSubgreddiit = async (name) => {
  getAll()
    .then(
      response => {
        console.log(response)
        const subgreddiit = response.filter(subgreddiit => {
          return subgreddiit.name === name
        })

        if (subgreddiit.length === 0) {
          return -1
        }

        postsService.deletePostsBySubgreddiit(name)

        const request = axios.delete(`${baseUrl}/${subgreddiit[0].id}`)

        return request
      })
    .catch(error => {
      console.log(error)
    })
}

export default { getAll, getSubgreddiit, handleJoinRequest, createSubgreddiit, deleteSubgreddiit }