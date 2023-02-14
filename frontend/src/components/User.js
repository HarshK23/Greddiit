import { Table, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

const User = (props) => {
  const user = props.user

  return (
    <>
        <TableContainer style={{width: '365px', alignContent: 'center'}}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>First Name</TableCell>
                <TableCell>{user.firstName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Last Name</TableCell>
                <TableCell>{user.lastName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>User Name</TableCell>
                <TableCell>{user.userName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Age</TableCell>
                <TableCell>{user.age}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell>{user.contact}</TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
    </>
  )
}

export default User