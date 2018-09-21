import { Router } from 'express';
import bodyParser from 'body-parser';

import company from './routes/company';
import job from './routes/job';
import applicant from './routes/applicant';

const api = Router();

api.use(bodyParser.json());

api.use('/company', company);
api.use('/job', job);
api.use('/applicant', applicant);

export default api;
