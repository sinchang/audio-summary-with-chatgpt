export const Header = () => {
  return (
    <div className='navbar bg-base-100'>
      <div className='flex-1'>
        <a className='normal-case text-xl'>Audio Summary With ChatGPT</a>
        <div
          className='tooltip tooltip-bottom tooltip-warning'
          data-tip=' File uploads are currently limited to 25 MB and the following input
          file types are supported: mp3, mp4, mpeg, mpga, m4a, wav, and webm.'
        >
          <div className='i-radix-icons-question-mark-circled ml-2'></div>
        </div>
      </div>
      <div className='flex-none'>
        <button className='btn btn-ghost'>
          <label htmlFor='key-modal'>API KEY</label>
        </button>
        <button className='btn btn-ghost'>
          <a
            href='https://github.com/sinchang/audio-summary-with-chatgpt'
            className='i-radix-icons-github-logo'
          ></a>
        </button>
      </div>
    </div>
  )
}
