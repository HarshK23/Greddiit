import { Box, Button, Card, Grid, Typography } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CurrentUserContext } from "../App"

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

import userService from "../services/users"
import postService from "../services/posts"

const SavedPosts = () => {
  const { currentUser, setCurrentUser, rootUrl } = useContext(CurrentUserContext)
  const [currentUserObj, setCurrentUserObj] = useState(Object.create(null))
  const [savedPosts, setSavedPosts] = useState([])
  const [upvoted, setUpvoted] = useState(Object.create(null))
  const [downvoted, setDownvoted] = useState(Object.create(null))
  const [followed, setFollowed] = useState(Object.create(null))

  const navigate = useNavigate()

  const hook = () => {
    if (localStorage.getItem('signInStatus') === 'false') {
      navigate('/')
    }

    const parsedURL = window.location.pathname.split('/')
    setCurrentUser(parsedURL[1])

    const fetchSavedPosts = async () => {
      const hmm = await userService.getUser(parsedURL[1])
      setCurrentUserObj(hmm)

      await postService.getSavedPosts(hmm).then(
        posts => {
          setSavedPosts(posts)

          posts.map(post => {
            upvoted[post.title] = false
            downvoted[post.title] = false
            if (followed[post.postedBy] === undefined) {
              followed[post.postedBy] = false
            }
          })
          setUpvoted(upvoted)
          setDownvoted(downvoted)
          setFollowed(followed)
        }
      )
    }
    fetchSavedPosts()
  }
  useEffect(hook, [])

  const handleRemove = async (post) => {
    try {
      const changedUser = await userService.manageSavedPosts(currentUser, post.title, 'remove')

      setCurrentUserObj(changedUser)
      setSavedPosts(savedPosts.filter(hmm => hmm.title !== post.title))
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpvote = async (post) => {
    try {
      if (upvoted[post.title] === false) {
        const newPost = { ...post, upvotes: post.upvotes + 1 }
        await postService.editPost(post.title, newPost)
        setSavedPosts(savedPosts.map((p) => p.title === post.title ? newPost : p))

        const updatedUpvoted = { ...upvoted }
        updatedUpvoted[post.title] = true
        setUpvoted(updatedUpvoted)
      }
      else {
        const newPost = { ...post, upvotes: post.upvotes - 1 }
        await postService.editPost(post.title, newPost)
        setSavedPosts(savedPosts.map((p) => p.title === post.title ? newPost : p))

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
        setSavedPosts(savedPosts.map((p) => p.title === post.title ? newPost : p))

        const updatedDownvoted = { ...downvoted }
        updatedDownvoted[post.title] = true
        setDownvoted(updatedDownvoted)
      }
      else {
        const newPost = { ...post, downvotes: post.downvotes - 1 }
        await postService.editPost(post.title, newPost)
        setSavedPosts(savedPosts.map((p) => p.title === post.title ? newPost : p))

        const updatedDownvoted = { ...downvoted }
        updatedDownvoted[post.title] = false
        setDownvoted(updatedDownvoted)
      }
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

  return (
    <div style={{ display: 'flex', align: 'center' }}>
      <Grid display='flex' marginLeft='35px'>
        <Box marginTop='35px' width='700px' sx={{ borderRadius: '15px', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }}>
          <Box display='flex' justifyContent='center' my='5px'>
            <Typography component='h1' variant="h4">SAVED POSTS</Typography>
          </Box>
          <Box display='flex' justifyContent='center' my='5px'>
            <Box width='85%'>
              {savedPosts && savedPosts.map(post => {
                return (
                  <Card key={post.title} sx={{ width: '100%', padding: '10px', my: '6px', display: 'flex' }}>
                    <Box>
                      <Typography component='h1' variant="h5">
                        {post.title}
                      </Typography>
                      <Typography marginTop='5px' component='h1' variant="body2">
                        Posted by u/{post.postedBy} {/*moment(post.date).fromNow()*/}
                      </Typography>
                      <Typography marginTop='5px' component='h1' variant="body2">
                        Posted in gr/{post.postedIn} {/*moment(post.date).fromNow()*/}
                      </Typography>
                      <Typography marginTop='10px' component='h1' variant="body1">
                        {post.text}
                      </Typography>
                    </Box>
                    <Box marginLeft='auto'>
                      <Box display='flex' justifyContent='end' marginBottom='5px'>
                        <Button startIcon={<ThumbUpIcon />} disabled={downvoted[post.title]} onClick={() => handleUpvote(post)}>{post.upvotes}</Button>
                        <Button startIcon={<ThumbDownIcon />} disabled={upvoted[post.title]} onClick={() => handleDownvote(post)}>{post.downvotes}</Button>
                      </Box>
                      <Box display='flex' justifyContent='end' marginBottom='5px'>
                        <Button color='error' variant='contained' onClick={() => handleRemove(post)}>Remove</Button>
                        <Button sx={{ marginLeft: '5px' }} variant="contained" disabled={currentUserObj.following.includes(post.postedBy) || currentUser === post.postedBy} onClick={() => handleFollow(post)}>{currentUserObj.following.includes(post.postedBy) ? 'Followed' : 'Follow'}</Button>
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
    </div >
  )
}

export default SavedPosts