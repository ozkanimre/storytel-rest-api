const mongoose = require('mongoose')

//story schema
const storySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        minlength: 10
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

//story model
const Story = mongoose.model('Story', storySchema)

module.exports = Story