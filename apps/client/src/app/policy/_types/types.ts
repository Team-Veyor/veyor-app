export interface Consent {
  type: 'privacy' | 'terms' | 'marketing';
  agreed: boolean;
  agreedAt: string;
}
