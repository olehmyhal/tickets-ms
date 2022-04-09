import express from 'express'
import 'express-async-errors'
import { json  } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, notFoundError, currentUser } from '@olegtickets/common'

import { indexOrderRoute } from './routes/index'
import { showOrderRoute } from './routes/show'
import { newOrderRoute } from './routes/new'
import { deleteOrderRoute } from './routes/delete'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
)
app.use(currentUser)

app.use(indexOrderRoute)
app.use(showOrderRoute)
app.use(newOrderRoute)
app.use(deleteOrderRoute)

app.all('*', async () => {
    throw new notFoundError()
})

app.use(errorHandler)

export { app }