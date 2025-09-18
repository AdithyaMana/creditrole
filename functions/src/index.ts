import {https, setGlobalOptions} from "firebase-functions/v2";
import {initializeApp} from "firebase-admin/app";
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import {createClient, SupabaseClient} from '@supabase/supabase-js';
import {v4 as uuidv4} from 'uuid';
import Joi from 'joi';

// Initialize Firebase Admin SDK
initializeApp();

// Set global options for Firebase Functions
setGlobalOptions({maxInstances: 10});


// Initialize Express app
const app = express();

// Define allowed origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://creditrole-d55ea.web.app',
];

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({limit: '10mb'}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Helper function to get Supabase client
const getSupabaseClient = (): SupabaseClient | null => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('CRITICAL ERROR: Missing Supabase environment variables');
        return null;
    }
    return createClient(supabaseUrl, supabaseServiceKey);
}

// Validation Schemas
const participantSchema = Joi.object({
  age: Joi.string().required().valid('18-25', '26-35', '36-45', '46-55', '56-65', '66+'),
  field_of_study: Joi.string().min(2).max(100).required().trim(),
  country_of_residence: Joi.string().min(2).max(100).required().trim(),
});

const surveyResponseSchema = Joi.object({
  role_title: Joi.string().min(2).max(100).required().trim(),
  assigned_icon: Joi.string().min(2).max(100).required().trim(),
  response_order: Joi.number().integer().min(0).required(),
});

const surveySubmissionSchema = Joi.object({
  participant: participantSchema.required(),
  responses: Joi.array().items(surveyResponseSchema).min(1).max(20).required(),
  survey_version: Joi.string().default('1.0').trim(),
});

// Utility functions
const handleError = (res: express.Response, error: any, message: string = 'Internal server error') => {
  console.error(`Error: ${message}`, error);
  res.status(500).json({success: false, error: message});
};

const validateInput = (schema: Joi.ObjectSchema, data: any) => {
  const {error, value} = schema.validate(data, {abortEarly: false, stripUnknown: true});
  if (error) {
    return {isValid: false, errors: error.details.map((d) => d.message)};
  }
  return {isValid: true, data: value};
};

// API Routes
app.get('/health', (req, res) => {
  res.json({success: true, message: 'Survey API is running'});
});

app.post('/survey/submit', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return handleError(res, null, 'Supabase client not initialized');
    }

    const validation = validateInput(surveySubmissionSchema, req.body);
    if (!validation.isValid) {
      return res.status(400).json({success: false, error: 'Validation failed', details: validation.errors});
    }

    const {participant, responses, survey_version} = validation.data;

    const {data: participantData, error: participantError} = await supabase
        .from('survey_participants')
        .insert([{id: uuidv4(), ...participant}])
        .select()
        .single();

    if (participantError) return handleError(res, participantError, 'Failed to create participant');

    const {data: submissionData, error: submissionError} = await supabase
        .from('survey_submissions')
        .insert([{
          id: uuidv4(),
          participant_id: participantData.id,
          survey_version: survey_version || '1.0',
          completion_status: 'completed',
          submitted_at: new Date().toISOString(),
        }])
        .select()
        .single();

    if (submissionError) return handleError(res, submissionError, 'Failed to create submission');

    const responseData = responses.map((response: any) => ({
      id: uuidv4(),
      submission_id: submissionData.id,
      ...response,
    }));

    const {error: responsesError} = await supabase.from('survey_responses').insert(responseData);

    if (responsesError) return handleError(res, responsesError, 'Failed to create responses');

    res.status(201).json({success: true, message: 'Survey submitted successfully'});
  } catch (error) {
    handleError(res, error, 'Failed to submit survey');
  }
});

app.get('/survey/stats', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
        return handleError(res, null, 'Supabase client not initialized');
    }

    const {count: participantCount, error: pError} = await supabase.from('survey_participants').select('*', {count: 'exact', head: true});
    if (pError) return handleError(res, pError, 'Failed to fetch stats');

    res.json({success: true, data: {total_participants: participantCount}});
  } catch (error) {
    handleError(res, error, 'Failed to fetch stats');
  }
});


// Export the API to Firebase Functions
export const api = https.onRequest(app);
