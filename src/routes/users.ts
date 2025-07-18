import {NextFunction, Request, Response, Router} from "express";
import {UserService} from "../services/userService";
import passport from "passport";
import {requireRole} from "../middlewares/requireRole";
import {USER_ROLE} from "../utils/enums";
import {AppJwtPayload} from "../types/jwt";
import {NotFoundError, UnauthorizedError} from "../errors/appError";
import {UserLoginRequest, UserUpdateRequest, UserUpdateRequestSchema} from "../types/user";
import {validate} from "../middlewares/validate";


const router = Router();

export default () => {
    // GET /users
    router.get(
        '/',
        passport.authenticate('jwt', { session: false }),
        async (req, res, next) => {
            try {
                const user = req.user as AppJwtPayload;

                if (!user?.role) {
                    return next(new UnauthorizedError('User role is not defined'));
                }

                const result = await UserService.getAllForRole(user?.role);

                res.json({
                    data: result,
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
        async (req, res, next) => {
            try {
                const id = parseInt(req.params.id);

                const user = req.user as AppJwtPayload;

                if (user.role !== USER_ROLE.ADMIN && user.id !== id) {
                    return next(new UnauthorizedError('You do not have permission to view this user'));
                }

                const userData = await UserService.getById(id, user.role);
                res.json({
                    data: userData,
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
        passport.authenticate('jwt', {session: false}),
        requireRole(USER_ROLE.ADMIN),
        validate(UserUpdateRequestSchema),
        async (req: Request<{id: string}, {}, UserUpdateRequest>, res: Response, next: NextFunction): Promise<void> => {
            try {
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return next(new NotFoundError('Invalid user ID'));
                }
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