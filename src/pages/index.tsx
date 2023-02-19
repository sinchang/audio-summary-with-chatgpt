import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react'
import toast from 'react-hot-toast'

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [generatedSummary, setGeneratedSummary] = useState<string>('')
  const [audioUrl, setAudioUrl] = useState<string>('')

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAudioUrl(e.target.value)
  }

  const generateBio = async () => {
    setLoading(true)
    const response = await fetch(`/api/transcription?url=${audioUrl}`)
    const json = await response.json()

    if (!response.ok) {
      setLoading(false)
      toast.error(json.message || response.statusText)
      return
    }

    setGeneratedSummary(json.message)

    setLoading(false)
  }

  return (
    <div className='flex max-w-5xl mx-auto flex-col py-2 min-h-screen'>
      <Head>
        <title>Podcast Summary With ChatGPT</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Header />
      <div className='flex flex-col items-center flex-1'>
        <input
          type='text'
          onChange={handleUrlChange}
          placeholder='Type the audio url here'
          className='input input-bordered w-full max-w-xs mt-6'
        />
        <button
          className={`btn mt-6 ${loading ? 'loading' : ''}`}
          onClick={generateBio}
        >
          Generate Summary
        </button>
        {generatedSummary ? <p className='mt-6'>{generatedSummary}</p> : null}
      </div>
      <Footer />
    </div>
  )
}

export default Home
