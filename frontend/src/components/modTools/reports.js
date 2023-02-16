import { Button, Card, Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"

import reportService from '../../services/reports'

const BlockButton = ({ report }) => {
  const [countdown, setCountdown] = useState(3);
  const [isCounting, setIsCounting] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    let timerId;
    if (isCounting) {
      timerId = setInterval(() => {
        setCountdown((countdown) => countdown - 1);
      }, 1000);
    }
    if (countdown === 0) {
      reportService.changeVerdict(report.id, "blocked")
      setBlocked(true);
      setIsCounting(false);
      setCountdown(3);
    }
    return () => clearInterval(timerId);
  }, [isCounting, countdown]);

  const handleBlock = () => {
    setIsCounting(!isCounting);
  };

  const handleCancelBlock = () => {
    setIsCounting(false);
    setCountdown(3);
  };

  return (
    <Button
      disabled={report.verdict === 'ignored' || blocked}
      variant={isCounting ? 'outlined' : 'contained'}
      color="error"
      onClick={isCounting ? handleCancelBlock : handleBlock}
    >
      {isCounting ? `Cancel in ${countdown} secs` : blocked ? `Blocked` : `Block User`}
    </Button>
  )
}

const Reports = ({ currentSubgreddiitObj }) => {
  const [reports, setReports] = useState([])

  const hook = () => {
    const fetchReports = async () => {
      await reportService.getReportsBySubgreddiit(currentSubgreddiitObj.name)
        .then(reports => {
          setReports(reports)
        })
    }
    fetchReports()
  }
  useEffect(hook, [currentSubgreddiitObj])

  const handleIgnore = async (id) => {
    try {
      await reportService.changeVerdict(id, "ignored")
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  const deleteReport = async (id) => {
    try {
      console.log(id)
      await reportService.deleteReport(id)
      setReports(reports.filter(report => report.id !== id))
    } catch (error) {
      console.log(error)
    }
  }

  if (currentSubgreddiitObj === undefined) {
    return (
      <Typography variant="h4">Loading...</Typography>
    )
  }
  return (
    <Grid display='flex' justifyContent='center' flexDirection='column' width='800px' sx={{ borderRadius: '15px', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }}>
      <Box display='flex' justifyContent='center'>
        <Typography justifyContent='center' my='8px' variant='h4'>REPORTS</Typography>
      </Box>
      {reports && reports.map(report => {
        return (
          <Box key={report.id} display='flex' justifyContent='center'>
            <Card sx={{ width: '85%', justifyContent: 'center', my: '10px' }}>
              <Grid margin='8px' key={report.id} display='flex' justifyContent='center' sx={{ borderRadius: '5px' }}>
                <Typography marginTop='3px' variant='h5'><strong>Post: </strong> {report.associatedPost}</Typography>
                <Grid display='flex' marginLeft='auto'>
                  <Box display='flex' justifyContent='flex-end' width='404px' height='36.5px' marginLeft='auto'>
                    <BlockButton report={report} />
                    <Button disabled={report.verdict === 'ignored'} sx={{ marginLeft: '6px' }} color='error' variant="outlined" onClick={() => deleteReport(report.id)}>Delete Post</Button>
                    <Button sx={{ marginLeft: '6px' }} variant="outlined" onClick={() => handleIgnore(report.id)}>Ignore</Button>
                  </Box>
                </Grid>
              </Grid>
              <Box margin='5px' marginTop='20px'>
                <Typography marginBottom='5px' variant='body1'><strong>Reported user:</strong> {report.reportedUser}</Typography>
                <Typography marginBottom='5px' variant='body1'><strong>Reported by:</strong> {report.reportedBy}</Typography>
                <Typography marginBottom='5px' variant='body1'><strong>Concern:</strong> {report.concern}</Typography>
                <Typography marginBottom='5px' variant='body1'><strong>Concerned text:</strong> "{report.postText}"</Typography>
              </Box>
            </Card>
          </Box>
        )
      })
      }
    </Grid>

  )
}

export default Reports