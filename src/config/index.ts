import { CorsOptions } from 'cors';

export const isProduction = process.env.NODE_ENV === 'production ';

// DATABASE
// export const DB_URI = 'mongodb+srv://ariel:26dg61cqj72V3X6i@capstone.6bmo6he.mongodb.net/bsu-emc?retryWrites=true&w=majority';
export const DB_URI = isProduction
  ? 'mongodb+srv://ariel:26dg61cqj72V3X6i@capstone.6bmo6he.mongodb.net/bsu-emc?retryWrites=true&w=majority'
  : 'mongodb://localhost:27017/bsu_emc';

export const FRONTEND = 'https://cc8a-210-1-124-73.ap.ngrok.io'

// CORS
export const CORS_CONFIG: CorsOptions = {
  // origin 'https://bsuemc.netlify.app', 'http://localhost:3000', 'https://bsuemc.herokuapp.com'
  origin: [
    'http://localhost:3000',
    'https://bsuemc.herokuapp.com',
    'http://127.0.0.1:8887',
    'http://localhost:8887',
    FRONTEND
  ],
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE'],
  allowedHeaders: ['Content-Type', 'Accept', 'X-XSRF-TOKEN', 'X-CLIENT-REQUEST', 'Authorization'],
  credentials: true,
  maxAge: isProduction ? 900 : 1,
};

// LOG
export const LOG_FORMAT = isProduction ? 'combined' : 'dev';
export const LOG_DIR = '../logs';

// TOKEN
export const SECRET_KEY = 'technogeekssecretkeyforjwt';

// NODE ENVIRONMENT
export const NODE_ENV = isProduction ? 'production' : 'development';

// GMAIL (inser gmail account here)
export const GMAIL = 'llanitaariel@gmail.com';
export const GMAIL_PASSWORD = 'svtbqahkasnqyfzb'; // App Password here
