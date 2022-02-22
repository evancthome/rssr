import './reset.css'
import './sidebar.css'
import './App.css'
import React, { Suspense, useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { supabase } from './supabaseClient'
import { parseString } from 'xml2js'
import { Squash as Hamburger } from 'hamburger-react'
import Loader from './components/Loader'
import Auth from './components/Auth'
import Account from './components/Account'
const ViewMostRecent = React.lazy(() => import('./components/ViewMostRecent'))
const ViewFeed = React.lazy(() => import('./components/ViewFeed'))
const ViewOwnFeeds = React.lazy(() => import('./components/ViewOwnFeeds'))

function App() {
  const [session, setSession] = useState(null)
  const [feeds, setFeeds] = useState([])
  const [accountOpen, setAccountOpen] = useState(false)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [avatar_url, setAvatarUrl] = useState(null)

  const corsProxy = 'https://long-mouse-41.deno.dev/?target='

  useEffect(() => {
    setSession(supabase.auth.session())

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    getProfile()

    if (session) {
      getFeeds()
    }
  }, [session])

  const getProfile = async () => {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('profiles')
        .select('username, website, avatar_url')
        .eq('id', user.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

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
    <>
      {!session ? (
        <Auth />
      ) : (
        <>
          {/* <div className={!accountOpen ? 'hidden' : null}>
            <Account key={session.user.id} session={session} />
          </div> */}
          <main>
            {/* <div className='inline col-start-1 row-start-1'>
              <Hamburger toggled={accountOpen} toggle={setAccountOpen} />
            </div> */}
            <Routes>
              <Route
                path='/'
                element={
                  <Suspense fallback={<Loader />}>
                    <ViewOwnFeeds
                      session={session}
                      username={username}
                      avatar={avatar_url}
                      accountOpen={accountOpen}
                      getFeeds={getFeeds}
                      feeds={feeds}
                    />
                  </Suspense>
                }
              />

              <Route
                path='/recent'
                element={
                  <Suspense fallback={<Loader />}>
                    <ViewMostRecent
                      session={session}
                      avatar={avatar_url}
                      username={username}
                      getFeeds={getFeeds}
                      feeds={feeds}
                    />
                  </Suspense>
                }
              />
              <Route
                path='/feeds/:id'
                element={
                  <Suspense fallback={<Loader />}>
                    <ViewFeed
                      session={session}
                      avatar={avatar_url}
                      addParsedFeed={addParsedFeed}
                      getFeeds={getFeeds}
                    />
                  </Suspense>
                }
              />
              <Route
                path='/account'
                element={
                  <Suspense fallback={<Loader />}>
                    <Account
                      session={session}
                      addParsedFeed={addParsedFeed}
                      getFeeds={getFeeds}
                    />
                  </Suspense>
                }
              />
            </Routes>
          </main>
        </>
      )}
    </>
  )
}

export default App
