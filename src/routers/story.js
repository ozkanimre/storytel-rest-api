const router = require('express').Router()
const Story = require('../models/story')
const auth = require('../middlewares/auth')

//create story
router.post('/story', auth, async (req, res) => {
    const story = new Story({
        ...req.body,
        owner: req.user._id
    })

    try {
        await story.save()
        res.status(201).send(story)
    } catch (e) {
        res.status(400).send(e)
    }
})


// GET /story/my?limit=10&skip=20
// GET /story/my?sortBy=createdAt:desc
//get my stories 
router.get('/story/my', auth, async (req, res) => {
    const sort = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        await req.user.populate({
            path: 'story',
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.story)
    } catch (e) {
        res.status(500).send(e.message)
    }
})

//get all users stories 
router.get('/story', auth, async (req, res) => {
    const limit = parseInt(req.query.limit)
    const skip = parseInt(req.query.skip)
    const sortParameters = {}
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sortParameters[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        const stories = await Story.find({}).limit(limit).skip(skip).sort(sortParameters)
        res.send(stories)
    } catch (e) {
        res.status(500).send(e.message)
    }
})


//get single story
router.get('/story/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const story = await Story.findOne({ _id })

        if (!story) {
            return res.status(404).send()
        }

        res.send(story)
    } catch (e) {
        res.status(500).send()
    }
})

//update a story
router.patch('/story/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'content']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const story = await Story.findOne({ _id: req.params.id, owner: req.user._id })

        if (!story) {
            return res.status(404).send()
        }

        updates.forEach((update) => story[update] = req.body[update])
        await story.save()
        res.send(story)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete a story
router.delete('/story/:id', auth, async (req, res) => {
    try {
        const story = await Story.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!story) {
            res.status(404).send()
        }

        res.send(story)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router