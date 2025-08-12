"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  Alert,
} from "@mui/material"
import { Add } from "@mui/icons-material"
import type { Category } from "../types"


export const units = ["pieces", "kg"]

interface AddProductProps {
  onProductAdded: () => void
}

export default function AddProduct({ onProductAdded }: AddProductProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [organizationId, setOrganizationId] = useState<string>("")

    useEffect(() => {
    const fetchOrganizationId = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const userData = await response.json()
          setOrganizationId(userData.organizationId)
        }
      } catch (error) {
        console.error("Error fetching organization ID:", error)
      }
    }

    fetchOrganizationId()
  }, [])

  useEffect(() => {
    if (organizationId) {
      fetchCategories()
    }
  }, [organizationId])

  const fetchCategories = async () => {
    if (!organizationId) return
    
    try {
      const response = await fetch(`/api/categories?organizationId=${organizationId}`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      gsm: Number(formData.get("gsm")),
      size: formData.get("size") as string,
      rollNo: formData.get("rollNo") as string,
      reelNo: formData.get("reelNo") as string,
      diameter: Number(formData.get("diameter")),
      weight: Number(formData.get("weight")),
      quantity: Number(formData.get("quantity")),
      unit: formData.get("unit") as string,
      categoryId: formData.get("categoryId") as string,
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Failed to add product")
      }

      onProductAdded()
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: "black",
          "&:hover": {
            bgcolor: "#333",
          },
        }}
      >
        Add Product
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth name="name" label="Product Name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth name="size" label="Size" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth name="gsm" label="GSM" type="number" inputProps={{ min: 0 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth name="rollNo" label="Roll No" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth name="reelNo" label="Reel No" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="diameter"
                  label="Diameter"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth select name="unit" label="Unit" defaultValue="">
                  {units.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="weight"
                  label="Weight (kg)"
                  type="number"
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth name="description" label="Description" multiline rows={3} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="quantity"
                  label="Quantity (pieces)"
                  type="number"
                  inputProps={{ min: 0 }}
                />
              </Grid>
             
              <Grid item xs={12} sm={6}>
                <TextField required fullWidth select name="categoryId" label="Category" defaultValue="">
                  {categories.map((category) => (
                    <MenuItem key={category._id} value={category._id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        {category.name}
                      </div>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "black",
                "&:hover": {
                  bgcolor: "#333",
                },
              }}
            >
              Add Product
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

