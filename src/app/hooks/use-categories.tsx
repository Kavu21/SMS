import { useState, useEffect } from "react"

interface Category {
  _id: string
  name: string
  description?: string
  color: string
  isActive: boolean
}

export function useCategories(organizationId: string) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    if (!organizationId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/categories?organizationId=${organizationId}`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        setError("Failed to fetch categories")
      }
    } catch (err) {
      setError("An error occurred while fetching categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [organizationId])

  const refreshCategories = () => {
    fetchCategories()
  }

  return {
    categories,
    loading,
    error,
    refreshCategories,
  }
}
