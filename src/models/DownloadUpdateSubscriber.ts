import mongoose from 'mongoose'

const DownloadUpdateSubscriberSchema = new mongoose.Schema(
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
      required: true,
      enum: ['download-windows', 'download-linux-deb', 'download-linux-appimage'],
    },
  },
  { timestamps: true }
)

export default mongoose.models.DownloadUpdateSubscriber ||
  mongoose.model('DownloadUpdateSubscriber', DownloadUpdateSubscriberSchema)
