import { Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useState } from "react"

const NewPost = ({ ifNewPost, setIfNewPost, currentUser, currentSubgreddiit, handleNewPost }) => {
  const [newPostDetails, setNewPostDetails] = useState(Object.create(null))

  const handleParamChange = (event, objKey) => {
    const newlyChanged = newPostDetails
    newlyChanged[objKey] = event.target.value
    newlyChanged.postedBy = currentUser
    newlyChanged.postedIn = currentSubgreddiit
    newlyChanged.upvotes = 1
    newlyChanged.downvotes = 0
    setNewPostDetails(newlyChanged)
  }

  return (
    <Dialog open={ifNewPost} onClose={() => setIfNewPost(false)}>
      <DialogTitle>New Post</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          variant='outlined'
          onChange={event => handleParamChange(event, 'title')}
        />
        <TextField
          margin="dense"
          multiline
          rows={2}
          label="Text"
          fullWidth
          variant="outlined"
          onChange={event => handleParamChange(event, 'text')}
        />
        <Button sx={{marginTop: '9px'}} variant='contained' onClick={() => handleNewPost(newPostDetails)}>Submit</Button>
      </DialogContent>
    </Dialog>
  )
}

export default NewPost