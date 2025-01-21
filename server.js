import express from "express";
import env from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import morgan from "morgan";
import cron from 'node-cron';
import { sendFestiveMessages } from "./controllers/festiveModule/festive.controller.js";

env.config()

const PORT = process.env.PORT || 4000
const app = express()

//middlewares
app.use(express.json({ limit: '100mb' })); // Adjust size limit as needed
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json())
app.use(cookieParser())
app.use(morgan('common'));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['https://www.vegenmart.com','https://vegenmart.com','https://admin.vegenmart.com','http://localhost:3000','http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true 
// }));

// routes
const routeFiles = fs.readdirSync('./routes');
const routes = Array.from(routeFiles); 
routes.forEach(async route => {
  const routeModule = await import(`./routes/${route}`);
  app.use('/api', routeModule.default);
});


// Cron job to check festive dates every day at midnight
cron.schedule('0 8,14,20 * * *', async () => {
  console.log('Running cron job at specified times...');
  try {
    await sendFestiveMessages();
    console.log('Festive messages sent successfully!');
  } catch (error) {
    console.error('Error in sending festive messages:', error);
  }
});



app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})
