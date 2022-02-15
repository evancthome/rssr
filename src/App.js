import './App.css'
import React, { Suspense, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { parseString } from 'xml2js'
import Loader from './components/Loader'
import Auth from './components/Auth'
import Account from './components/Account'
import ViewMostRecent from './components/ViewMostRecent'
import ViewFeed from './components/ViewFeed'
const ViewOwnFeeds = React.lazy(() => import('./components/ViewOwnFeeds'))

function App() {
  const [session, setSession] = useState(null)
  const [feeds, setFeeds] = useState([])

  const corsProxy = 'https://long-mouse-41.deno.dev/?target='

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    if (session) {
      getFeeds()
    }
  }, [session])

  const getFeeds = async () => {
    try {
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('feeds')
        .select('*')
        .eq('user_id', user.id)

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        addParsedFeed(data).then((p) => setFeeds(p))
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const addParsedFeed = async (feedArr) => {
    for (let feed of feedArr) {
      const data = await fetch(corsProxy + feed.url)
      const textData = await data.text()
      parseString(textData, (err, result) => (feed.rss = result))
    }
    return feedArr
  }

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
              <Route
                path='/'
                element={
                  <Suspense fallback={<Loader />}>
                    <ViewOwnFeeds getFeeds={getFeeds} feeds={feeds} />
                  </Suspense>
                }
              />

              <Route
                path='/recent'
                element={
                  <Suspense fallback={<Loader />}>
                    <ViewMostRecent getFeeds={getFeeds} feeds={feeds} />
                  </Suspense>
                }
              />
              <Route
                path='/feeds/:id'
                element={
                  <Suspense fallback={<Loader />}>
                    <ViewFeed
                      addParsedFeed={addParsedFeed}
                      getFeeds={getFeeds}
                    />
                  </Suspense>
                }
              />
            </Routes>
          </div>
        </>
      )}
    </div>
  )
}

export default App
