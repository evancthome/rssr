import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

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
          // style={{
          //   WebkitMaskImage:
          //     'radial-gradient(circle at 50% 60%, black 50%, rgba(0, 0, 0, 0.6) 50%)',
          //   maskImage: 'linear-gradient(to bottom, transparent 25%, black 75%)',
          //   maskSize: 'contain',
          //   maskRepeat: 'no-repeat',
          //   maskPosition: 'center',
          // }}
          className='self-center w-24 h-24 rounded-full'
          src={avatarUrl}
          alt='Avatar'
        />
      ) : (
        <div>No avatar</div>
      )}
      <div className='mt-6 mb-2'>
        <label
          className='px-4 py-2 text-white rounded cursor-pointer bg-slate-600 hover:bg-slate-500'
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
      </div>
    </div>
  )
}

export default Avatar
