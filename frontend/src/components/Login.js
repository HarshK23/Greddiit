import { Button, Grid, TextField, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router"

import { CurrentUserContext } from "../App"
import { GoogleLogin } from "@react-oauth/google"

import jwt_decode from "jwt-decode"

import userService from '../services/users'
import postsService from '../services/posts'
import subgreddiitsService from '../services/subgreddiits'
import loginService from '../services/login'

const SignIn = ({ users, setUsers, setSignInStatus }) => {
  const { currentUser, setCurrentUser, rootUrl } = useContext(CurrentUserContext)

  const [ifSignUp, toggleIfSignUp] = useState(false)

  const [enteredSignInDetails, setEnteredSignInDetails] = useState(['', ''])
  const [enteredSignUpDetails, setEnteredSignUpDetails] = useState({ firstName: '', lastName: '', userName: '', email: '', age: '', contact: '', password: '' })

  const navigate = useNavigate();

  const hook = () => {
    if (localStorage.getItem('signInStatus') === 'true') {
      navigate(`${currentUser}`)
    }

    const fetchUsers = async () => {
      await userService.getAll().then(initialProfiles => setUsers(initialProfiles))
    }
    fetchUsers()
  }

  useEffect(hook, [])

  const parameters = {
    firstName: 'First Name', lastName: 'Last Name', userName: 'User Name', email: 'Email', age: 'Age', contact: 'Contact', password: 'Password'
  }

  const keys = ["firstName", "lastName", "userName", "email", "age", "contact", "password"]

  const handleSignInToggle = () => {
    toggleIfSignUp(!ifSignUp)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const enteredEmail = enteredSignInDetails[0]
      const enteredPassword = enteredSignInDetails[1]

      const hmm = await loginService.login({
        enteredEmail, enteredPassword,
      })

      setCurrentUser(hmm.user.email)
      setEnteredSignInDetails(['', ''])
      localStorage.setItem('userToken', hmm.token)
      localStorage.setItem('signInStatus', 'true')
      navigate(`/${hmm.user.email}`)
    } catch (exception) {
      alert('Wrong credentials')
    }
  }

  const handleSignUp = async (event) => {
    event.preventDefault()

    if (users.map(user => user.email).includes(enteredSignUpDetails.email)) {
      alert('Email already exists')
      return
    }

    const anotherDetails = enteredSignUpDetails
    anotherDetails.followers = []
    anotherDetails.following = []
    anotherDetails.savedPosts = []

    await userService.createUser(anotherDetails)
      .then(returnedUser => {
        setUsers(users.concat(returnedUser))
      })
      .catch(error => {
        console.log(error)
      })

    setCurrentUser(anotherDetails.email)

    setEnteredSignUpDetails({ firstName: '', lastName: '', userName: '', email: '', age: '', contact: '', password: '' })

    localStorage.setItem('signInStatus', 'true')

    navigate(`/${enteredSignUpDetails.email}`)
  }

  const handleEnteredSignInDetails = (event, param) => {
    if (param === 0) {
      const duplicateSignInDetails = enteredSignInDetails.slice()
      duplicateSignInDetails[0] = event.target.value
      setEnteredSignInDetails(duplicateSignInDetails)
    }
    if (param === 1) {
      const duplicateSignInDetails = enteredSignInDetails.slice()
      duplicateSignInDetails[1] = event.target.value
      setEnteredSignInDetails(duplicateSignInDetails)
    }
  }

  const handleSigUpDetails = (event, objKey) => {
    const duplicateSignUpDetails = { ...enteredSignUpDetails }
    duplicateSignUpDetails[objKey] = event.target.value
    setEnteredSignUpDetails(duplicateSignUpDetails)
  }

  const handleGoogleSuccess = async (res) => {
    const result = jwt_decode(res?.credential)
    console.log(result)
    const token = res?.credential

    try {
      setCurrentUser(result.email)
      setEnteredSignInDetails(['', ''])
      localStorage.setItem('currentUser', result.email)
      localStorage.setItem('signInStatus', 'true')
      navigate(`/${result.email}`)
    } catch (exception) {
      alert('Wrong credentials')
    }
  }

  const handleGoogleError = (error) => {
    console.log(error)
  }

  return (
    <>
      {!ifSignUp ?
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h2">Sign in</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end', marginTop: '50px', marginRight: '130px' }}>
            <Box sx={{ border: 'solid', borderRadius: '25px', padding: '1rem', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }} marginTop={5} width='400px'>
              Email: <TextField fullWidth onChange={event => handleEnteredSignInDetails(event, 0)} />
              <br /><br />
              Password: <TextField type='password' fullWidth onChange={event => handleEnteredSignInDetails(event, 1)} />
              <br /><br />
              <Grid container>
                <Grid item sx={{ display: 'flex', flexDirection: 'row' }}>
                  <Button sx={{width: '50%'}} disabled={enteredSignInDetails[0] === '' || enteredSignInDetails[1] === ''} xs={6} variant="contained" onClick={handleLogin}>Sign in</Button>
                  <GoogleLogin
                    render={renderProps => (
                      <Button onClick={renderProps.onClick} disabled={renderProps.disabled} variant="contained" sx={{ marginTop: '10px' }}>Sign in with Google</Button>
                    )}
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                  />
                </Grid>
                <Grid item marginLeft='auto'>
                  <Button variant="text" onClick={handleSignInToggle}>Sign up for a new account</Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </> :
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h2">Sign up</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'end', marginTop: '50px', marginRight: '200px' }}>
            <Box sx={{ border: 'solid', borderRadius: '25px', padding: '1rem', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }} marginTop={5} width='400px'>
              {keys.map((objKey) => {
                if (objKey === 'following' || objKey === 'followers' || objKey === 'savedPosts') {
                  return null
                }
                return (
                  <div key={`${objKey}`}>
                    <Typography component='h1' variant="body1">
                      {parameters[objKey]}: <TextField inputProps={{ style: { height: '10px' } }} fullWidth onChange={event => handleSigUpDetails(event, objKey)} />
                      <br /><br />
                    </Typography>
                  </div>
                )
              })}
              <Grid container>
                <Grid item sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Button disabled={keys.map(parameter => enteredSignUpDetails[parameter] === '').includes(true)} xs={6} variant="contained" onClick={handleSignUp}>Sign up</Button>
                </Grid>
                <Grid item marginLeft='auto'>
                  <Button variant="text" onClick={handleSignInToggle}>Sign in to an existing account</Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </>}
    </>
  )
}

export default SignIn