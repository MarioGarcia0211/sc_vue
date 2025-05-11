import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usuarioRoute from './routes/usuario.routes.js';
import authRoute from './routes/auth.routes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', usuarioRoute);
app.use('/api', authRoute);

export default app;