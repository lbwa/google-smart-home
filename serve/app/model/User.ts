export default function(app) {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const UserSchema = new Schema({
    username: { type: String },
    password: { type: String },
    access_token: { type: String },
    refresh_token: { type: String },
    id: Schema.Types.ObjectId
  })

  return mongoose.model('User', UserSchema)
}
