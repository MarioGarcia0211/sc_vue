import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import usuarioRoute from './routes/usuario.routes.js';
import loginRoute from './routes/login.routes.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api', usuarioRoute);
app.use('/api', loginRoute);

export default app;