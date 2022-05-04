const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Story = require('./story')


//user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('story', {
    ref: 'Story',
    localField: '_id',
    foreignField: 'owner'
})

//hide private information
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

//generate authentication token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY)
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//login
userSchema.statics.login = async (username, password) => {
    const user = await User.findOne({ username })
    if (!user) {
        throw new Error('Wrong credentials')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Wrong credentials')
    }
    return user
}

//middleware hash password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

// Remove user stories when user is also removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Story.deleteMany({ owner: user._id })
    next()
})

//user model
const User = mongoose.model('User', userSchema)

module.exports = User