export type CompleteSurveyResponse = {
  participationId: string;
  surveyId: string;
  status: 'completed';
  reward: {
    amount: number;
    status: 'pending' | 'paid';
  };
};
