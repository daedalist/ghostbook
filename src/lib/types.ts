export interface GhostData {
  evidence_list: string[];
  fake_evidence_list: string[];
  strength: string;
  weakness: string;
}

export type GhostDataMap = Record<string, GhostData>;
