export const Header = () => {
  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <a className='btn btn-ghost normal-case text-xl'>
          Audio Summary With ChatGPT
        </a>
      </div>
      <div className='flex-none'>
        <button className='btn btn-square btn-ghost'>
          <a
            href='https://github.com/sinchang/audio-summary-with-chatgpt'
            className='i-radix-icons-github-logo'
          ></a>
        </button>
      </div>
    </div>
  )
}
