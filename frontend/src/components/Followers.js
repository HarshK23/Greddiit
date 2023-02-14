import { List, ListItem, ListItemText, Button, Typography } from "@mui/material"

import userService from '../services/users'

const Followers = ({ setUsers, users, user, index }) => {
  const handleRemoveFollower = async (followerToRemove) => {
    const newUser = {...user, followers: user.followers.filter(follower => follower !== followerToRemove)}
    await userService.editUser(newUser.email, newUser)
    await userService.getAll().then(initialProfiles => setUsers(initialProfiles))
  } 

  return (
    <List>
      {user.followers.map(follower => {
        return (
          <ListItem key={follower} sx={{
            alignContent: 'center',
            marginLeft: '19px',
            listStyleType: "disc",
            display: "list-item",
            marginTop: '1px'
          }}>
            <ListItemText primary={<><Typography>{follower}</Typography> <Button variant="outlined" onClick={() => handleRemoveFollower(follower)}>Remove</Button></>} />
          </ListItem>
        )
      })}
    </List>
  )
}

export default Followers