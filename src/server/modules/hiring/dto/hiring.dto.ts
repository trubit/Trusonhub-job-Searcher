import { DecisionType } from '../../../database/models/HiringDecision.js';

export interface MakeDecisionDto {
  applicationId: string;
  decision: DecisionType;
  reason?: string;
  notes?: string;
}
