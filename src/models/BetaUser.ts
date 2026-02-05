import mongoose, { Document, Model } from 'mongoose'

export interface IBetaUser extends Document {
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

const BetaUserSchema = new mongoose.Schema<IBetaUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
  },
  {
    timestamps: true,
  }
)

// Prevent recompilation of model in development
const BetaUser: Model<IBetaUser> =
  mongoose.models.BetaUser || mongoose.model<IBetaUser>('BetaUser', BetaUserSchema)

export default BetaUser

