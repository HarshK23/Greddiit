import { Link, useLocation, useNavigate } from 'react-router-dom'
import { React, useContext, useEffect, useState } from 'react'
import { AppBar, Button, CssBaseline, IconButton, Toolbar, Typography } from '@mui/material'
import logo from './clone.png'
import { Box } from '@mui/system'

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FeedIcon from '@mui/icons-material/Feed';

import { ThemeContext } from '../App.js'
import { CurrentUserContext } from '../App.js'
import './NavBar.css'

const NavBar = ({ theme }) => {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext)

  const [currentLocation, setCurrentLocation] = useState(useLocation().pathname)

  useEffect(() => {
    setCurrentLocation(window.location.pathname)
  }, [window.location.pathname])

  const navigate = useNavigate()

  const themeMode = useContext(ThemeContext)
  const handleLogout = () => {
    localStorage.setItem('signInStatus', 'false')
    setCurrentUser('')
    navigate('/')
  }

  const navigateTo = (path) => {
    if (window.location.pathname !== `/${currentUser}/${path}`
      || window.location.pathname !== `/${currentUser}/${path}/`) {
      navigate(`${currentUser}/${path}`)
    }
  }


  return (
    <AppBar position='static'>
      <CssBaseline />
      <Toolbar>
        <Link to='/'>
          <Box sx={{ height: 50 }} marginTop={1} component='img' src={logo} alt='Home'></Box>
        </Link>
        <Typography color='white' marginLeft={2} fontFamily='sans-serif' variant='h3'><em>GREDDIIT</em></Typography>
        <Box marginLeft='auto'>
          {/* <Button onClick={() => console.log(currentUser)} color='inherit'>Current User</Button> */}
          {window.location.pathname !== '/'
            ?
            <>
              <Button onClick={() => console.log(currentUser)}>current user</Button>
              <Button sx={{ marginRight: 'auto', marginLeft: 'auto' }} startIcon={<AccountBoxIcon />} onClick={() => navigateTo('profile')} color='inherit'>Profile</Button>
              <Button sx={{ marginRight: 'auto', marginLeft: 'auto' }} startIcon={<FeedIcon />} onClick={() => navigateTo('mysubgreddiits')} color='inherit'>My Subgreddiits</Button>
            </>
            : null}
          {window.location.pathname !== '/'
            ?
            theme.palette.mode === 'dark' ?
              <Button
                style={{ marginRight: '10px' }}
                variant='outlined'
                onClick={handleLogout}
              >
                Logout
              </Button> :
              <Button className='hoverButton'
                style={{ marginRight: '10px', color: "white", borderColor: "white" }}
                variant='outlined'
                onClick={handleLogout}
              >
                Logout
              </Button>
            : null}
          <IconButton onClick={themeMode.toggleThemeMode} color='inherit'>{theme.palette.mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}</IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default NavBar