export type P1FollowupOverallStatus = 'answered' | 'skipped' | 'missing';

export type P1FollowupPackStatus = {
  precision?: P1FollowupOverallStatus;
  deep?: P1FollowupOverallStatus;
  overall?: P1FollowupOverallStatus;
};

export type P1SystemicCardId =
  | 'mission_cash'
  | 'gouvernance_decision'
  | 'dependance_mortelle'
  | 'capacite_reelle'
  | 'pilotage_reporting'
  | 'controles_internes';

export type P1FollowupsMeta = {
  b1?: Record<string, P1FollowupPackStatus>;
  b3?: Record<string, P1FollowupPackStatus>;
  systemic?: Partial<Record<P1SystemicCardId, P1FollowupOverallStatus>>;
};

export type P1TensionBand = 'very_low' | 'low' | 'medium' | 'high' | 'very_high';
