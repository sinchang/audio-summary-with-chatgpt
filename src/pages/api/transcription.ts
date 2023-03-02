import type { NextApiRequest, NextApiResponse } from 'next'
import { Configuration, OpenAIApi } from 'openai'
import formidable, { File } from 'formidable'
import fs from 'fs'

const form = formidable({ multiples: true, keepExtensions: true })

const isFile = (file: File | File[]): file is File =>
  !Array.isArray(file) && file?.filepath !== undefined

type Data = {
  summary?: string
  transcript?: string
  message?: string
}

const OPEN_API_KEY = process.env.OPENAI_API_KEY

if (!OPEN_API_KEY) {
  throw new Error('OPEN API KEY IS REQUIRED')
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const fileContent: any = await new Promise((resolve, reject) => {
      form.parse(req, (err, _fields, files) => {
        if (isFile(files.file)) {
          resolve(fs.createReadStream(files.file.filepath))
        }

        reject('file is not found')
      })
    })

    const transcriptionResponse = await openai.createTranscription(
      fileContent,
      'whisper-1'
    )

    const transcript = transcriptionResponse.data.text

    if (!transcript) {
      return res.status(500).json({ message: 'transcript is not found' })
    }

    const q = `summarize the text below:\n${transcript}`

    try {
      const summaryResponse = await openai.createCompletion({
        prompt: q,
        model: 'text-davinci-003',
        max_tokens: 4096,
      })

      return res
        .status(200)
        .json({ summary: summaryResponse.data.choices[0].text, transcript })
    } catch {}

    res.status(200).json({ transcript })
  } catch (e: any) {
    res.status(e?.response?.status || 500).json({
      message: JSON.stringify(
        e?.response?.data || e?.message || 'Internal Error'
      ),
    })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
