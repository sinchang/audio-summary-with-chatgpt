import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react'
import toast from 'react-hot-toast'
import Balancer from 'react-wrap-balancer'

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<string>('')
  const [transcript, setTranscript] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.currentTarget.files?.[0] || null)
  }

  const generate = async () => {
    if (!file) return
    setLoading(true)
    setSummary('')
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`/api/transcription`, {
      method: 'POST',
      body: formData,
    })
    const json = await response.json()

    if (!response.ok) {
      setLoading(false)
      toast.error(json.message || response.statusText)
      return
    }

    setSummary(json.summary)
    setTranscript(json.transcript)
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
          type='file'
          className='file-input w-full max-w-xs mt-6'
          onChange={handleFileSelect}
        />
        <button
          className={`btn mt-6 ${loading ? 'loading' : ''}`}
          onClick={generate}
          disabled={loading || !file}
        >
          Generate Summary & Transcript
        </button>
        <div className='flex flex-row justify-around w-full gap-6'>
          {summary ? (
            <section className='m-6'>
              <h3 className='font-bold'>Summary</h3>
              <Balancer className='mt-6'>{summary}</Balancer>
            </section>
          ) : null}
          {transcript ? (
            <section className='m-6'>
              <h3 className='font-bold'>Transcript</h3>
              <Balancer className='mt-6'>{transcript}</Balancer>
            </section>
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
