'use client'
import Link from 'next/link'
function LandingPage() {
  return (
    <div>
      <nav className='flex gap-2'>
        <Link href='/'>Hem</Link>
        <Link href='/auth/login'>Logga in</Link>
        <Link href='/auth/signup'>Skapa användare</Link>
      </nav>
      <section className='hero-section'>
        <h1>Välkommen till banken</h1>
        <button>
          <Link href='/auth/signup'>Skapa användare</Link>
        </button>
      </section>
    </div>
  )
}

export default LandingPage
