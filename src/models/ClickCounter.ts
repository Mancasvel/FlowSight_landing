import mongoose from 'mongoose'

export interface IClickCounter extends mongoose.Document {
  key: string
  count: number
}

const ClickCounterSchema = new mongoose.Schema<IClickCounter>(
  {
    key: { type: String, required: true, unique: true, index: true },
    count: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.ClickCounter ||
  mongoose.model<IClickCounter>('ClickCounter', ClickCounterSchema)
