'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
function Accounts({ params }) {
  const [otp, setOtp] = useState('')
  const [balance, setBalance] = useState(0)
  const router = useRouter()
  const [amount, setAmount] = useState(0)
  const handleGetBalance = async () => {
    try {
      const isProduction = true
      const url = isProduction
        ? 'http://ec2-51-20-189-83.eu-north-1.compute.amazonaws.com:3001/me/accounts'
        : 'http://localhost:3001/me/accounts'

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'abc', otp }),
      })
      if (response.ok) {
        // Hantera saldo data
        const data = await response.json() // Parse response body as JSON
        setBalance(data.balance) // Update balance state with received balance
      }
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDeposit = async (event) => {
    event.preventDefault()
    try {
      const isProduction = true
      const url = isProduction
        ? 'http://ec2-51-20-189-83.eu-north-1.compute.amazonaws.com:3001/me/accounts/transactions'
        : 'http://localhost:3001/me/accounts/transactions'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'abc', otp, amount }),
      })
      if (response.ok) {
        // Reload balance or update UI
        const data = await response.json() // Parse response body as JSON
        setBalance(data.balance) // Update balance state with received balance
      }
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div>
      <div>
        <h2>Kontosida</h2>
        <Button onClick={handleGetBalance}>Visa saldo</Button>
        <p>Saldo: {balance}</p>
      </div>
      <div>
        <h2>Kontosida</h2>
        <label>
          otp.ie Token:
          <input
            type='text'
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </label>
        <label>
          Belopp att sätta in:
          <input
            type='number'
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
          />
        </label>
        <Button onClick={handleDeposit}>Sätt in pengar</Button>
      </div>
    </div>
  )
}

export default Accounts
