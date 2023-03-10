# [Audio Summary With ChatGPT](https://audio-summary-with-chatgpt.vercel.app?utm_source=github)

This project is to generate audio summaries and transcripts by using OpenAI.

## Running Locally

After cloning the repo, we need to create OpenAI key and put it in `.env` file.

- OPENAI_API_KEY: Apply it in [OpenAI](https://beta.openai.com/account/api-keys).

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
pnpm run dev
```

## References

- https://platform.openai.com/docs/api-reference/audio
- https://platform.openai.com/docs/api-reference/chat/create