import { Role } from '@prisma/client';
import { Request as ExpRequest } from 'express';

export interface RequestWithUser extends ExpRequest {
    user: { id: number; username: string; role: Role };
}