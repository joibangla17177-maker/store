import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { Express } from 'express';
import { apiRouter } from '../server/api';

let app: Express | null = null;

function getApp(): Express {
  if (!app) {
    app = express();

    app.use(express.json({ limit: '600mb' }));
    app.use(express.urlencoded({ extended: true, limit: '600mb' }));

    // Mount at root — Vercel's legacy routes strip the /api prefix before
    // forwarding to this function, so req.url arrives as /admin/apps/save
    // not /api/admin/apps/save. Mounting at / ensures all routes match.
    app.use('/', apiRouter);
  }
  return app;
}

export default (req: VercelRequest, res: VercelResponse) => {
  return getApp()(req as any, res as any);
};
