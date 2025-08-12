import { NextRequest, NextResponse } from "next/server"
import Category from "../../../lib/models/category"
import { decrypt } from "../../../lib/auth"

export async function GET(
  request: NextRequest,
{ params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = await decrypt(token)
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const category = await Category.findById((await params).id)
    
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = await decrypt(token)
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const body = await request.json()
    const { name, description, color, isActive } = body

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    // Check if category with same name already exists (excluding current category)
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      _id: { $ne: params.id }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 400 }
      )
    }

    const category = await Category.findByIdAndUpdate(
      params.id,
      {
        name,
        description,
        color,
        isActive,
        updatedAt: new Date(),
      },
      { new: true }
    )

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const session = await decrypt(token)
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if category is being used by any products or customers
    const Product = (await import("../../../lib/models/products")).default
    const Customer = (await import("../../../lib/models/customer")).default
    
    const productsUsingCategory = await Product.findOne({ categoryId: params.id })
    const customersUsingCategory = await Customer.findOne({ categoryId: params.id })

    if (productsUsingCategory || customersUsingCategory) {
      return NextResponse.json(
        { error: "Cannot delete category as it is being used by products or customers" },
        { status: 400 }
      )
    }

    // Soft delete by setting isActive to false
    const category = await Category.findByIdAndUpdate(
      params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    )

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
