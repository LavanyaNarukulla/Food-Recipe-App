const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
trim: true,
},
email: {
type: String,
required: true,
unique: true,
lowercase: true,
trim: true,
},
password: {
    type: String,
    required: true,
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
},
  { timestamps: true }
);

userSchema.pre("save", async function () {
if (!this.isModified("password")) return;

this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
