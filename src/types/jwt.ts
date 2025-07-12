import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

export interface AppJwtPayload extends BaseJwtPayload {
    id: number;
    email: string;
    role: 'ADMIN' | 'USER';
}
