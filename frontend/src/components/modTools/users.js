import { Box, Grid, List, ListItem, ListItemText, Typography } from "@mui/material"

const Users = ({ currentSubgreddiitObj }) => {
  return (
    <Grid display='flex'>
      <Box width='400px' sx={{ borderRadius: '15px', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }}>
        <Box marginTop='8px' display='flex' justifyContent='center'><Typography variant='h4'>FOLLOWERS</Typography></Box>
        <Box display='flex' justifyContent='center'>
          <List>
            {currentSubgreddiitObj.followers && currentSubgreddiitObj.followers.length === 0 ?
              <Box display='flex' justifyContent='center'>
                <Typography variant='h6'><em>No followers</em></Typography>
              </Box>
              : null
            }
            {currentSubgreddiitObj.followers && currentSubgreddiitObj.followers.map(follower => {
              return (
                <ListItem key={follower} sx={{
                  alignContent: 'center',
                  marginLeft: '23px',
                  listStyleType: "disc",
                  display: "list-item",
                  marginTop: '1px'
                }}>
                  <ListItemText primary={<><Typography>{follower}</Typography></>} />
                </ListItem>
              )
            })
            }
          </List>
        </Box>
      </Box>
      <Box marginLeft='90px' width='400px' sx={{ borderRadius: '15px', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }}>
        <Box marginTop='8px' display='flex' justifyContent='center'><Typography variant='h4'>BLOCKED USERS</Typography></Box>
        <Box display='flex' justifyContent='center'>
          <List>
            {currentSubgreddiitObj.blockedUsers &&  currentSubgreddiitObj.blockedUsers.length === 0 ?
              <Box display='flex' justifyContent='center'>
                <Typography variant='h6'><em>No blocked users</em></Typography>
              </Box>
              : null
            }
            {currentSubgreddiitObj.blockedUsers && currentSubgreddiitObj.blockedUsers.map(blockedUser => {
              return (
                <ListItem key={blockedUser} sx={{
                  alignContent: 'center',
                  marginLeft: '25px',
                  listStyleType: "disc",
                  display: "list-item",
                  marginTop: '1px'
                }}>
                  <ListItemText primary={<><Typography>{blockedUser}</Typography></>} />
                </ListItem>
              )
            })
            }
          </List>
        </Box>
      </Box>
    </Grid>
  )
}

export default Users