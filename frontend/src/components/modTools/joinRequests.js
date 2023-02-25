import { Button, Card, Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { LoadingButton } from '@mui/lab'

import userService from '../../services/users'
import subgreddiitService from '../../services/subgreddiits'

const UserDetails = ({ userEmail, subName, setCurrentSubgreddiitObj }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getCurrentUser() {
      await userService.getUser(userEmail).then(user => setUser(user))
    }
    getCurrentUser()
  }, [])

  const handleRequest = async (action) => {
    setLoading(true)

    const hmm = await subgreddiitService.handleJoinRequest(subName, userEmail, action)
    setCurrentSubgreddiitObj(hmm)
  }

  return (
    <div style={{ margin: '10px' }}>
      {user &&
        <>
          <Grid display='flex' width='100%'>
            <Grid>
              <Typography variant='h5'>{user.userName}</Typography>
            </Grid>
            <Grid display='flex' width='100%' marginLeft='auto'>
              <Box marginLeft='auto'>
                <LoadingButton variant="contained" loading={loading} onClick={() => handleRequest('accept')}>Accept</LoadingButton>
                <LoadingButton sx={{ marginLeft: '6px' }} loading={loading} color='error' variant="outlined" onClick={() => handleRequest('reject')}>Reject</LoadingButton>
              </Box>
            </Grid>
          </Grid>
          <Box marginTop='5px'>
            <Typography marginBottom='5px' variant='body1'><strong>Email:</strong> {user.email}</Typography>
            <Typography marginBottom='5px' variant='body1'><strong>Name:</strong> {user.firstName} {user.lastName}</Typography>
            <Typography marginBottom='5px' variant='body1'><strong>Age:</strong> {user.age}</Typography>
          </Box>
        </>
      }
    </div>
  )
}

const JoinRequests = ({ currentSubgreddiitObj, setCurrentSubgreddiitObj }) => {
  return (
    // <Grid width='700px'>
    <Box width='700px' sx={{ borderRadius: '15px', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }}>
      <Box display='flex' justifyContent='center'>
        <Typography sx={{ my: '10px' }} variant='h4'>JOIN REQUESTS</Typography>
      </Box>
      <Box display='flex' justifyContent='center'>
        <Box width='85%'>
          {currentSubgreddiitObj.joinRequests && currentSubgreddiitObj.joinRequests.length === 0 ?
            <Box display='flex' justifyContent='center'>
              <Typography variant='h6'><em>No join requests</em></Typography>
            </Box>
            : null
          }
          {currentSubgreddiitObj.joinRequests && currentSubgreddiitObj.joinRequests.map(joinRequest => {
            return (
              <Card key={joinRequest} sx={{ width: '100%', display: 'flex', my: '6px' }}>
                <Box width='100%'>
                  <UserDetails userEmail={joinRequest} subName={currentSubgreddiitObj.name} setCurrentSubgreddiitObj={setCurrentSubgreddiitObj} />
                </Box>
              </Card>
            )
          }
          )}
        </Box>
      </Box>
    </Box>
    // </Grid>
  )
}

export default JoinRequests