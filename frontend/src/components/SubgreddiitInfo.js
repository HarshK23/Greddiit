import { Box, Button, Card, CardMedia, Grid, Typography } from "@mui/material"
import { Suspense, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CurrentUserContext } from "../App"
import genericBg from './genericbg.jpg'

import subgreddiitService from '../services/subgreddiits'
import postService from '../services/posts'
import NewPost from "./NewPost"

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const SubgreddiitInfo = () => {
  const { currentUser, setCurrentUser, rootUrl } = useContext(CurrentUserContext)

  const [currentSubgreddiit, setCurrentSubgreddiit] = useState(window.location.pathname.split('/')[4])
  const [currentSubgreddiitObj, setCurrentSubgreddiitObj] = useState(Object.create(null))
  const [ifNewPost, setIfNewPost] = useState(false)
  const [subPosts, setSubPosts] = useState([])
  const [upvoted, setUpvoted] = useState(Object.create(null))
  const [downvoted, setDownvoted] = useState(Object.create(null))

  const navigate = useNavigate()

  const hook = () => {
    if (localStorage.getItem('signInStatus') === 'false') {
      navigate('/')
    }
    setCurrentSubgreddiit(window.location.pathname.split('/')[4])

    let tempSub = {}
    let keys = []

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
            })
            keys = Object.keys(upvoted)
            setUpvoted(upvoted)
            setDownvoted(downvoted)
          })
      } catch (error) {
        console.log(error)
      }
    }
    fetchSubgreddiit()

    const parsedURL = window.location.pathname.split('/')
    setCurrentUser(parsedURL[1])
  }
  useEffect(hook, [])

  const handleNewPost = async (newPostDetails) => {
    try {
      await postService.createPost(newPostDetails)
        .then(post => {
          setSubPosts(subPosts.concat(post))
          upvoted[post.title] = false
          downvoted[post.title] = false
        })
      setIfNewPost(false)
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
              {subPosts.map((post) => {
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
                      </Box>
                      <Box display='flex' justifyContent='center'>
                        <Button variant="contained" disabled={!currentSubgreddiitObj.followers.includes(currentUser)}>Save Post</Button>
                        <Button sx={{ marginLeft: '5px' }} variant="contained" disabled={!currentSubgreddiitObj.followers.includes(currentUser)}>Follow</Button>
                      </Box>
                    </Box>
                  </Card>
                )
              })
              }
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default SubgreddiitInfo