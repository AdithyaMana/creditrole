import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';

// Initialize Express app
const app = express();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('CRITICAL ERROR: Missing Supabase environment variables.');
  // In a serverless environment, we can't process.exit. We'll let it fail on createClient.
}

const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

// Middleware
app.use(helmet());
app.use(cors()); // Simplified CORS for Vercel's environment
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Validation Schemas
const participantSchema = Joi.object({
  age: Joi.string().required().valid('18-25', '26-35', '36-45', '46-55', '56-65', '66+'),
  field_of_study: Joi.string().min(2).max(100).required().trim(),
  country_of_residence: Joi.string().min(2).max(100).required().trim()
});

const surveySubmissionSchema = Joi.object({
  participant: participantSchema.required(),
  responses: Joi.array().items(Joi.object({
    role_title: Joi.string().min(2).max(100).required().trim(),
    assigned_icon: Joi.string().min(2).max(100).required().trim(),
    response_order: Joi.number().integer().min(0).required()
  })).min(1).max(20).required(),
  survey_version: Joi.string().default('1.0').trim()
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Survey API is running' });
});

app.post('/api/survey/submit', async (req, res) => {
  const { error, value } = surveySubmissionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: error.details });
  }

  const { participant, responses, survey_version } = value;

  try {
    const { data: pData, error: pError } = await supabase.from('survey_participants').insert([participant]).select().single();
    if (pError) throw pError;

    const { data: sData, error: sError } = await supabase.from('survey_submissions').insert([{
      participant_id: pData.id,
      survey_version,
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

// This is the critical change for Vercel
export default app;