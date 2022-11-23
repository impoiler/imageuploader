const { mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

mongoose.connect(
  process.env.DATABASE_URL.replace("<password>", process.env.DB_PASSWORD),
  () => {
    console.log("DB connected successfully");
  }
);

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin", "editor"],
    default: "user",
  },
  password: {
    type: String,
    minlength: 8,
    required: true,
    select: false,
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (ele) {
        return ele === this.password;
      },
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
  },
  verifiedOn: {
    type: Date,
    default: undefined,
  },
});

UserSchema.pre("save", async function (next) {
  this.createdAt = Date.now();
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
});

UserSchema.methods.ComparePassword = async function (
  candidatepassword,
  acctualpassword
) {
  return await bcrypt.compare(candidatepassword, acctualpassword);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
