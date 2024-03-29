import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { set } from 'mongoose';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, LOG_FORMAT, CORS_CONFIG } from '@config';
import { connectDB } from '@databases';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import path from 'path';
import restrictBrowser from '@middlewares/browser.middleware';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV;
    this.port = process.env.PORT || 8080;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private connectToDatabase() {
    if (this.env !== 'production') {
      set('debug', true);
    }
    connectDB();
  }

  private initializeMiddlewares() {
    this.app.use(cors(CORS_CONFIG));
    this.app.use(restrictBrowser);
    this.app.use(morgan(LOG_FORMAT, { stream }));
    // Document upload directory
    this.app.use('/uploads', express.static(path.join(__dirname, '../', 'uploads')));
    // Enable access to JSON payload
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    // Protection against HTTP Parameter Pollution attacks
    this.app.use(hpp());
    // Protection against security risks like XSS, Content Security Policy
    this.app.use(helmet());
    // Decreases the downloadable amount of data that's served to users.
    this.app.use(compression());
    // Enable access to cookie from request or response object
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
