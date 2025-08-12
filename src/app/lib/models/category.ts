import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    default: "#3B82F6", // Default blue color
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Organization",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update timestamp on save
categorySchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

export default mongoose.models.Category || mongoose.model("Category", categorySchema)
