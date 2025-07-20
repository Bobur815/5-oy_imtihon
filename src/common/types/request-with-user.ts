import { Request as ExpRequest } from 'express';

export interface RequestWithUser extends ExpRequest {
    user: { id: string; username: string; role: string };
}