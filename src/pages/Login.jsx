import { useState } from 'react'
import { useAuth } from '../AuthContext.jsx'
import { useNavigate } from 'react-router-dom'  

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const [error, setError] = useState(null)
  const navigate = useNavigate()  

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError(null)

  try {
    const response = await fetch('http://localhost:8080/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error('Forkert brugernavn eller kodeord')
    }

    const data = await response.json()

    // Gem token og username lokalt
    localStorage.setItem('token', data.token)
    localStorage.setItem('username', data.username)

    login({ username: data.username, role: data.role })

    // Naviger baseret på rolle
    if (data.role === 'ADMIN') {
  navigate('/admin')
} else if (data.role === 'USER') {
  navigate('/my-shifts')
}


  } catch (err) {
    setError(err.message)
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Log ind</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Brugernavn"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
          <input
            type="password"
            placeholder="Adgangskode"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Log ind
          </button>
        </form>
      </div>
    </div>
  )
}
