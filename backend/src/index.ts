import { Request, Response, NextFunction } from 'express';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import candidateRoutes from './routes/candidateRoutes';
import { uploadFile } from './application/services/fileUploadService';
import { setupContainer } from './infrastructure/di/setup';
import { injectContainer } from './middleware/containerMiddleware';

dotenv.config();

export const app = express();
export default app;

const container = setupContainer();

// Middleware setup
app.use(express.json());
app.use(injectContainer(container));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/candidates', candidateRoutes);
app.post('/upload', uploadFile);

app.get('/', (req, res) => {
  res.send('Hola LTI!');
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.type('text/plain'); 
  res.status(500).send('Something broke!');
});

const port = 3010;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
