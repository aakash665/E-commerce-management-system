import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userEmail: {
    type: String, required: true, unique: true, index: true, dropDups: true,
  },
  userPassword: { type: String, required: true },
  isSuperUser: { type: Boolean, required: true, default: false },
});

const accountModel = mongoose.model('Account', accountSchema);

export default accountModel;
