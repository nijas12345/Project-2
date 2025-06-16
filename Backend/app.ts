import express,{Application} from 'express'
import morgan from 'morgan';
import { createServer } from 'http';
import DB_Connection from './Config/database_config'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { startCronJob } from './Config/cron_config';
import { configSocketIO } from './Config/socket_config';
import user_router from './Routes/user_route';
import admin_router from './Routes/admin_route';
import webHookRouter from './Routes/webhook_route';
dotenv.config()

DB_Connection()
const app:Application = express()
const allowedOrigins = process.env.CORS_ORIGINS?.split(',');
app.use(cors({
    origin:allowedOrigins,
    credentials:true
}))
const server = createServer(app)
configSocketIO(server);
startCronJob()
app.use(cookieParser())
app.use(morgan('dev'));
app.use('/webhook', webHookRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'uploads')));
app.use('/',user_router)
app.use('/admin',admin_router)

server.listen(process.env.PORT,():void=>{
    console.log(`Server is started on port ${process.env.PORT}`);  
})