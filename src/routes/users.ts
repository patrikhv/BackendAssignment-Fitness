import {Router} from "express";
import {UserService} from "../services/userService";
import passport from "passport";
import {requireRole} from "../middlewares/requireRole";
import {USER_ROLE} from "../utils/enums";


const router = Router();

export default () => {
    // GET /users
    router.get(
        '/',
        passport.authenticate('jwt', { session: false }),
        requireRole(USER_ROLE.ADMIN),
        async (req, res, next) => {
            try {
                const users = await UserService.getAll();
                res.json({
                    data: users,
                    message: 'List of users'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    // GET /users/:id
    router.get(
        '/:id',
        passport.authenticate('jwt', { session: false }),
        requireRole(USER_ROLE.ADMIN),
        async (req, res, next) => {
            try {
                const id = parseInt(req.params.id);
                const user = await UserService.getById(id);
                res.json({
                    data: user,
                    message: 'User detail'
                });
            } catch (err) {
                next(err);
            }
        }
    );

    // PUT /users/:id
    router.put(
        '/:id',
        passport.authenticate('jwt', { session: false }),
        requireRole(USER_ROLE.ADMIN),
        async (req, res, next) => {
            try {
                const id = parseInt(req.params.id);
                const updatedUser = await UserService.update(id, req.body);
                res.json({
                    message: 'User updated successfully',
                    data: updatedUser
                });
            } catch (err) {
                next(err);
            }
        }
    );

    return router;
}