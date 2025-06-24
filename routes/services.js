import express from 'express';
import { getServiceById, getServices } from '../controller/services.js';

const serviceRouter = express.Router();

serviceRouter.get('/services', getServices);
serviceRouter.get('/services/:id', getServiceById);

export default serviceRouter;