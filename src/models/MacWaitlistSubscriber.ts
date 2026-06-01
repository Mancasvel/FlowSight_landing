import mongoose from 'mongoose'

const MacWaitlistSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    source: {
      type: String,
      default: 'download-section',
      maxlength: 60,
    },
  },
  { timestamps: true }
)

export default mongoose.models.MacWaitlistSubscriber ||
  mongoose.model('MacWaitlistSubscriber', MacWaitlistSubscriberSchema)
