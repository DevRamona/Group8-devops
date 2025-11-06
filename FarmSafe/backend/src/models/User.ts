import mongoose, { Schema, Document } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer', required: true },
  location: { type: String },
  farmSize: { type: Number },
  crops: { type: String },
  profilePicture: { type: String },
  phoneNumber: { type: String },
}, { timestamps: true });

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'admin';
  location?: string;
  farmSize?: number;
  crops?: string;
  profilePicture?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const User = mongoose.model<UserDocument>('User', userSchema);
export default User;
