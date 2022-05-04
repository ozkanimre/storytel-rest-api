//create express app
const express = require('express')
const app = express()
require('dotenv').config()

//db connection
require('./db/connect')

//import routers
const userRouter = require('./routers/user')
const storyRouter = require('./routers/story')

//express middleware for json data convert
app.use(express.json())

//use routers
app.use(userRouter)
app.use(storyRouter)


const port = process.env.PORT
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})