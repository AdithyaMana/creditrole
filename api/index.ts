import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import Joi from 'joi';

const app = express();
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const participantSchema = Joi.object({
  age: Joi.string().required(),
  field_of_study: Joi.string().required(),
  country_of_residence: Joi.string().required(),
});

const surveySubmissionSchema = Joi.object({
  participant: participantSchema.required(),
  responses: Joi.array().items(Joi.object({
    role_title: Joi.string().required(),
    assigned_icon: Joi.string().required(),
    response_order: Joi.number().required(),
  })).required(),
});

app.post('/api/survey/submit', async (req, res) => {
  const { error, value } = surveySubmissionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: error.details });
  }

  const { participant, responses } = value;

  try {
    const { data: pData, error: pError } = await supabase.from('survey_participants').insert([participant]).select().single();
    if (pError) throw pError;

    const { data: sData, error: sError } = await supabase.from('survey_submissions').insert([{
      participant_id: pData.id,
      completion_status: 'completed',
      submitted_at: new Date().toISOString()
    }]).select().single();
    if (sError) throw sError;

    const responseData = responses.map((r: any) => ({ ...r, submission_id: sData.id }));
    const { error: rError } = await supabase.from('survey_responses').insert(responseData);
    if (rError) throw rError;

    res.status(201).json({ success: true, message: 'Survey submitted successfully' });
  } catch (err: any) {
    console.error('Submission Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default app;