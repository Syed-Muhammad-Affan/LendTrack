import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { config } from '../config/config.js';
import bcrypt from 'bcryptjs';
import { IUser } from '../interface/user.interface.js';

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      maxlength: 50,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email',
      ],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: 8,
      maxlenght: 24,
    },
    resetPasswordTokenHash: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

UserSchema.methods.createJWT = function () {
  return jwt.sign({ id: this._id, name: this.name }, config.jwt.secret, {
    expiresIn: config.jwt.lifetime,
  });
};

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  const isMatch = bcrypt.compare(this.password, candidatePassword);
  return isMatch;
};

export default mongoose.model('User', UserSchema);
