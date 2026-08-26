import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/api';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware for body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Mount API routes FIRST
  app.use('/api', apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    
    // Serve static assets with cache headers
    app.use(express.static(distPath, {
      maxAge: '1d',
      etag: false
    }));
    
    // Serve index.html for SPA routing
    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.sendFile(indexPath, (err) => {
        if (err) {
          res.status(404).send('Not found');
        }
      });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FORBIDEN App Store server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
