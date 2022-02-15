import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import defaultAvi from '../defaultAvi.png'

const Avatar = ({ url, onUpload }) => {
  const [avatarUrl, setAvatarUrl] = useState()
  const [uploading, setUploading] = useState()

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (e) => {
    try {
      setUploading(true)

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert.apply(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className='flex flex-col justify-center align-items-center'>
      {avatarUrl ? (
        <img
          className='self-center w-24 h-24 rounded-full'
          src={avatarUrl}
          alt='Avatar'
        />
      ) : (
        <img
          className='self-center w-24 h-24 rounded-full'
          src={defaultAvi}
          alt='Default Avatar'
        />
      )}
      <label
        className='absolute self-center w-24 h-24 px-4 py-8 text-center text-transparent transition-all bg-transparent rounded-full cursor-pointer hover:text-white hover:bg-slate-600/75'
        htmlFor='single'
      >
        {uploading ? 'Uploading' : 'Upload'}
      </label>
      <input
        type='file'
        className='absolute invisible'
        id='single'
        accept='image/*'
        onChange={uploadAvatar}
        disabled={uploading}
      />
      {/* </div> */}
    </div>
  )
}

export default Avatar
