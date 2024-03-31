import express from 'express'
import 'dotenv/config'
import cors from "cors";

import botRouter from './routes/botRouter'
import postRouter from './routes/postRouter'
import actionRouter from './routes/actionRouter'
import paginationMiddleware from './middleware/paginationMiddleware'
import delayMiddleware from './middleware/delayMiddleware'

const app = express()
const port = process.env.PORT || 3001

app.use(cors());
app.use(express.json())
app.use(paginationMiddleware);
app.use('/bots', botRouter)
app.use('/posts', postRouter)
app.use('/actions',actionRouter)

app.get('/', (req, res) => {
    res.json({message:"test"}).status(200)
})

app.listen(port, () => {
    console.log(`server is now lisntening on port: ${port}`)
})