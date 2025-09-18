"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const v2_1 = require("firebase-functions/v2");
const app_1 = require("firebase-admin/app");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const supabase_js_1 = require("@supabase/supabase-js");
const uuid_1 = require("uuid");
const joi_1 = __importDefault(require("joi"));
// Initialize Firebase Admin SDK
(0, app_1.initializeApp)();
// Set global options for Firebase Functions
(0, v2_1.setGlobalOptions)({ maxInstances: 10 });
// Initialize Express app
const app = (0, express_1.default)();
// Define allowed origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://creditrole-d55ea.web.app',
];
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);
// Helper function to get Supabase client
const getSupabaseClient = () => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('CRITICAL ERROR: Missing Supabase environment variables');
        return null;
    }
    return (0, supabase_js_1.createClient)(supabaseUrl, supabaseServiceKey);
};
// Validation Schemas
const participantSchema = joi_1.default.object({
    age: joi_1.default.string().required().valid('18-25', '26-35', '36-45', '46-55', '56-65', '66+'),
    field_of_study: joi_1.default.string().min(2).max(100).required().trim(),
    country_of_residence: joi_1.default.string().min(2).max(100).required().trim(),
});
const surveyResponseSchema = joi_1.default.object({
    role_title: joi_1.default.string().min(2).max(100).required().trim(),
    assigned_icon: joi_1.default.string().min(2).max(100).required().trim(),
    response_order: joi_1.default.number().integer().min(0).required(),
});
const surveySubmissionSchema = joi_1.default.object({
    participant: participantSchema.required(),
    responses: joi_1.default.array().items(surveyResponseSchema).min(1).max(20).required(),
    survey_version: joi_1.default.string().default('1.0').trim(),
});
// Utility functions
const handleError = (res, error, message = 'Internal server error') => {
    console.error(`Error: ${message}`, error);
    res.status(500).json({ success: false, error: message });
};
const validateInput = (schema, data) => {
    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
    if (error) {
        return { isValid: false, errors: error.details.map((d) => d.message) };
    }
    return { isValid: true, data: value };
};
// API Routes
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'Survey API is running' });
});
app.post('/survey/submit', async (req, res) => {
    try {
        const supabase = getSupabaseClient();
        if (!supabase) {
            return handleError(res, null, 'Supabase client not initialized');
        }
        const validation = validateInput(surveySubmissionSchema, req.body);
        if (!validation.isValid) {
            return res.status(400).json({ success: false, error: 'Validation failed', details: validation.errors });
        }
        const { participant, responses, survey_version } = validation.data;
        const { data: participantData, error: participantError } = await supabase
            .from('survey_participants')
            .insert([Object.assign({ id: (0, uuid_1.v4)() }, participant)])
            .select()
            .single();
        if (participantError)
            return handleError(res, participantError, 'Failed to create participant');
        const { data: submissionData, error: submissionError } = await supabase
            .from('survey_submissions')
            .insert([{
                id: (0, uuid_1.v4)(),
                participant_id: participantData.id,
                survey_version: survey_version || '1.0',
                completion_status: 'completed',
                submitted_at: new Date().toISOString(),
            }])
            .select()
            .single();
        if (submissionError)
            return handleError(res, submissionError, 'Failed to create submission');
        const responseData = responses.map((response) => (Object.assign({ id: (0, uuid_1.v4)(), submission_id: submissionData.id }, response)));
        const { error: responsesError } = await supabase.from('survey_responses').insert(responseData);
        if (responsesError)
            return handleError(res, responsesError, 'Failed to create responses');
        res.status(201).json({ success: true, message: 'Survey submitted successfully' });
    }
    catch (error) {
        handleError(res, error, 'Failed to submit survey');
    }
});
app.get('/survey/stats', async (req, res) => {
    try {
        const supabase = getSupabaseClient();
        if (!supabase) {
            return handleError(res, null, 'Supabase client not initialized');
        }
        const { count: participantCount, error: pError } = await supabase.from('survey_participants').select('*', { count: 'exact', head: true });
        if (pError)
            return handleError(res, pError, 'Failed to fetch stats');
        res.json({ success: true, data: { total_participants: participantCount } });
    }
    catch (error) {
        handleError(res, error, 'Failed to fetch stats');
    }
});
// Export the API to Firebase Functions
exports.api = v2_1.https.onRequest(app);
//# sourceMappingURL=index.js.map