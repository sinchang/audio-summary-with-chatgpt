// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Deepgram } from '@deepgram/sdk'
import { ChatGPTAPI } from 'chatgpt'
import type { UrlSource } from '@deepgram/sdk/dist/types'

type Data = {
  message: string
}

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY
const OPEN_API_KEY = process.env.OPENAI_API_KEY

if (!DEEPGRAM_API_KEY) {
  throw new Error('DEEPGRAM API KEY IS REQUIRED')
}

if (!OPEN_API_KEY) {
  throw new Error('OPEN API KEY IS REQUIRED')
}

const deepgram = new Deepgram(DEEPGRAM_API_KEY)
const chatApi = new ChatGPTAPI({
  apiKey: OPEN_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const audioUrl = req.query.url as string

  if (!audioUrl)
    return res.status(400).json({ message: 'audio url is requied' })

  const audioSource: UrlSource = { url: audioUrl }

  const response = await deepgram.transcription.preRecorded(audioSource, {
    punctuate: true,
    model: 'general',
    language: 'en-US',
    tier: 'enhanced',
    times: true,
  })

  const transcript = response.results?.channels[0].alternatives[0].transcript

  if (!transcript) {
    return res.status(500).json({ message: 'transcript is not found' })
  }

  const q = `
    summarize the text below:\n${transcript}
  `

  const summaryResponse = await chatApi.sendMessage(q)

  res.status(200).json({ message: summaryResponse.text })
}
