import { Button, Grid } from "@mui/material"
import { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { CurrentUserContext } from "../App"

const Dashboard = () => {
  const navigate = useNavigate()

  const { currentUser, setCurrentUser, rootUrl } = useContext(CurrentUserContext)


  useEffect(() => {
    const parsedURL = window.location.pathname.split('/')
    setCurrentUser(parsedURL[1])

    if (localStorage.getItem('signInStatus') === 'false') {
      navigate('/')
    }
  }, [])

  return (
    <div>

    </div>
  )
}

export default Dashboard