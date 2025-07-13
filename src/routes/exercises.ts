import { Router, Request, Response, NextFunction } from 'express'
import {ExerciseService} from "../services/exerciseService";
import passport from "passport";
import {requireRole} from "../middlewares/requireRole";
import {USER_ROLE} from "../utils/enums";

const router = Router()

export default () => {
	// GET /exercises
	router.get('/', async (_req, res, next) => {
		try {
			const exercises = await ExerciseService.getAllWithPrograms();
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
		async (req, res, next) => {
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
		async (req, res, next) => {
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
				res.status(204).send(); // No Content
			} catch (err) {
				next(err);
			}
	});

	return router;
};
