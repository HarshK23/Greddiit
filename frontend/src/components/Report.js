import { Button, Dialog, DialogContent, DialogTitle, TextField } from "@mui/material"
import { useState } from "react"

const Report = ({ ifReport, setIfReport, currentUser, currentSubgreddiit, handleNewReport, currentPost }) => {
  const [newReportDetails, setNewReportDetails] = useState(Object.create(null))

  const handleParamChange = (event, objKey) => {
    const newlyChanged = newReportDetails
    newlyChanged[objKey] = event.target.value
    newlyChanged.reportedBy = currentUser
    newlyChanged.postedIn = currentSubgreddiit
    newlyChanged.verdict = 'none'
    newlyChanged.reportedUser = currentPost.postedBy
    newlyChanged.postText = currentPost.text
    newlyChanged.associatedPost = currentPost.title
    setNewReportDetails(newlyChanged)
  }

  return (
    <Dialog open={ifReport} onClose={() => setIfReport(false)}>
      <DialogTitle>Report</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Concern"
          fullWidth
          variant='outlined'
          onChange={event => handleParamChange(event, 'concern')}
        />
        <Button sx={{marginTop: '9px'}} variant='contained' onClick={() => handleNewReport(newReportDetails)}>Submit</Button>
      </DialogContent>
    </Dialog>
  )
}

export default Report