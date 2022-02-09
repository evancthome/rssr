import { supabase } from '../supabaseClient'
import { useState } from 'react'

const Auth = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (email) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      alert('Check your email for the login link')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className='container flex flex-col items-center justify-center w-3/4 min-h-screen mx-auto'>
        <h1 className='mb-2 text-6xl font-bold underline text-cyan-700'>
          RSSr
        </h1>
        <p className='pb-6 text-lg text-center'>
          An RSS feed aggregator that works for all types of media
        </p>
        <p className='mb-4'>Sign In Via Email</p>
        <div>
          <input
            className='mb-4 rounded shadow'
            type='email'
            placeholder='Your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <button
            className='px-2 py-4 font-semibold rounded shadow bg-slate-600 hover:bg-slate-500'
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email)
            }}
            disabled={loading}
          >
            {loading ? (
              <span>Loading</span>
            ) : (
              <span className='text-lg text-white'>
                Send login link to email
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Auth
