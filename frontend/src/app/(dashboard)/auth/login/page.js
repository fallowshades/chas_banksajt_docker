'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login({ params }) {
  const [username, setUsername] = useState('abc')
  const [password, setPassword] = useState('abc')
  const [otp, setOtp] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3001/sessions', {
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
      <button onClick={handleLogin}>Logga in</button>
    </div>
  )
}
