import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Avatar from './Avatar'

const Account = ({ session }) => {
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [loading, setLoading] = useState(true)
  const [avatar_url, setAvatarUrl] = useState(null)

  useEffect(() => {
    getProfile()
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
    }
  }

  return (
    <div
      style={{ width: 'max(20vw, 16rem' }}
      className='fixed w-full h-screen px-8 mx-auto place-self-start grid-span-1 grid-cols-max bg-slate-300'
    >
      <Avatar
        url={avatar_url}
        onUpload={(url) => {
          setAvatarUrl(url)
          updateProfile({ username, website, avatar_url: url })
        }}
      />
      <div className='mb-4'>
        <label
          className='block mb-2 font-semibold text-cyan-700'
          htmlFor='email'
        >
          Email
        </label>
        <input
          className='w-48 rounded'
          id='email'
          type='email'
          value={session.user.email}
          disabled
        />
      </div>
      <div className='mb-4'>
        <label
          className='block mb-2 font-semibold text-cyan-700'
          htmlFor='username'
        >
          Name
        </label>
        <input
          className='w-48 rounded'
          id='username'
          type='text'
          value={username || ''}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className='mb-4'>
        <label
          className='block mb-2 font-semibold text-cyan-700'
          htmlFor='website'
        >
          Website
        </label>
        <input
          className='w-48 rounded'
          id='website'
          type='text'
          value={website || ''}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>
      <div className='flex'>
        <div>
          <button
            className='px-4 py-2 mx-2 text-white rounded cursor-pointer bg-slate-600 hover:bg-slate-500'
            onClick={() => updateProfile({ username, website, avatar_url })}
            disabled={loading}
          >
            {loading ? 'Loading' : 'Update'}
          </button>
        </div>
        <div>
          <button
            className='px-4 py-2 mx-2 text-white rounded cursor-pointer bg-slate-600 hover:bg-slate-500'
            onClick={() => supabase.auth.signout()}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

export default Account
