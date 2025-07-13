import http from 'http'
import express from 'express'
import dotenv from 'dotenv'
// Load environment variables from .env file
dotenv.config();

import { sequelize } from './db'
import ProgramRouter from './routes/programs'
import ExerciseRouter from './routes/exercises'
import AuthRouter from './routes/auth'
import UserRouter from './routes/users'
import './config/passport';
import passport from "passport";
import {errorHandler} from "./middlewares/errorHandler";

const app = express()

app.use(passport.initialize());

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/auth', AuthRouter())
app.use('/users', UserRouter())
app.use('/programs', ProgramRouter())
app.use('/exercises', ExerciseRouter())

// Global error handler
app.use(errorHandler)

const httpServer = http.createServer(app)

try {
    sequelize.sync()
} catch (error) {
    console.log('Sequelize sync error')
}

httpServer.listen(8000).on('listening', () => console.log(`Server started at port ${8000}`))

export default httpServer
