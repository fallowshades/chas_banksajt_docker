import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = 3001

// Middleware
app.use(cors())
app.use(bodyParser.json())

import mysql from 'mysql2/promise'
let pool
// Create a function to establish database connection
async function connectToDatabase() {
  try {
    pool = mysql.createPool({
      host: 'mysql',
      user: 'root',
      password: 'root',
      database: 'bank',
      port: 3307,
    })
    console.log('Connected to MySQL database')
    return pool
  } catch (error) {
    console.error('Error connecting to MySQL database:', error)
    throw error // Rethrow the error to be caught by the caller
  }
}
// help function to make code look nicer
async function query(sql, params) {
  const [results] = await pool.execute(sql, params)
  return results
}

// Tomma arrayer för användare, konton och sessioner
let userIds = 1
let users = []
let accounts = []
let sessions = []

//visa saldo:

//1. skicka token
//2. token ger userId från sessions
//3. userId get salodo från accounts

// sätta in pengar
// 1. skicka token och antal kronor
// 2. token ger userId från sessions
// 3. updatera accouts med nytt saldo

// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000)
  return otp.toString()
}

// Skapa användare
app.post('/users', async (req, res) => {
  const { username, password } = req.body
  const user = { id: userIds++, username, password }
  users.push(user)
  //
  try {
    const result = await query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    )
    console.log(result.insertId)
    const userId = result.insertId
    //
    const balance = 0
    // console.log(users)
    const accountInsertResult = await query(
      'INSERT INTO accounts (userId, balance) VALUES (?, ?)',
      [userId, balance]
    )
    console.log(accountInsertResult)
    // const account = { id: accounts.length + 1, userId: userId, balance: 0 }
    // accounts.push(account)
    //console.log(account)

    res.status(201).send('User created')
  } catch (error) {
    console.error('Error creating user', error)
    res.status(500).send('Error creating user')
  }
})

// Logga in och skicka engångslösenord
app.post('/sessions', async (req, res) => {
  const { username, password } = req.body
  // const user = users.find(
  //   (u) => u.username === username && u.password === password
  // )
  try {
    const [user] = await query(
      'SELECT id FROM users WHERE username = ? AND password = ?',
      [username, password]
    )

    if (!user) {
      console.log('error')
      return res.status(401).send('Fel användarnamn eller lösenord')
    }
    console.log(user)
    const otp = generateOTP()

    const accountInsertResult = await query(
      'INSERT INTO sessions (userId, token) VALUES (?, ?)',
      [user.id, otp]
    )
    console.log(accountInsertResult)
    // const session = { userId: user.id, token: otp }
    // sessions.push(session)
    // console.log(`sessions ${session}`)
    // console.log(`otp ${otp}`)
    res.status(200).json({ accountInsertResult })
  } catch (error) {
    console.error('Error fetching account:', error)
    res.status(500).send('Ett fel uppstod vid hämtning av kontot')
  }
})

// Visa saldo
app.post('/me/accounts', async (req, res) => {
  // console.log(`users: ${JSON.stringify(users)}`)
  // console.log(`accounts: ${JSON.stringify(accounts)}`)
  // console.log(`sessions: ${JSON.stringify(sessions)}`)
  const { otp } = req.body
  // console.log(otp)
  // console.log('otp:', otp)
  // console.log(`sessions: ${sessions} x $`)
  try {
    // Find the session associated with the provided OTP
    const [session] = await query(
      'SELECT userId FROM sessions WHERE token = ?',
      [otp]
    )
    if (!session) {
      console.log('err session in accounts')
      return res.status(401).send('Ogiltig session')
    }
    console.log(session)
    const [account] = await query('SELECT * FROM accounts WHERE userId = ?', [
      session.userId,
    ])
    if (!account) {
      console.log('err account in accounts')
      return res.status(401).send('Ogiltig session')
    }
    // Din kod för att visa saldo här
    let saldo = 0
    if (account.balance) {
      saldo = account.balance
    }
    console.log(saldo)
    res.status(200).json({ saldo: saldo })
  } catch (error) {
    console.error('Error fetching account:', error)
    res.status(500).send('Ett fel uppstod vid hämtning av kontot')
  }
})

// Sätt in pengar
app.post('/me/accounts/transactions', async (req, res) => {
  // console.log(`users: ${JSON.stringify(users)}`)
  // console.log(`accounts: ${JSON.stringify(accounts)}`)
  // console.log(`sessions: ${JSON.stringify(sessions)}`)
  const { otp, amount } = req.body
  // console.log(req.body)
  // console.log('in transaction otp=', otp)
  // console.log(JSON.stringify(sessions[0]))
  //const session = sessions.find((s) => s.username === username && s.otp === otp)
  try {
    const [session] = await query(
      'SELECT userId FROM sessions WHERE token = ?',
      [otp]
    )
    if (!session) {
      console.log('err no session in transaction')
      return res.status(401).send('Ogiltig session')
    }
    console.log(JSON.stringify(sessions))

    const [account] = await query('SELECT * FROM accounts WHERE userId = ?', [
      session.userId,
    ])
    if (!account) {
      console.log('err no account in transaction')
      return res.status(401).send('Ogiltig session')
    }
    // Din kod för att hantera transaktioner här
    // account.balance += amount

    // console.log(`account: ${account}`)
    // // Send the updated balance back to the client
    // const newBalance = account.balance

    const newBalance = account.balance + amount
    await query('UPDATE accounts SET balance = ? WHERE userId = ?', [
      newBalance,
      session.userId,
    ])

    console.log(`newBalance ${newBalance}`)
    res.status(200).json({ balance: newBalance })
  } catch (error) {
    console.error('Error processing transaction:', error)
    res.status(500).send('Ett fel uppstod vid transaktionshantering')
  }
})

// Start the server after connecting to the database
connectToDatabase()
  .then((pool) => {
    // Routes and other setup that depend on the database connection
    app.listen(port, () => {
      console.log(`Bankens backend körs på http://localhost:${port}`)
    })
  })
  .catch((error) => {
    console.error('Failed to start server:', error)
    process.exit(1) // Exit the process with an error code
  })
