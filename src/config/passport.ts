import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { AppJwtPayload } from '../types/jwt';
import passport from 'passport';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
};

passport.use(
    new JwtStrategy(options, (jwtPayload: AppJwtPayload, done) => {
        // cast jwtPayload.id to number - jwtLibrary returns it as string
        jwtPayload.id = Number(jwtPayload.id);
        return done(null, jwtPayload);
    })
);
