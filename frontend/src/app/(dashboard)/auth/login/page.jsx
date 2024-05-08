'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login({ params }) {
  const [username, setUsername] = useState('abc')
  const [password, setPassword] = useState('abc')
  const [otp, setOtp] = useState('')
  const router = useRouter()

  const handleLogin = async (event) => {
    event.preventDefault()
    const isProduction = true
    const url = isProduction
      ? 'http://ec2-51-20-189-83.eu-north-1.compute.amazonaws.com:3001/sessions'
      : 'http://localhost:3001/sessions'
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })
      if (response.ok) {
        const data = await response.json()
        setOtp(data.otp)
        router.push('/accounts')
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <h2>Logga in</h2>
      <form onSubmit={handleLogin}>
        <input
          type='text'
          placeholder='Användarnamn'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='password'
          placeholder='Lösenord'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Logga in</button>
      </form>
    </div>
  )
}
