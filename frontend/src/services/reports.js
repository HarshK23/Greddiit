import axios from 'axios'
import postsService from './posts'
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

const changeVerdict = async (id, givenVerdict) => {
  try {
    const report = await getReport(id)
    // const email = await axios.post(`${baseUrl}/${id}`, {givenVerdict: givenVerdict})
    const newReport = { ...report, verdict: givenVerdict }

    const response = await axios.put(`${baseUrl}/${id}`, newReport)

    if (givenVerdict === "blocked") {
      try {
        const newPost = await postsService.getPost(report.associatedPost)
        console.log(newPost)
        newPost.postedBy = 'Blocked User'
  
        await postsService.editPost(report.associatedPost, newPost)
      } catch (error) {
        console.log(error)
      }
    }

    console.log(response.data)
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
    const email = await axios.post(`${baseUrl}/${id}`, "deleted")
    console.log(response)
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export default { getAll, getReport, changeVerdict, getReportsBySubgreddiit, deleteReport }