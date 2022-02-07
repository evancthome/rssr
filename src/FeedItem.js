import { useState } from 'react'
import he from 'he'
import { IoIosArrowDown } from 'react-icons/io'

const FeedItem = ({ i }) => {
  const [viewDes, setViewDes] = useState(false)

  const onClick = () => {
    setViewDes(!viewDes)
  }
  return (
    <div className='px-4 py-2 mb-4 rounded shadow bg-slate-300'>
      <a
        className='inline-block text-lg font-bold hover:text-slate-800'
        href={i.link}
        target='_blank'
        rel='noreferrer'
      >
        {i.title}
      </a>
      <div className='flex justify-between'>
        <p>Published at {i.pubDate}</p>
        <button onClick={onClick}>
          <IoIosArrowDown size={25} />
        </button>
      </div>
      <p className={viewDes ? 'block' : 'hidden'}>
        {he.decode(i.description.toString())}
      </p>
    </div>
  )
}

export default FeedItem
