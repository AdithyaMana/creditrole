/**
 * Survey API Service
 * 
 * This service handles all API calls to the backend survey system.
 * It provides methods for submitting surveys, retrieving results,
 * and updating incomplete surveys.
 */

interface ParticipantData {
  age: number;
  field_of_study: string;
}

interface SurveyResponse {
  role_title: string;
  assigned_icon: string;
  response_order: number;
}

interface SurveySubmission {
  participant: ParticipantData;
  responses: SurveyResponse[];
  survey_version?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
  details?: Array<{ field: string; message: string }>;
}

class SurveyApiService {
  private baseUrl: string;

  constructor() {
    // Use environment variable or default to localhost for development
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  /**
   * Submit a complete survey
   */
  async submitSurvey(submission: SurveySubmission): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/survey/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error submitting survey:', error);
      throw error;
    }
  }

  /**
   * Get survey results by participant ID
   */
  async getSurveyResults(participantId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/survey/results/${participantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching survey results:', error);
      throw error;
    }
  }

  /**
   * Update an incomplete survey
   */
  async updateSurvey(
    submissionId: string, 
    responses: SurveyResponse[], 
    completionStatus: 'incomplete' | 'completed' = 'incomplete'
  ): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/survey/update/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses,
          completion_status: completionStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error updating survey:', error);
      throw error;
    }
  }

  /**
   * Get survey statistics
   */
  async getSurveyStats(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/survey/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching survey stats:', error);
      throw error;
    }
  }

  /**
   * Check API health
   */
  async checkHealth(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const surveyApi = new SurveyApiService();

// Export types for use in components
export type {
  ParticipantData,
  SurveyResponse,
  SurveySubmission,
  ApiResponse
};