import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { uploadFile } from './application/services/fileUploadService';
import { addCandidate } from './application/services/candidateService';
import positionRoutes from './presentation/routes/positionRoutes';
import candidateRoutes from './presentation/routes/candidateRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AI4Devs Candidate API',
            version: '1.0.0',
            description: 'API for managing candidate data in the AI4Devs recruitment system.',
        },
    },
    apis: ['./api-spec.yaml', './src/infrastructure/routes/*.ts']// path to your API specs
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.post('/candidates', async (req, res) => {
    try {
        const candidate = await addCandidate(req.body);
        res.status(201).json(candidate);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/upload', (req, res) => {
    uploadFile(req, res);
});

// Nuevas rutas de posiciones
app.use('/positions', positionRoutes);

// Registrar las rutas de candidatos
app.use('/candidates', candidateRoutes);


const PORT = process.env.PORT || 3010 ;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
