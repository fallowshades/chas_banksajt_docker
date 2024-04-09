'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
export default function SignupPage({ params }) {
  const [username, setUsername] = useState('abc')
  const [password, setPassword] = useState('abc')
  const router = useRouter()

  const handleSignup = async () => {
    try {
      // Send a POST request to the backend
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        // Redirect the user to another page upon successful signup
        router.push('/auth/login') // Example: redirect to login page
      } else {
        // Handle the error response
        throw new Error('Signup failed')
      }
    } catch (error) {
      console.error('Signup failed:', error)
      // Handle error, such as displaying an error message to the user
    }
  }

  return (
    <div>
      <h2>Skapa användare</h2>
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
      <button onClick={handleSignup}>Skapa användare</button>
    </div>
  )
}
