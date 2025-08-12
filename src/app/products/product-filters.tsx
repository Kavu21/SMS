"use client"

import { Grid, TextField, MenuItem } from "@mui/material"
import { useEffect, useState } from "react"
import type { FilterValues } from "./page"
import { units } from "./add-product"
import type { Category } from "../types"


interface ProductFiltersProps {
  filters: FilterValues
  onFilterChange: (filters: FilterValues) => void
  organizationId: string
}

export default function ProductFilters({ filters, onFilterChange, organizationId }: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      if (!organizationId) return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/categories?organizationId=${organizationId}&limit=100`)
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [organizationId])

  const handleChange = (field: keyof FilterValues, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
    })
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          select
          fullWidth
          label="Category"
          value={filters.categoryId || ""}
          onChange={(e) => handleChange("categoryId", e.target.value)}
          disabled={loading}
        >
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
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          fullWidth
          label="Min GSM"
          type="number"
          value={filters.gsmMin}
          onChange={(e) => handleChange("gsmMin", e.target.value)}
          inputProps={{ min: 0 }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          fullWidth
          label="Max GSM"
          type="number"
          value={filters.gsmMax}
          onChange={(e) => handleChange("gsmMax", e.target.value)}
          inputProps={{ min: 0 }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          fullWidth
          label="Roll No"
          value={filters.rollNo}
          onChange={(e) => handleChange("rollNo", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2}>
        <TextField
          fullWidth
          label="Reel No"
          value={filters.reelNo}
          onChange={(e) => handleChange("reelNo", e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={1.5}>
        <TextField
          select
          fullWidth
          label="Unit"
          value={filters.unit}
          onChange={(e) => handleChange("unit", e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          {units.map((unit) => (
            <MenuItem key={unit} value={unit}>
              {unit}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  )
}

