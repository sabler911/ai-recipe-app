import { useState } from 'react'
import './App.css'

function App() {
  const [ingredients, setIngredients] = useState('')
  const [recipe, setRecipe] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!ingredients.trim()) return

    setIsLoading(true)
    setRecipe(null)
    setError('')

    try {
      const response = await fetch('https://ai-recipe-api-jkr8.onrender.com/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients })
      })
      
      if (!response.ok) throw new Error('Failed to generate recipe')
      
      const data = await response.json()
      setRecipe(data)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>AI Recipe Generator</h1>
        <p>Type what you have in your fridge, and let AI chef create a meal.</p>
      </header>

      <form className="recipe-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="e.g., chicken, rice, broccoli, garlic"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Cooking...' : 'Generate Recipe'}
        </button>
      </form>

      {error && <p className="error-msg">{error}</p>}

      {recipe && (
        <main className="recipe-card">
          <h2>{recipe.title}</h2>
          
          <div className="recipe-section">
            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="recipe-section">
            <h3>Instructions</h3>
            <ol>
              {recipe.instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </main>
      )}
    </div>
  )
}

export default App