"use client"

import { useState } from "react"
import { Close, Warning } from "@mui/icons-material"

interface Category {
  _id: string
  name: string
}

interface DeleteCategoryModalProps {
  category: Category
  onClose: () => void
  onSuccess: () => void
}

export default function DeleteCategoryModal({ category, onClose, onSuccess }: DeleteCategoryModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleDelete = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/categories/${category._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        onSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to delete category")
      }
    } catch (error) {
      setError("An error occurred while deleting the category")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Delete Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Close />
          </button>
        </div>

        <div className="flex items-start mb-6">
          <Warning className="h-6 w-6 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete the category <strong>"{category.name}"</strong>?
            </p>
            <p className="text-sm text-gray-500">
              This action cannot be undone. The category will be marked as inactive and won't be available for new products or customers.
            </p>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Deleting..." : "Delete Category"}
          </button>
        </div>
      </div>
    </div>
  )
}
