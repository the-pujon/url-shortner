import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';

const app: Application = express();

app.use(express.json());
app.use(bodyParser.json());

const allowedOrigins = process.env.FRONTEND_URLS?.split(',').map(url => url.trim()) || [];

app.use(cors({
  origin: (origin, callback) => {
    console.log('Request Origin:', origin);
    console.log('Allowed Origins:', allowedOrigins);

    if (!origin) {
      // Allow requests with no origin (e.g. mobile apps, curl)
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['set-cookie'],
}));

app.use(cookieParser());
// application routes
app.use('/api/v1', router);   

app.get('/', (req: Request, res: Response) => {
  res.send('Hi Express Server v2!! you are live now!!!!');
});

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
