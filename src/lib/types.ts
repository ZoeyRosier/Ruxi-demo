export type ThemeId = "brand" | "santi" | "long-xiang-si" | "qing-yu-nian" | "fanhua";

export type BranchType = "high" | "medium" | "low";

export interface KnowledgeSourceCheck {
  usedAiredContent: boolean;
  usedCharacterDossier: boolean;
  spoilerDetected: boolean;
}

export interface DramaMeta {
  id: string;
  name: string;
  title: string;
  description: string;
  containerName: string;
  themeId: ThemeId;
  status: "active" | "coming-soon";
}

export interface DramaIdentity {
  id: string;
  dramaId: string;
  name: string;
  codeName: string;
  faction: string;
  description: string;
  isAvailable: boolean;
  comingSoonLabel?: string;
}

export interface InterventionNode {
  id: string;
  dramaId: string;
  title: string;
  episodeNumber: number;
  triggerTimestamp: number;
  triggerTimecode: string;
  desc?: string;
  location?: string;
  videoMappingKey: string;
  identityId: string;
  promptKey: string;
  branchVideoKeys: {
    high: string;
    medium: string;
    low: string;
  };
}

export interface ScoreBreakdown {
  completeness: number;
  emotion: number;
  motivation: number;
  consistency: number;
}

export interface JudgmentResult {
  scores: ScoreBreakdown;
  total: number;
  branch: BranchType;
  reasoning: string;
  knowledgeSourceCheck?: KnowledgeSourceCheck;
  isFallback: boolean;
  fallbackReason?: string;
  durationMs: number;
}

export interface JudgeRequest {
  dramaId: string;
  nodeId: string;
  userMessage: string;
}

export interface UserSessionProfile {
  userId: string;
  isAuthenticated: boolean;
  displayName?: string;
}

export interface UserInterventionRecord {
  id: string;
  userId: string;
  dramaId: string;
  nodeId: string;
  identityId: string;
  userMessage: string;
  judgment: JudgmentResult;
  endingText: string;
  createdAt: number;
}

export interface CharacterDossier {
  id: string;
  dramaId: string;
  name: string;
  coreValues: string[];
  speechStyle: string;
  facts: string[];
}

export interface AiredEvent {
  id: string;
  episode: number;
  timecode: string;
  description: string;
}

export interface AiredEventsManifest {
  dramaId: string;
  nodeId: string;
  upToEpisode: number;
  upToTimestamp: number;
  events: AiredEvent[];
}
