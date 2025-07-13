import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express'

import { models } from '../db'
import {ProgramService} from "../services/programService";
import passport from "passport";
import {requireRole} from "../middlewares/requireRole";
import {USER_ROLE} from "../utils/enums";
import {ValidationError} from "../errors/appError";

const router = Router()

const {
	Program
} = models

export default () => {
	// GET /programs
	router.get('/', async (_req: Request, res: Response, _next: NextFunction): Promise<any> => {
		const programs = await Program.findAll()
		return res.json({
			data: programs,
			message: 'List of programs'
		})
	})

	// POST /programs/:programId/exercises/:exerciseId
	router.post(
		'/:programId/exercises/:exerciseId',
		passport.authenticate('jwt', { session: false }),
		requireRole(USER_ROLE.ADMIN),
		async (req: Request, res: Response, next: NextFunction): Promise<any> => {
			try {
				const { programId, exerciseId } = req.params
				// check if programId and exerciseId are valid numbers - use zod
				if (isNaN(parseInt(programId)) || isNaN(parseInt(exerciseId))) {
					return next(new ValidationError('Program id must be an integer'))
				}
				const updated = await ProgramService.addExerciseToProgram(parseInt(exerciseId), parseInt(programId))
				return res.json({ message: 'Exercise added to program', data: updated })
			} catch (err) {
				next(err)
			}
		}
	)

	// DELETE /programs/:programId/exercises/:exerciseId
	router.delete(
		'/:programId/exercises/:exerciseId',
		passport.authenticate('jwt', { session: false }),
		requireRole(USER_ROLE.ADMIN),
		async (req: Request, res: Response, next: NextFunction): Promise<any> => {
			try {
				const { programId, exerciseId } = req.params
				// check if programId and exerciseId are valid numbers - use zod
				if (isNaN(parseInt(programId)) || isNaN(parseInt(exerciseId))) {
					return next(new ValidationError('Program id must be an integer'))
				}
				const updated = await ProgramService.removeExerciseFromProgram(parseInt(exerciseId), parseInt(programId))
				return res.json({ message: 'Exercise removed from program', data: updated })
			} catch (err) {
				next(err)
			}
		}
	)

	//

	return router
}
