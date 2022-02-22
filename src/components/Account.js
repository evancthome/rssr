import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import Avatar from './Avatar'

const Account = ({ session, showAccount, setShowAccount }) => {
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [avatar_url, setAvatarUrl] = useState(null)
  const [updateProfileSettings, setUpdateProfileSettings] = useState(false)

  useEffect(() => {
    getProfile()
  }, [session])

  const onToggleUpdate = () => {
    setUpdateProfileSettings(!updateProfileSettings)
  }

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

  const updateProfile = async ({ username, website, avatar_url }) => {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
        id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      }

      let { error } = await supabase.from('profiles').upsert(updates, {
        returning: 'minimal',
      })

      if (error) {
        throw error
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
      setUpdateProfileSettings(false)
    }
  }

  const onToggleAccount = () => {
    if (showAccount) {
      document.querySelector('body').classList.remove('overflow-hidden')
    }
    if (!showAccount) {
      document.querySelector('body').classList.add('overflow-hidden')
    }
    setShowAccount(!showAccount)
  }

  return (
    <div>
      <div className='account modal'>
        <h1>RSSr</h1>
        <span onClick={onToggleAccount}>x</span>
        <Avatar
          url={avatar_url}
          onUpload={(url) => {
            setAvatarUrl(url)
            updateProfile({ username, website, avatar_url: url })
          }}
        />
        <div className={updateProfileSettings ? 'hidden' : 'account-items'}>
          <p>{username}</p>
          <p>{session.user.email}</p>
          <p>{website}</p>
        </div>
        <div className={updateProfileSettings ? 'account-form' : 'hidden'}>
          <div>
            <label htmlFor='email'>Email</label>
            <input
              className='w-48 rounded'
              id='email'
              type='email'
              value={session.user.email}
              disabled
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='username'>Name</label>
            <input
              id='username'
              type='text'
              value={username || ''}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='mb-4'>
            <label htmlFor='website'>Website</label>
            <input
              id='website'
              type='text'
              value={website || ''}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </div>
        <div className='split'>
          <div>
            <button
              className='btn'
              onClick={
                updateProfileSettings
                  ? () => updateProfile({ username, website, avatar_url })
                  : onToggleUpdate
              }
            >
              {loading ?? 'Loading'}
              {updateProfileSettings ? 'Save' : 'Update'}
            </button>
          </div>
          <div>
            <button className='btn' onClick={() => supabase.auth.signout()}>
              Sign Out
            </button>
          </div>
        </div>
      </div>
      <div onClick={() => setShowAccount(false)} className='disabled'></div>
    </div>
  )
}

export default Account
