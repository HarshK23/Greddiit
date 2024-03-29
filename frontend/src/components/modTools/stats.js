import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

import subgreddiitService from '../../services/subgreddiits'

const Stats = ({ currentSubgreddiit }) => {
  const [data, setData] = useState([])

  const hook = () => {
    const fetchData = async () => {
      const stats = await subgreddiitService.getSubgreddiitStats(currentSubgreddiit)
      console.log(stats)
      setData(stats)
    }
    fetchData()
  }
  useEffect(hook, [])

  if (data.length === 0) {
    return (
      <h4>Loading dependencies</h4>
    )
  }

  return (
    <>
      {data &&
        <div style={{ marginTop: '-20px', width: "1030px", borderRadius: '25px', backgroundImage: 'linear-gradient(to bottom right, rgba(255,255,255,0.2), rgba(255,255,255,0.2))' }}>
          <>
            <Box display='flex' justifyContent='center'>
              <h1>STATS</h1>
            </Box>
            <Grid display='flex' flexDirection='row'>
              <Box>
                <Box display='flex' marginTop='5px' marginBottom='8px' justifyContent='center'>
                  <Typography variant='h5'>Total Followers vs Date</Typography>
                </Box>
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="white" />
                  <YAxis dataKey="members" stroke="white" interval={1} />
                  <Tooltip />

                  <Line type="monotone" strokeWidth="2" dataKey="members" stroke="#fa709a" activeDot={{ r: 8 }} />
                </LineChart>
              </Box>
              <Box>
                <Box display='flex' marginTop='5px' marginBottom='8px' justifyContent='center'>
                  <Typography variant='h5'>Posts vs Date</Typography>
                </Box>
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                // margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="white" />
                  <YAxis dataKey="posts" stroke="white" interval={1} />
                  <Tooltip />

                  <Line type="monotone" strokeWidth="2" dataKey="posts" stroke="#fa709a" activeDot={{ r: 8 }} />
                </LineChart>
              </Box>
            </Grid>
            <Grid display='flex' flexDirection='row'>
              <Box>
                <Box display='flex' marginTop='5px' marginBottom='8px' justifyContent='center'>
                  <Typography variant='h5'>Visitors vs Date</Typography>
                </Box>
                <LineChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="white" />
                  <YAxis dataKey="visitors" stroke="white" interval={1} />
                  <Tooltip />

                  <Line type="monotone" strokeWidth="2" dataKey="visitors" stroke="#fa709a" activeDot={{ r: 8 }} />
                </LineChart>
              </Box>
              <Box>
                <Box display='flex' marginTop='5px' marginBottom='8px' justifyContent='center'>
                  <Typography variant='h5'>Reported Posts vs Deleted Posts</Typography>
                </Box>
                <BarChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="white" />
                  <YAxis stroke='white' />
                  <Tooltip />
                  <Bar dataKey="reports" fill="#fa709a" barSize={30} />
                  <Bar dataKey="deletedPosts" fill="red" barSize={30} />
                </BarChart>
              </Box>
            </Grid>
          </>
        </div>
      }
    </>
  )
}

export default Stats