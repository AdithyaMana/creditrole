/**
 * Survey Backend API Server
 */

// This MUST be the first line to load environment variables
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
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('CRITICAL ERROR: Missing Supabase environment variables in server/.env');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Loaded' : 'MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Loaded' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define allowed origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    // This is the crucial URL for your WebContainer frontend
    'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--96435430.local-credentialless.webcontainer-api.io'
];


// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// --- Validation Schemas - UPDATED ---
const participantSchema = Joi.object({
  age: Joi.string().required().valid('18-25', '26-35', '36-45', '46-55', '56-65', '66+'),
  field_of_study: Joi.string().min(2).max(100).required().trim(),
  country_of_residence: Joi.string().min(2).max(100).required().trim()
});

const surveyResponseSchema = Joi.object({
  role_title: Joi.string().min(2).max(100).required().trim(),
  assigned_icon: Joi.string().min(2).max(100).required().trim(),
  response_order: Joi.number().integer().min(0).required()
});

const surveySubmissionSchema = Joi.object({
  participant: participantSchema.required(),
  responses: Joi.array().items(surveyResponseSchema).min(1).max(20).required(),
  survey_version: Joi.string().default('1.0').trim()
});

// Utility functions
const handleError = (res: express.Response, error: any, message: string = 'Internal server error') => {
  console.error(`Error: ${message}`, error);

  if (error.code === '23503') { // Foreign key constraint violation
    return res.status(400).json({
      success: false,
      error: 'Invalid reference data',
      code: 'INVALID_REFERENCE'
    });
  }

  return res.status(500).json({
    success: false,
    error: message,
    code: 'INTERNAL_ERROR'
  });
};

const validateInput = (schema: Joi.ObjectSchema, data: any) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    const details = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    return { isValid: false, errors: details, data: null };
  }

  return { isValid: true, data: value, errors: null };
};

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Survey API is running',
    timestamp: new Date().toISOString()
  });
});

app.post('/api/survey/submit', async (req, res) => {
  try {
    const validation = validateInput(surveySubmissionSchema, req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const { participant, responses, survey_version } = validation.data;

    const { data: participantData, error: participantError } = await supabase
      .from('survey_participants')
      .insert([{ id: uuidv4(), ...participant }])
      .select()
      .single();

    if (participantError) {
      return handleError(res, participantError, 'Failed to create participant');
    }

    const { data: submissionData, error: submissionError } = await supabase
      .from('survey_submissions')
      .insert([{
        id: uuidv4(),
        participant_id: participantData.id,
        survey_version: survey_version || '1.0',
        completion_status: 'completed',
        submitted_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (submissionError) {
      return handleError(res, submissionError, 'Failed to create submission');
    }

    const responseData = responses.map((response: any) => ({
      id: uuidv4(),
      submission_id: submissionData.id,
      ...response
    }));

    const { error: responsesError } = await supabase
      .from('survey_responses')
      .insert(responseData);

    if (responsesError) {
      return handleError(res, responsesError, 'Failed to create responses');
    }

    res.status(201).json({
      success: true,
      message: 'Survey submitted successfully',
      data: {
        participant_id: participantData.id,
        submission_id: submissionData.id,
        responses_count: responses.length
      }
    });

  } catch (error) {
    handleError(res, error, 'Failed to submit survey');
  }
});

app.get('/api/survey/stats', async (req, res) => {
  try {
    const { count: participantCount, error: participantError } = await supabase
      .from('survey_participants')
      .select('*', { count: 'exact', head: true });

    if (participantError) {
      return handleError(res, participantError, 'Failed to fetch participant count');
    }

    const { count: submissionCount, error: submissionError } = await supabase
      .from('survey_submissions')
      .select('*', { count: 'exact', head: true });

    if (submissionError) {
      return handleError(res, submissionError, 'Failed to fetch submission count');
    }

    const { count: completedCount, error: completedError } = await supabase
      .from('survey_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('completion_status', 'completed');

    if (completedError) {
      return handleError(res, completedError, 'Failed to fetch completed count');
    }

    res.json({
      success: true,
      data: {
        total_participants: participantCount || 0,
        total_submissions: submissionCount || 0,
        completed_submissions: completedCount || 0,
        completion_rate: submissionCount ? ((completedCount || 0) / submissionCount * 100).toFixed(2) : '0.00'
      }
    });

  } catch (error) {
    handleError(res, error, 'Failed to fetch statistics');
  }
});


// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'UNHANDLED_ERROR'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Survey API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;