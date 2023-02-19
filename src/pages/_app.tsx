import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import Script from 'next/script'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        strategy='afterInteractive'
        data-website-id='afa609f0-7988-4c16-93d2-7b85efbf0dc2'
        src='https://umami-production-af5b.up.railway.app/umami.js'
      />
      <Component {...pageProps} />
      <Toaster />
    </>
  )
}
