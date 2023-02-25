import { Box, Button, Card, CardMedia, Grid, Typography } from "@mui/material"
import { Suspense, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CurrentUserContext } from "../App"
import genericBg from './genericbg.jpg'

import subgreddiitService from '../services/subgreddiits'
import postService from '../services/posts'
import userService from '../services/users'
import reportService from '../services/reports'
import NewPost from "./NewPost"
import Report from "./Report"

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const SubgreddiitInfo = () => {
  const { currentUser, setCurrentUser, rootUrl } = useContext(CurrentUserContext)

  const [currentSubgreddiit, setCurrentSubgreddiit] = useState(window.location.pathname.split('/')[4])
  const [currentSubgreddiitObj, setCurrentSubgreddiitObj] = useState(Object.create(null))
  const [ifNewPost, setIfNewPost] = useState(false)
  const [ifReport, setIfReport] = useState(false)
  const [subPosts, setSubPosts] = useState([])
  const [upvoted, setUpvoted] = useState(Object.create(null))
  const [downvoted, setDownvoted] = useState(Object.create(null))
  const [saved, setSaved] = useState(Object.create(null))
  const [followed, setFollowed] = useState(Object.create(null))
  const [reported, setReported] = useState(Object.create(null))
  const [currentUserObj, setCurrentUserObj] = useState(Object.create(null))
  const [allReports, setAllReports] = useState([])

  const [currentPost, setCurrentPost] = useState(Object.create(null))

  const navigate = useNavigate()

  const hook = () => {
    if (localStorage.getItem('signInStatus') === 'false') {
      navigate('/')
    }
    setCurrentSubgreddiit(window.location.pathname.split('/')[4])

    let tempSub = {}
    let keys = []

    const parsedURL = window.location.pathname.split('/')
    setCurrentUser(parsedURL[1])

    const fetchSubgreddiit = async () => {
      try {
        tempSub = await subgreddiitService.getSubgreddiit(currentSubgreddiit)
        setCurrentSubgreddiitObj(tempSub)

        await postService.getPostsBySubgreddiit(currentSubgreddiit)
          .then(posts => {
            setSubPosts(posts)
            posts.map(post => {
              upvoted[post.title] = false
              downvoted[post.title] = false
              saved[post.title] = false
              reported[post.title] = false
              if (followed[post.postedBy] === undefined) {
                followed[post.postedBy] = false
              }
            })
            keys = Object.keys(upvoted)
            setUpvoted(upvoted)
            setDownvoted(downvoted)
            setSaved(saved)
            setFollowed(followed)
            setReported(reported)
          })

        await reportService.getAll().then(reports => {
          setAllReports(reports)
        })
      } catch (error) {
        console.log(error)
      }
    }
    fetchSubgreddiit()

    const fetchUser = async () => {
      try {
        const user = await userService.getUser(parsedURL[1])
        setCurrentUserObj(user)
      } catch (error) {
        console.log(error)
      }
    }
    fetchUser()

  }
  useEffect(hook, [])

  const handleNewPost = async (newPostDetails) => {
    try {
      let ifCensored = false

      if (currentSubgreddiitObj.bannedKeywords[0] !== '') {
        currentSubgreddiitObj.bannedKeywords.forEach(element => {
          if (newPostDetails.title.toLowerCase().includes(element.toLowerCase())) {
            let splitTitle = newPostDetails.title.split(" ")
            const censoredArr = splitTitle.map(word => {
              if (word.toLowerCase().includes(element.toLowerCase())) {
                return '****'
              } else {
                return word
              }
            })
            const brh = censoredArr.join(" ")
            newPostDetails.title = brh
            ifCensored = true
          }
          if (newPostDetails.text.toLowerCase().includes(element.toLowerCase())) {
            let splitText = newPostDetails.text.split(" ")
            const censoredArr = splitText.map(word => {
              if (word.toLowerCase().includes(element.toLowerCase())) {
                return '****'
              } else {
                return word
              }
            })
            const brh = censoredArr.join(" ")
            newPostDetails.text = brh
            ifCensored = true
          }
        });
      }

      await postService.createPost(newPostDetails)
        .then(post => {
          console.log(post)
          setSubPosts(subPosts.concat(post))
          upvoted[post.title] = false
          downvoted[post.title] = false
        })
      setIfNewPost(false)
      if (ifCensored) {
        alert('Your post contains a banned keyword, and will be censored.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpvote = async (post) => {
    try {
      if (upvoted[post.title] === false) {
        const newPost = { ...post, upvotes: post.upvotes + 1 }
        await postService.editPost(post.title, newPost)
        setSubPosts(subPosts.map((p) => p.title === post.title ? newPost : p))

        const updatedUpvoted = { ...upvoted }
        updatedUpvoted[post.title] = true
        setUpvoted(updatedUpvoted)
      }
      else {
        const newPost = { ...post, upvotes: post.upvotes - 1 }
        await postService.editPost(post.title, newPost)
        setSubPosts(subPosts.map((p) => p.title === post.title ? newPost : p))
        const updatedUpvoted = { ...upvoted }
        updatedUpvoted[post.title] = false
        setUpvoted(updatedUpvoted)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDownvote = async (post) => {
    try {
      if (downvoted[post.title] === false) {
        const newPost = { ...post, downvotes: post.downvotes + 1 }
        await postService.editPost(post.title, newPost)
        setSubPosts(subPosts.map((p) => p.title === post.title ? newPost : p))
        const updatedDownvoted = { ...downvoted }
        updatedDownvoted[post.title] = true
        setDownvoted(updatedDownvoted)
      }
      else {
        const newPost = { ...post, downvotes: post.downvotes - 1 }
        await postService.editPost(post.title, newPost)
        setSubPosts(subPosts.map((p) => p.title === post.title ? newPost : p))
        const updatedDownvoted = { ...downvoted }
        updatedDownvoted[post.title] = false
        setDownvoted(updatedDownvoted)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSave = async (post) => {
    try {
      const newCurrentUserObj = await userService.manageSavedPosts(currentUser, post.title, 'save')
      setCurrentUserObj(newCurrentUserObj)

      const updatedSaved = { ...saved }
      updatedSaved[post.title] = true
      setSaved(updatedSaved)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFollow = async (post) => {
    try {
      const newUser = { ...currentUserObj, following: currentUserObj.following.concat(post.postedBy) }
      const updatedUser = await userService.editUser(currentUserObj.email, newUser)
      setCurrentUserObj(updatedUser)

      const updatedFollowed = { ...followed }
      updatedFollowed[post.postedBy] = true
      setFollowed(updatedFollowed)
    } catch (error) {
      console.log(error)
    }
  }

  const handleNewReport = async (reportDetails) => {
    try {
      const report = await reportService.createReport(reportDetails)
      setIfReport(false)

      const updatedReported = { ...reported }
      updatedReported[reportDetails.postTitle] = true
      setReported(updatedReported)
      setAllReports(allReports.concat(report))
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Grid display='flex'>
      <Grid>
        <Card style={{ margin: '35px', borderRadius: '15px', maxHeight: 'auto' }}>
          <Box margin='15px' width='650px'>
            <Card sx={{ margin: '10px', padding: '10px', borderRadius: '5px', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }}>
              <CardMedia
                style={{ height: 0, paddingTop: '26.25%', marginBottom: '10px', borderRadius: '5px' }}
                image={currentSubgreddiitObj.image || genericBg}
                title='Subgreddiit'
              />
              <Grid container>
                <Typography component='h1' variant="h5">
                  r/{currentSubgreddiitObj.name}
                </Typography>
              </Grid>
              <br />
              <Typography marginBottom='5px' component='h1' variant="body1">
                {currentSubgreddiitObj.description}
              </Typography>
            </Card>
            <Box margin='15px' sx={{ marginBottom: '5px' }} display='flex' justifyContent='center'>
              {currentSubgreddiitObj.followers && currentSubgreddiitObj.followers.includes(currentUser) ?
                <Button variant="contained" onClick={() => setIfNewPost(true)}>Create new post</Button> :
                <Button variant="contained" onClick={() => setIfNewPost(true)} disabled>Create new post</Button>
              }
            </Box>
          </Box>
        </Card>
      </Grid>
      <NewPost ifNewPost={ifNewPost} setIfNewPost={setIfNewPost} currentUser={currentUser} currentSubgreddiit={currentSubgreddiit} handleNewPost={handleNewPost} />
      <Grid display='flex'>
        <Box marginTop='35px' width='700px' sx={{ borderRadius: '15px', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }}>
          <Box display='flex' justifyContent='center' my='5px'>
            <Typography component='h1' variant="h4">POSTS</Typography>
          </Box>
          <Box display='flex' justifyContent='center' my='5px'>
            <Box width='85%'>
              {subPosts && subPosts.map((post) => {
                return (
                  <Card key={post.title} sx={{ width: '100%', padding: '10px', my: '6px', display: 'flex' }}>
                    <Box>
                      <Typography component='h1' variant="h5">
                        {post.title}
                      </Typography>
                      <Typography marginTop='5px' component='h1' variant="body2">
                        Posted by u/{post.postedBy} {/*moment(post.date).fromNow()*/}
                      </Typography>
                      <Typography marginTop='10px' component='h1' variant="body1">
                        {post.text}
                      </Typography>
                    </Box>
                    <Box marginLeft='auto'>
                      <Box display='flex' justifyContent='end' marginBottom='5px'>
                        <Button startIcon={<ThumbUpIcon />} disabled={downvoted[post.title] || !currentSubgreddiitObj.followers.includes(currentUser)} onClick={() => handleUpvote(post)}>{post.upvotes}</Button>
                        <Button startIcon={<ThumbDownIcon />} disabled={upvoted[post.title] || !currentSubgreddiitObj.followers.includes(currentUser)} onClick={() => handleDownvote(post)}>{post.downvotes}</Button>
                        <Button sx={{ marginLeft: '3px' }} color="error" variant="outlined" disabled={!currentSubgreddiitObj.followers.includes(currentUser) || allReports.includes(allReports.find(report => report.reportedBy === currentUser && report.associatedPost === post.title))} onClick={() => {setIfReport(true);setCurrentPost(post)}}>{allReports.includes(allReports.find(report => report.reportedBy === currentUser && report.associatedPost === post.title)) ? 'Reported' : 'Report'}</Button>
                      </Box>
                      <Box display='flex' justifyContent='end'>
                        <Button variant="contained" disabled={!currentSubgreddiitObj.followers.includes(currentUser) || currentUserObj.savedPosts.includes(post.title)} onClick={() => handleSave(post)}>{currentUserObj.savedPosts.includes(post.title) ? 'Saved' : 'Save Post'}</Button>
                        <Button sx={{ marginLeft: '5px' }} variant="contained" disabled={!currentSubgreddiitObj.followers.includes(currentUser) || currentUserObj.following.includes(post.postedBy) || currentUser === post.postedBy} onClick={() => handleFollow(post)}>{currentUserObj.following.includes(post.postedBy) ? 'Followed' : 'Follow'}</Button>
                      </Box>
                    </Box>
                  </Card>
                )
              })
              }
              <Report ifReport={ifReport} setIfReport={setIfReport} currentUser={currentUser} currentSubgreddiit={currentSubgreddiit} handleNewReport={handleNewReport} currentPost={currentPost} />
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default SubgreddiitInfo