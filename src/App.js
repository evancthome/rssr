import './App.css'
import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import Account from './components/Account'
import ViewOwnFeeds from './components/ViewOwnFeeds'
import ViewMostRecent from './components/ViewMostRecent'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div className='bg-slate-100'>
      {!session ? (
        <Auth />
      ) : (
        <>
          <Account key={session.user.id} session={session} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'max(20vw, 16rem) auto',
            }}
          >
            <Routes>
              <Route path='/' element={<ViewOwnFeeds session={session} />} />
              <Route path='/recent' element={<ViewMostRecent />} />
            </Routes>
          </div>
        </>
      )}
    </div>
  )
}

export default App
