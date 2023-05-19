const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("not valid email")
            }
        }
    },
    department: {
        type: String,
        required: true,
        trim: true
    },
    departmentId: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: Date,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    cpassword: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    verifytoken: {
        type: String
    }
}, { timestamps: true });

//hash password
//before save of mongodb, this executes and hashes the password
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 6);
        this.cpassword = await bcrypt.hash(this.cpassword, 6);
    }
    next();
});


// token generate while login
userSchema.methods.generateAuthtoken = async function () {
    try {
        //jwt.sign(payload, secretOrPrivateKey, [options, callback])
        let new_token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, {
            expiresIn: "1d"
        });

        //add the new_token inside tokens array
        this.tokens = this.tokens.concat({ token: new_token });

        //now save the token
        await this.save();

        return new_token;
    } catch (error) {
        return res.status(422).json(error)
    }
}

// Creating Model
const users = new mongoose.model("users", userSchema);
module.exports = users;