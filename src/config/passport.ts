import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { AppJwtPayload } from '../types/jwt';
import { models } from '../db'
import passport from 'passport';

const JWT_SECRET = process.env.JWT_SECRET;
const UserModel = models.User;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};

passport.use(
    new JwtStrategy(options, async (jwtPayload: AppJwtPayload, done) => {
        try {
            const user = await UserModel.findByPk(jwtPayload.id);
            if (!user) return done(null, false);

            // Attach user object to req.user
            return done(null, {
                id: user.id,
                email: user.email,
                role: user.role
            });
        } catch (err) {
            return done(err, false);
        }
    })
);
