import { AppBar, Button, Card, Grid, List, ListItem, ListItemText, Toolbar, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

import { CurrentUserContext } from "../App"
import Users from './modTools/users'
import JoinRequests from "./modTools/joinRequests"
import Reports from "./modTools/reports"
import subgreddiitService from '../services/subgreddiits'
import Stats from "./modTools/stats"

const ModSubgreddiit = () => {
  const [currentSubgreddiit, setCurrentSubgreddiit] = useState(window.location.pathname.split('/')[4])
  const [subgreddiits, setSubgreddiits] = useState([])
  const [currentSubgreddiitObj, setCurrentSubgreddiitObj] = useState(Object.create(null))
  const { currentUser, setCurrentUser, rootUrl } = useContext(CurrentUserContext)
  const navigate = useNavigate()

  const [currentLocation, setCurrentLocation] = useState(useLocation().pathname)
  useEffect(() => {
    setCurrentLocation(window.location.pathname)
  }, [window.location.pathname])

  const hook = () => {
    if (localStorage.getItem('signInStatus') === 'false') {
      navigate('/')
    }
    setCurrentSubgreddiit(window.location.pathname.split('/')[4])

    const fetchSubgreddiit = async () => {
      await subgreddiitService.getSubgreddiit(currentSubgreddiit).then(sub => {
        setCurrentSubgreddiitObj(sub)
      })
    }
    fetchSubgreddiit()

    const parsedURL = window.location.pathname.split('/')
    setCurrentUser(parsedURL[1])
  }
  useEffect(hook, [])

  const toolNavigation = (tool) => {
    if (window.location.pathname !== `/${currentUser}/mysubgreddiits/gr/${currentSubgreddiit}/${tool}`
      || window.location.pathname !== `/${currentUser}/mysubgreddiits/gr/${currentSubgreddiit}/${tool}/`) {
      navigate(`/${currentUser}/mysubgreddiits/gr/${currentSubgreddiit}/${tool}`)
    }
  }

  return (
    <div>
      {/* <Button onClick={() => console.log(window.location.pathname)}>path</Button> */}
      <Grid display='flex'>
        <Box margin='35px'>
          {window.location.pathname.split('/')[5] === 'users'
            ? <Users currentSubgreddiitObj={currentSubgreddiitObj} />
            : window.location.pathname.split('/')[5] === 'joinRequests'
            ? <JoinRequests currentSubgreddiitObj={currentSubgreddiitObj} setCurrentSubgreddiitObj={setCurrentSubgreddiitObj} />
            : window.location.pathname.split('/')[5] === 'stats'
            ? currentSubgreddiitObj && <Stats currentSubgreddiit={currentSubgreddiit} />
            : window.location.pathname.split('/')[5] === 'reports'
            ? currentSubgreddiitObj && <Reports currentSubgreddiitObj={currentSubgreddiitObj} />
            : null
          }
        </Box>
        <Box marginLeft='auto'>
          <Card sx={{ margin: '15px', padding: '10px', borderRadius: '5px', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }}>
            <Box marginBottom='2px' display='flex' justifyContent='center'>
              <Typography variant='body1'>MODERATION TOOLS - gr/{currentSubgreddiit}</Typography>
            </Box>
            <Button sx={{ mx: '1px' }} variant='text' onClick={() => toolNavigation('users')}>Users</Button>
            <Button sx={{ mx: '1px' }} variant="text" onClick={() => toolNavigation('joinRequests')}>Join Requests</Button>
            <Button sx={{ mx: '1px' }} variant="text" onClick={() => toolNavigation('stats')}>Stats</Button>
            <Button sx={{ mx: '1px' }} variant="text" onClick={() => toolNavigation('reports')}>Reports</Button>
          </Card>
        </Box>
      </Grid>
    </div>
  )
}

export default ModSubgreddiit