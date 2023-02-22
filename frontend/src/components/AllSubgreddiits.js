import { Autocomplete, Button, ButtonGroup, Card, CardMedia, Grid, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import Fuse from 'fuse.js'
import { Suspense, useContext, useEffect, useState } from "react"
import genericBg from './genericbg.jpg'

import { CurrentUserContext } from "../App"

import subgreddiitService from '../services/subgreddiits'
import { useNavigate } from "react-router-dom"

const AllSubgreddiits = () => {
  const { currentUser, setCurrentUser, rootUrl } = useContext(CurrentUserContext)

  const [subgreddiits, setSubgreddiits] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [tags, setTags] = useState([])
  const [enteredTags, setEnteredTags] = useState([])
  const [toDisableJoin, setToDisableJoin] = useState(Object.create(null))

  const navigate = useNavigate()

  const hook = () => {
    if (localStorage.getItem('signInStatus') === 'false') {
      navigate('/')
    }

    const parsedURL = window.location.pathname.split('/')
    setCurrentUser(parsedURL[1])

    let tempSubs = []
    let tempTags = []
    let keys = []

    const fetchSubgreddiits = async () => {
      try {
        tempSubs = await subgreddiitService.getAll()
        setSubgreddiits(tempSubs)
        tempSubs.map(subgreddiit => {
          subgreddiit.tags.map(tag => {
            if (!tempTags.includes(tag)) {
              tempTags = tempTags.concat(tag)
            }
          })
          toDisableJoin[subgreddiit.name] = false
        })
        setTags(tempTags)

        keys = Object.keys(toDisableJoin)
        setToDisableJoin(toDisableJoin)
      } catch {
        console.log('error')
      }
    }
    fetchSubgreddiits()
  }
  useEffect(hook, [])

  const fuse = new Fuse(subgreddiits, {
    keys: [
      'name'
    ]
  })

  const results = fuse.search(searchTerm)
  const subgreddiitResults = searchTerm ?
    results.map(result => result.item) :
    enteredTags.length != 0 ?
      subgreddiits.filter(sub => {
        let found = false
        enteredTags.map(tag => {
          if (sub.tags.includes(tag)) {
            found = true
          }
        })
        return found
      }) :
      subgreddiits

  const joinedSubgreddiits = subgreddiitResults.filter(sub => sub.followers.includes(currentUser))
  const notJoinedSubgreddiits = subgreddiitResults.filter(sub => !sub.followers.includes(currentUser))
  const subgreddiitResultsCopy = [...joinedSubgreddiits, ...notJoinedSubgreddiits]

  const handleLeave = async (name) => {
    try {
      const recievedSub = await subgreddiitService.leaveSubgreddiit(name, currentUser)
      const bruh = subgreddiits.slice()
      const index = bruh.findIndex(sub => sub.name === name)
      bruh[index] = recievedSub
      setSubgreddiits(bruh)
    } catch (error) {
      console.log(error)
    }
  }

  const handleJoin = async (name) => {
    try {
      const concernedSub = subgreddiits.find(sub => sub.name === name)

      if (concernedSub.blacklisted.includes(currentUser)) {
        alert('You can not join this subgreddiit after leaving it')
        return
      }

      const recievedSub = await subgreddiitService.joinSubgreddiit(name, currentUser)

      const bruh = subgreddiits.slice()
      const index = bruh.findIndex(sub => sub.name === name)
      bruh[index] = recievedSub
      setSubgreddiits(bruh)

      const copyDisable = { ...toDisableJoin }
      copyDisable[name] = true
      setToDisableJoin(copyDisable)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div style={{ display: 'flex', align: 'center' }}>
      <Grid height='100%' overflow='auto' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box marginTop='20px' marginLeft='20px' width='700px'>
          <Suspense fallback={<Typography variant="h1">Loading...</Typography>}>
            {subgreddiitResultsCopy.map(sub => {
              if (!sub) {
                return <h1>loading</h1>
              }
              return (
                <div key={sub.name}>
                  <Card key={sub.name} sx={{ margin: '10px', padding: '10px', borderRadius: '15px', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }}>
                    <CardMedia
                      style={{ height: 0, paddingTop: '26.25%', marginBottom: '10px', borderRadius: '5px' }}
                      image={sub.image || genericBg}
                      opacity={0.05}
                      title="Subgreddiit"
                    />
                    <Grid container>
                      <Typography component='h1' variant="h5" style={{cursor: 'pointer'}} onClick={() => navigate(`/${currentUser}/allsubgreddiits/gr/${sub.name}`)}>
                        r/{sub.name}
                      </Typography>
                      <Grid marginLeft='auto' display='flex' justifyContent='end'>
                        {sub.followers.includes(currentUser) ?
                            <Button variant="contained" disabled={sub.createdBy === currentUser} color="error" onClick={() => handleLeave(sub.name)}>Leave</Button>
                            : 
                            <Button variant="contained" onClick={() => handleJoin(sub.name)} disabled={toDisableJoin[sub.name] || sub.joinRequests.includes(currentUser)}>{sub.joinRequests.includes(currentUser) ? 'Request Sent' : 'Join'}</Button>}
                        {/* <Button variant="contained" onClick={() => openSelectedSub(sub.name)}>Open</Button>
                        <Button sx={{ marginLeft: '10px' }} color='error' variant="outlined" onClick={(event) => handleDeleteSubgreddit(event, sub.name)}>Delete</Button> */}
                      </Grid>
                    </Grid>
                    <br />
                    <Typography marginBottom='5px' component='h1' variant="body1" style={{cursor: 'pointer'}} onClick={() => navigate(`/${currentUser}/allsubgreddiits/gr/${sub.name}`)}>
                      {sub.description}
                    </Typography>
                    <Typography marginBottom='5px' component='h1' variant="body1" style={{cursor: 'pointer'}} onClick={() => navigate(`/${currentUser}/allsubgreddiits/gr/${sub.name}`)}>
                      <strong>No. of followers:</strong> {sub.followers.length}
                    </Typography>
                    <Typography marginBottom='5px' component='h1' variant="body1" style={{cursor: 'pointer'}} onClick={() => navigate(`/${currentUser}/allsubgreddiits/gr/${sub.name}`)}>
                      <strong>No. of posts:</strong> {sub.posts.length}
                    </Typography>
                    <Typography marginBottom='5px' component='h1' variant="body1" style={{cursor: 'pointer'}} onClick={() => navigate(`/${currentUser}/allsubgreddiits/gr/${sub.name}`)}>
                      <strong>Banned Keywords:</strong> {sub.bannedKeywords[0] === '' ? <em>-None-</em> : sub.bannedKeywords.join(', ')}
                    </Typography>
                  </Card>
                </div>
              )
            })
            }
          </Suspense>
        </Box>
      </Grid>
      <Grid width='350px' marginLeft='auto' marginRight='40px' marginTop='30px'>
        <Card>
          <Box display='flex' marginTop='5px' justifyContent='center'>
            <Typography variant='h6'>SEARCH AND FILTER</Typography>
          </Box>
          <Grid display='flex' flexDirection='column' justifyContent='center'>
            <Box mx='10px' >
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="search"
                label="Search for a subgreddiit"
                name="search"
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                autoComplete="search" />
            </Box>
            <Box my='5px' justifyContent='center' mx='10px'>
              <Autocomplete
                multiple
                options={tags}
                onChange={(event, value) => setEnteredTags(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Filter by tags"
                    placeholder="Tags"
                  />
                )}
              ></Autocomplete>
            </Box>
            <Box my='5px' justifyContent='center' mx='10px'>
              <ButtonGroup color="primary" aria-label="sort options">
                <Button>Sort by Name</Button>


              </ButtonGroup>
            </Box>
              <Button onClick={() => console.log(subgreddiitResultsCopy)}>mgh</Button>
          </Grid>
        </Card>
      </Grid>
      {/* </Grid> */}
    </div>
  )
}

export default AllSubgreddiits