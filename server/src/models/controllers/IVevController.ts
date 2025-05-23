import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';

export interface IVevController {
    getAllVevs: (req: Request, res: Response) => void;
    createVev: (req: AuthenticatedRequest, res: Response) => void;
    getVevById: (req: Request, res: Response) => void;
    updateVev: (req: AuthenticatedRequest, res: Response) => void;
    setVevWinner: (req: AuthenticatedRequest, res: Response) => void;
    deleteVev: (req: AuthenticatedRequest, res: Response) => void;
}

export default IVevController;