import { Button, Card, CardMedia, Grid, Input, List, Slide, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { Suspense, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CurrentUserContext } from "../App"
import genericBg from './genericbg.jpg'

import subgreddiitService from '../services/subgreddiits'

const MySubgreddiits = () => {
  const { currentUser, setCurrentUser, rootUrl } = useContext(CurrentUserContext)

  const [ifNewSub, toogleIfNewSub] = useState(false)
  const [newSubgreddiit, setNewSubgreddiit] = useState(Object.create(null))
  const [subgreddiits, setSubgreddiits] = useState([])
  const [image, setImage] = useState(null)

  const navigate = useNavigate()

  const hook = () => {
    if (localStorage.getItem('signInStatus') === 'false') {
      navigate('/')
    }

    const fetchSubgreddiits = async () => {
      await subgreddiitService.getAll().then(initialSubgreddiits => setSubgreddiits(initialSubgreddiits))
    }
    fetchSubgreddiits()

    const parsedURL = window.location.pathname.split('/')
    setCurrentUser(parsedURL[1])
  }
  useEffect(hook, [])

  const keys = ["name", "description", "tags", "bannedKeywords"]
  const parameters = {
    name: 'Name', description: 'Description', tags: 'Tags', bannedKeywords: 'Banned Keywords'
  }

  const toggleNewSubgreddiit = () => {
    toogleIfNewSub(!ifNewSub)
  }

  const handleParamChange = (event, objKey) => {
    const newlyChanged = newSubgreddiit
    newlyChanged[objKey] = event.target.value
    setNewSubgreddiit(newlyChanged)
  }

  const handleNewSubForm = async (event) => {
    event.preventDefault()
    if (subgreddiits.filter(sub => sub.name === newSubgreddiit.name).length > 0) {
      alert('Subgreddiit already exists!')
      return
    }

    if (newSubgreddiit.tags === undefined || newSubgreddiit.bannedKeywords === undefined) {
      newSubgreddiit.tags = ""
      newSubgreddiit.bannedKeywords = ""
    }

    newSubgreddiit.tags = newSubgreddiit.tags.split(', ')
    newSubgreddiit.bannedKeywords = newSubgreddiit.bannedKeywords.split(', ')

    newSubgreddiit.followers = [currentUser]
    newSubgreddiit.createdBy = currentUser

    await subgreddiitService.createSubgreddiit(newSubgreddiit)
      .then(returnedSubgreddiit => {
        setSubgreddiits(subgreddiits.concat(returnedSubgreddiit))
      })
      .catch(error => console.log(error))

    toogleIfNewSub(false)
  }

  const imageEncoder = (event) => {
    const getBase64 = async () => {
      await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(event.target.files[0])
        reader.onload = () => {
          setNewSubgreddiit({ ...newSubgreddiit, image: reader.result })
        }
      })
    }

    const hmm = async () => {
      await getBase64()
    }

    hmm()
  }

  const handleDeleteSubgreddit = async (event, name) => {
    subgreddiitService.deleteSubgreddiit(name)
      .then(
        setSubgreddiits(subgreddiits.filter(sub => sub.name !== name))
      )
  }

  const openSelectedSub = (name) => {
    navigate(`gr/${name}`)
  }

  const genericBgStyle = {
    height: 0,
    paddingTop: '26.25%',
    marginBottom: '10px',
    borderRadius: '5px',
    backgroundImage: `url(${genericBg})`,
    opacity: '0.5'
  }

  return (
    <div style={{ display: 'flex', align: 'center' }}>

      <Grid height='100%' overflow='auto' sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box marginTop='auto' marginLeft='auto' width='650px'>
          <Suspense fallback={<Typography variant="h1">Loading...</Typography>}>
            {subgreddiits.map(sub => {
              if (sub.createdBy === currentUser) {
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
                        <Typography component='h1' variant="h5">
                          r/{sub.name}
                        </Typography>
                        <Grid marginLeft='auto' display='flex' justifyContent='end'>
                          <Button variant="contained" onClick={() => openSelectedSub(sub.name)}>Open</Button>
                          <Button sx={{ marginLeft: '10px' }} color='error' variant="outlined" onClick={(event) => handleDeleteSubgreddit(event, sub.name)}>Delete</Button>
                        </Grid>
                      </Grid>
                      <br />
                      <Typography marginBottom='5px' component='h1' variant="body1">
                        {sub.description}
                      </Typography>
                      <Typography marginBottom='5px' component='h1' variant="body1">
                        <strong>No. of followers:</strong> {sub.followers.length}
                      </Typography>
                      <Typography marginBottom='5px' component='h1' variant="body1">
                        <strong>No. of posts:</strong> {sub.posts.length}
                      </Typography>
                      <Typography marginBottom='5px' component='h1' variant="body1">
                        <strong>Banned Keywords:</strong> {sub.bannedKeywords[0] === '' ? <em>-None-</em> : sub.bannedKeywords.join(', ')}
                      </Typography>
                    </Card>
                  </div>
                )
              }
            })
            }
          </Suspense>
        </Box>
      </Grid>
      <Grid marginLeft='auto' marginTop='10px' marginRight='25px'>
        <Box width='400px'>
          <Box align='center' marginTop='1px'>
            <Button variant="contained" onClick={toggleNewSubgreddiit}>Create New Subgreddiit</Button>
          </Box>
          <Box marginTop={2}>
            <Slide sx={{ padding: '1rem', borderRadius: '25px', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }} direction="left" in={ifNewSub} mountOnEnter unmountOnExit>
              <Box component='form' onSubmit={event => handleNewSubForm(event)}>
                {keys.map((objKey) => {
                  return (
                    <div key={`${objKey}`}>
                      <Typography component='h1' variant="body1">
                        <TextField
                          variant="outlined"
                          margin="normal"
                          fullWidth
                          required={objKey !== 'tags'}
                          autoFocus={objKey === 'name'}
                          id={objKey}
                          label={parameters[objKey]}
                          name={objKey}
                          autoComplete={objKey}
                          onChange={event => handleParamChange(event, objKey)}
                        />
                      </Typography>
                    </div>
                  )
                })}
                <Box marginTop='16px'>
                  <TextField
                    label="Upload Image"
                    type="file"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={imageEncoder}
                  />
                  {/* <FileBase64 onDone={({ base64 }) => setImage(base64)} /> */}
                </Box>
                <Button sx={{ marginTop: '15px' }} variant="contained" type="submit">Create</Button>
              </Box>
            </Slide>
          </Box>
        </Box>
      </Grid>
      {/* </Grid> */}
    </div>
  )
}

export default MySubgreddiits