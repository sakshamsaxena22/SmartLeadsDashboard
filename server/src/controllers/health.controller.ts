import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const healthController = {
  check(_req: Request, res: Response): void {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  },

  async dbCheck(_req: Request, res: Response): Promise<void> {
    try {
      const state = mongoose.connection.readyState;
      const stateMap: Record<number, string> = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
      };

      res.status(state === 1 ? 200 : 503).json({
        status: state === 1 ? 'ok' : 'error',
        database: stateMap[state] || 'unknown',
        timestamp: new Date().toISOString(),
      });
    } catch {
      res.status(503).json({
        status: 'error',
        database: 'unreachable',
        timestamp: new Date().toISOString(),
      });
    }
  },
};
