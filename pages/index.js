import Head from 'next/head'

import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { Button, Typography } from '@mui/material'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>solveNearn</title>
        <meta name="description" content="Solve N Earn" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className={`${styles.main} ${inter.className}`}>
        <Typography variant="h1" gutterBottom>Just Chill!! Here is Solve N Earn</Typography>
        <Typography variant="h2" gutterBottom>Developed by:</Typography>
        <Typography variant="h3" gutterBottom>Md. Abdullah Al Noman Turag</Typography>
        <Typography variant="h3" gutterBottom>Abdulla Al Nayem</Typography>
        <Button onClick={()=>{
          router.push("/problem")
        }}
        
        variant="contained"
        >Solve a problem</Button>
      </main>
    </>
  )
}
