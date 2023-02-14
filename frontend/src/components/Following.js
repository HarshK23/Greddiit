import { List, ListItem, ListItemText, Button, Typography } from "@mui/material"

import userService from '../services/users'

const Following = ({ setUsers, users, user, index }) => {
  const handleUnfollow = async (following) => {
    const newUser = {...user, following: user.following.filter(follower => follower !== following)}
    await userService.editUser(newUser.email, newUser)
    await userService.getAll().then(initialProfiles => setUsers(initialProfiles))
  }

  return (
    <List>
      {user.following.map(following => {
        return (
          <ListItem key={following} sx={{
            alignContent: 'center',
            marginLeft: '19px',
            listStyleType: "disc",
            display: "list-item",
            marginTop: '1px'
          }}>
            <ListItemText primary={<><Typography>{following}</Typography> <Button variant="outlined" onClick={() => handleUnfollow(following)}>Unfollow</Button></>} />
          </ListItem>
        )
      })}
    </List>
  )
}

export default Following