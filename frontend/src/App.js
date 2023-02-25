import { Route, Routes, useNavigate } from 'react-router-dom'
import { useState, createContext, useMemo, useEffect } from 'react'

import Profile from './components/Profile'
import SignIn from './components/Login'
import { ThemeProvider } from '@mui/system'
import NavBar from './components/NavBar'
import { createTheme } from '@mui/material'

import profileService from './services/users'
import Dashboard from './components/Dashboard'
import MySubgreddiits from './components/MySubgreddiits'
import AllSubgreddiits from './components/AllSubgreddiits'
import SavedPosts from './components/SavedPosts'

import './app.css'
import ModSubgreddiit from './components/ModSubgreddiit'
import SubgreddiitInfo from './components/SubgreddiitInfo'

export const ThemeContext = createContext({ toggleThemeMode: () => { } })
export const CurrentUserContext = createContext()

const App = () => {
  const [currentUser, setCurrentUser] = useState('')
  const rootUrl = window.location.href

  const [mode, setMode] = useState('dark');
  const themeMode = useMemo(
    () => ({
      toggleThemeMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },

      }),
    [mode],
  );

  // ==============================================

  const [users, setUsers] = useState([{ firstName: '', lastName: '', userName: '', email: '', age: '', contact: '', password: '' }])
  const [signInStatus, setSignInStatus] = useState([false, ''])

  const hook = () => {
    profileService.getAll().then(initialProfiles => setUsers(initialProfiles))
  }

  useEffect(hook, [])

  const navigate = useNavigate();
  function handleNav(email) {
    navigate(`/${email}`)
  }

  const handleProfileChange = (event, changedUser, index, setToEdit, setChangedUser, setDuplicateUserMessage) => {
    event.preventDefault()
    if (users.filter(user => user.email === changedUser.email).length !== 0) {
      setDuplicateUserMessage('The user with the given Email already exists')
      return
    }

    const newUsers = users
    newUsers[index] = changedUser
    setUsers(newUsers)
    setDuplicateUserMessage(null)

    const emailUpdate = users[index].email;
    handleNav(emailUpdate)
    setToEdit(false)
    setChangedUser(Object.create(null))
  }

  return (
    <div className='overall'>
      <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, rootUrl }}>
        <ThemeContext.Provider value={themeMode}>
          <ThemeProvider theme={theme}>
            <NavBar theme={theme} />
            <Routes>
              <Route path='/' element={<SignIn users={users} setUsers={setUsers} setSignInStatus={setSignInStatus} />} />
              <Route path='/:userEmail/' element={<Dashboard />} />
              <Route path='/:userEmail/profile' element={<Profile users={users} setUsers={setUsers} handleProfileChange={handleProfileChange} signInStatus={signInStatus} />} />
              <Route path='/:userEmail/mysubgreddiits' element={<MySubgreddiits />} />
              <Route path='/:userEmail/mysubgreddiits/gr/:subName' element={<ModSubgreddiit />} />
              <Route path='/:userEmail/mysubgreddiits/gr/:subName/:tool' element={<ModSubgreddiit />} />
              <Route path='/:userEmail/allsubgreddiits' element={<AllSubgreddiits />} />
              <Route path='/:userEmail/allsubgreddiits/gr/:subName' element={<SubgreddiitInfo />} />
              <Route path='/:userEmail/savedposts' element={<SavedPosts />} />
            </Routes>
          </ThemeProvider>
        </ThemeContext.Provider>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;