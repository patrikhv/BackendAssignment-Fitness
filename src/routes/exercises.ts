import { Router, Request, Response, NextFunction } from 'express'
import {ExerciseService} from "../services/exerciseService";
import passport from "passport";
import {requireRole} from "../middlewares/requireRole";
import {USER_ROLE} from "../utils/enums";
import {UserExerciseService} from "../services/userExerciseService";
import {AppJwtPayload} from "../types/jwt";
import {ExerciseDto, ExerciseDtoSchema} from "../types/exercise";
import {validate} from "../middlewares/validate";
import {UserExerciseRequest, UserExerciseRequestSchema} from "../types/userExercise";
import {ExerciseQuery, ExerciseQuerySchema} from "../types/ExerciseQuerySchema";

const router = Router()

export default () => {
	// GET /exercises
	router.get(
		'/',
		validate(ExerciseQuerySchema, "query"),
		async (req, res, next) => {
		try {
			const query = req.query as unknown as ExerciseQuery; // avoid ParsedQs type issues
			const exercises = await ExerciseService.getAllWithPrograms(query);
			res.json({
				data: exercises,
				message: 'List of exercises'
			});
		} catch (err) {
			next(err);
		}
	});

	// POST /exercises
	router.post(
		'/',
		passport.authenticate('jwt', { session: false }),
		requireRole(USER_ROLE.ADMIN),
		validate(ExerciseDtoSchema),
		async (req: Request<{}, {}, ExerciseDto>, res, next) => {
			try {
				const exercise = await ExerciseService.create(req.body);
				res.status(201).json({ message: 'Exercise created', data: exercise });
			} catch (err) {
				next(err);
			}
	});

	// PUT /exercises/:id
	router.put(
		'/:id',
		passport.authenticate('jwt', { session: false }),
		requireRole(USER_ROLE.ADMIN),
		validate(ExerciseDtoSchema),
		async (req: Request<{id: string}, {}, ExerciseDto>, res, next) => {
			try {
				const id = parseInt(req.params.id);
				const updated = await ExerciseService.update(id, req.body);
				res.json({ message: 'Exercise updated', data: updated });
			} catch (err) {
				next(err);
			}
	});

	// DELETE /exercises/:id
	router.delete(
		'/:id',
		passport.authenticate('jwt', { session: false }),
		requireRole(USER_ROLE.ADMIN),
		async (req, res, next) => {
			try {
				const id = parseInt(req.params.id);
				await ExerciseService.delete(id);
				res.json({ message: 'Exercise deleted' });
			} catch (err) {
				next(err);
			}
	});

	// POST /me/completed/:id
	router.post(
		'/me/completed/:id',
		passport.authenticate('jwt', { session: false }),
		validate(UserExerciseRequestSchema),
		async (req: Request<{id: string}, {}, UserExerciseRequest>, res: Response, next: NextFunction): Promise<any> => {
			try {
				const user = req.user as AppJwtPayload;

				const exerciseId = parseInt(req.params.id);

				const trackedExercise = await UserExerciseService.trackExercise(user.id, exerciseId, req.body);
				return res.status(201).json({ message: 'Exercise tracked', data: trackedExercise });
			} catch (err) {
				next(err);
			}
		}
	)

	// GET /me/completed
	router.get(
		'/me/completed',
		passport.authenticate('jwt', { session: false }),
		async (req: Request, res: Response, next: NextFunction): Promise<any> => {
			try {
				const user = req.user as AppJwtPayload;

				const completedExercises = await UserExerciseService.getCompletedExercises(user.id);
				return res.json({ data: completedExercises, message: 'List of completed exercises' });
			} catch (err) {
				next(err);
			}
		}
	);

	// DELETE /me/completed/:id
	router.delete(
		'/me/completed/:id',
		passport.authenticate('jwt', { session: false }),
		async (req: Request, res: Response, next: NextFunction): Promise<any> => {
			try {
				const user = req.user as AppJwtPayload;

				const trackId = parseInt(req.params.id);
				await UserExerciseService.removeTrackedExercise(user.id, trackId);
				return res.json({ message: 'Exercise removed' });
			} catch (err) {
				next(err);
			}
		}
	);

	return router;
};
