import './App.css'
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Account from './Account'
import ViewOwnFeeds from './ViewOwnFeeds'

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
            <ViewOwnFeeds session={session} />
          </div>
        </>
      )}
    </div>
  )
}

export default App
