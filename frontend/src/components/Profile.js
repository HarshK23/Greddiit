import { useNavigate, useParams } from "react-router-dom"
import { useContext, useEffect, useRef, useState } from "react"
import { Button, Grid, Slide, TextField, Typography } from "@mui/material"

import { Box } from "@mui/system"
import Followers from "./Followers"
import Following from './Following'
import User from "./User"
import userService from '../services/users'
import { CurrentUserContext } from "../App"
import LoadingScreen from "./Loading"

const Profile = ({ users, setUsers, signInStatus }) => {
  const { currentUser, setCurrentUser, rootUrl } = useContext(CurrentUserContext)

  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('signInStatus') === 'false') {
      navigate('/')
    }

    const parsedURL = window.location.pathname.split('/')
    setCurrentUser(parsedURL[1])
  }, [])

  const { userEmail } = useParams()

  const hook = () => {
    const fetchUsers = async () => {
      await userService.getAll().then(initialProfiles => setUsers(initialProfiles))
    }
    fetchUsers()

    setLoading(false)
  }
  useEffect(hook, [])

  const user = users.filter(user => user.email === userEmail)[0]

  const index = users.findIndex(user => user.email === userEmail)

  const [changedUser, setChangedUser] = useState(Object.create(null))
  const [toEdit, setToEdit] = useState(false)
  const [duplicateUserMessage, setDuplicateUserMessage] = useState(null)
  const [toShowFollowers, toggleToShowFollowers] = useState(false)
  const [toShowFollowing, toggleToShowFollowing] = useState(false)

  const containerRef = useRef(null)

  const keys = ["firstName", "lastName", "userName", "email", "age", "contact", "password"]

  const parameters = {
    firstName: 'First Name', lastName: 'Last Name', userName: 'User Name', email: 'Email', age: 'Age', contact: 'Contact', password: 'Password'
  }

  const toggleToEdit = () => {
    setToEdit(!toEdit)
  }

  const handleParamChange = (event, objKey) => {
    const newlyChanged = changedUser
    newlyChanged[objKey] = event.target.value
    newlyChanged.following = user.following
    newlyChanged.followers = user.followers
    setChangedUser(newlyChanged)
    setDuplicateUserMessage(null)
  }

  const handleFollowers = () => {
    toggleToShowFollowers(!toShowFollowers)
  }

  const handleFollowing = () => {
    toggleToShowFollowing(!toShowFollowing)
  }

  const handleProfileChange = async (event, changedUser, index, setToEdit, setChangedUser, setDuplicateUserMessage) => {
    event.preventDefault()
    const duplicateUsers = users.slice()
    duplicateUsers.splice(index, 1)

    if (duplicateUsers.filter(user => user.email === changedUser.email).length !== 0) {
      setDuplicateUserMessage('The user with the given Email already exists')
      return
    }

    userService.editUser(currentUser, changedUser)
      .then(returnedUser => {
        setCurrentUser(returnedUser.email)
        setUsers(users.map(user => user.id !== returnedUser.id ? user : returnedUser))
      })
      .catch(error => {
        console.log(error)
      })

    setDuplicateUserMessage(null)

    const fetchUsers = async () => {
      await userService.getAll().then(initialProfiles => setUsers(initialProfiles))
    }
    console.log(users)
    await fetchUsers()

    const emailUpdate = changedUser.email;
    console.log(emailUpdate)
    navigate(`/${emailUpdate}/profile`)
    setToEdit(false)
    setChangedUser(Object.create(null))
  }

  if (loading || !user) {
    return (
      <LoadingScreen />
    )
  }

  return (
    <>
      <div style={{ display: 'flex', align: 'center' }}>
        <Grid padding='1rem' paddingBottom='0.1rem' border='solid' item marginTop={5} marginBottom={2} marginLeft={2} xs={10} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '400px', borderRadius: '25px', padding: '1rem', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }}>
          <Typography component='h1' variant="h4">{user.userName}</Typography>
          <User user={user} />
          <Button sx={{ maxWidth: '402px', marginTop: '10px' }} variant="contained" onClick={toggleToEdit}>Edit Profile</Button>
          <br />
          <Slide direction="right" in={toEdit} mountOnEnter unmountOnExit>
            <Box component='form' onSubmit={event => handleProfileChange(event, changedUser, index, setToEdit, setChangedUser, setDuplicateUserMessage)}>
              {keys.map((objKey) => {
                if (objKey === 'following' || objKey === 'followers') {
                  return null
                }
                return (
                  <div key={`${objKey}`}>
                    <Typography component='h1' variant="body1">
                      <TextField variant="outlined"
                        margin="normal" autoFocus={objKey === 'firstName'} required fullWidth id={objKey} label={parameters[objKey]} name={objKey} autoComplete={objKey} onChange={event => handleParamChange(event, objKey)} />
                    </Typography>
                  </div>
                )
              })}
              <Typography color='red' className="error">{duplicateUserMessage === null ? null : duplicateUserMessage}</Typography>
              <Box marginBottom='10px'>
                <Button variant="contained" type="submit">Save</Button>
              </Box>
            </Box>
          </Slide>
        </Grid>
        <Box display='flex' justifyContent='center'>
          <Box display='flex' flexDirection='column' width='300px' position='static' marginLeft={10} marginTop={5}>
            <Button width='auto' variant="text" onClick={handleFollowers}>
              <Typography variant="h5">{user.followers.length === 1 ? <>{user.followers.length} Follower</> : <>{user.followers.length} Followers</>}</Typography>
            </Button>
            <Box ref={containerRef}>
              <Slide sx={{ borderRadius: '15px', padding: '0.1rem', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }} container={containerRef.current} direction="down" in={toShowFollowers} mountOnEnter unmountOnExit>
                <Box>
                  <Followers setUsers={setUsers} users={users} user={user} index={index} />
                </Box>
              </Slide>
            </Box>
          </Box>
          <Box display='flex' flexDirection='column' width='300px' position='static' marginLeft={10} marginTop={5}>
            <Button variant="text" onClick={handleFollowing}>
              <Typography variant="h5">{user.following.length} Following</Typography>
            </Button>
            <Box ref={containerRef}>
              <Slide sx={{ borderRadius: '15px', padding: '0.1rem', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }} container={containerRef.current} direction="down" in={toShowFollowing} mountOnEnter unmountOnExit>
                <Box>
                  <Following setUsers={setUsers} users={users} user={user} index={index} />
                </Box>
              </Slide>
            </Box>
          </Box>
        </Box>
      </div>
    </>
  )
}

export default Profile