import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';
import {USER_ROLE} from "../utils/enums";

export interface AppJwtPayload extends BaseJwtPayload {
    id: number;
    email: string;
    role: USER_ROLE
}
