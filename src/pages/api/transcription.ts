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

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  throw new Error('OPEN API KEY IS REQUIRED')
}

const configuration = new Configuration({
  apiKey: OPENAI_API_KEY,
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

        return reject('file is not found')
      })
    })

    const transcriptionResponse = await openai.createTranscription(
      fileContent,
      'whisper-1'
    )

    const transcript = transcriptionResponse.data.text

    const q = `summarize the text below:\n${transcript}`

    try {
      const summaryResponse = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: q,
          },
        ],
      })

      return res.status(200).json({
        summary: summaryResponse.data.choices[0].message?.content,
        transcript,
      })
    } catch {}

    res.status(200).json({ transcript })
  } catch (e: any) {
    res.status(e?.response?.status || 500).json({
      message: JSON.stringify(
        e?.response?.data || e?.message || e || 'Internal Error'
      ),
    })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
