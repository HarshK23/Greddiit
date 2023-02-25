import axios from 'axios'
import postsService from './posts'
import subgreddiitService from './subgreddiits'
import userService from './users'
const baseUrl = 'http://localhost:3001/api/reports'

const getAll = async () => {
  try {
    const request = await axios.get(baseUrl)

    return request.data
  } catch (error) {
    console.log(error)
  }
}

const getReport = async (id) => {
  try {
    const request = await axios.get(`${baseUrl}/${id}`)
    return request.data
  } catch (error) {
    console.log(error)
  }
}

const createReport = async (newReportObj) => {
  try {
    const response = await axios.post(`${baseUrl}`, newReportObj)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

const changeVerdict = async (id, givenVerdict) => {
  try {
    const report = await getReport(id)
    // const email = await axios.post(`${baseUrl}/${id}`, {givenVerdict: givenVerdict})
    const newReport = { ...report, verdict: givenVerdict }

    const response = await axios.put(`${baseUrl}/${id}`, newReport)

    if (givenVerdict === "blocked") {
      try {
        const newPost = await postsService.getPost(report.associatedPost)
        const dupPost = { ...newPost }
        newPost.postedBy = 'Blocked User'
  
        await postsService.editPost(report.associatedPost, newPost)

        const subgreddiit = await subgreddiitService.getSubgreddiit(newPost.postedIn)

        const newSub = { ...subgreddiit, followers: subgreddiit.followers.filter(follower => follower !== dupPost.postedBy), blockedUsers: subgreddiit.blockedUsers.concat(dupPost.postedBy) }

        await subgreddiitService.editSubgreddiit(subgreddiit.id, newSub)
      } catch (error) {
        console.log(error)
      }
    } else if (givenVerdict === 'delete') {
      try {
        const post = await postsService.getPost(report.associatedPost)

        const user = await userService.getUser(post.postedBy)
        const newUser = { ...user, savedPosts: user.savedPosts.filter(savedPost => savedPost !== post.title) }
        await userService.editUser(user.email, newUser)
        
        const subgreddiit = await subgreddiitService.getSubgreddiit(post.postedIn)
        
        const newSub = { ...subgreddiit, posts: subgreddiit.posts.filter(post => post !== report.associatedPost) }
        
        await subgreddiitService.editSubgreddiit(subgreddiit.id, newSub)
        
        await postsService.deletePost(post.id)
      } catch (error) {
        console.log(error)
      }
    }
    return response.data
  } catch (error) {
    console.log(error)
  }
}

const getReportsBySubgreddiit = async (name) => {
  try {
    const response = await getAll()
    // console.log(name, response)

    const reports = response.filter(report => {
      return report.postedIn === name
    })
    // console.log(reports)
    return reports
  } catch (error) {
    console.log(error)
  }
}

const deleteReport = async (id) => {
  try {
    const response = await axios.delete(`${baseUrl}/${id}`)
    // const email = await axios.post(`${baseUrl}/${id}`, "deleted")
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export default { getAll, getReport, createReport, changeVerdict, getReportsBySubgreddiit, deleteReport }