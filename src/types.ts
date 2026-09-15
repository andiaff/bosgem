export interface Scene {
  time: string;
  visual: string;
  vo: string;
  voice_over?: string;
  words?: number;
}

export interface LockedVoiceOver {
  gender_age_accent: string;
  style: string;
  intonation: string;
  tempo: string;
  delivery?: string;
  continuity?: string;
  continuity_lock?: string;
}

export type VideoConceptId = "social_proof" | "stress_test" | "unboxing_viral" | "problem_solution";

export interface VideoConceptOption {
  id: VideoConceptId;
  title: string;
  subtitle: string;
  tag: string;
  badge: string;
  accentColor: string;
  hookThreeSeconds: string;
  p1Summary: string;
  p2Summary: string;
  p3Summary: string;
  bestFor?: string;
}

export interface ProductReferencePriority {
  rule: string;
  preserve: string[];
  colors: string[];
}

export interface CharacterBehavior {
  rule: string;
  no_lip_sync: boolean;
  communication: string;
  shoppers?: string;
}

export interface AbsoluteCleanFrame {
  rule: string;
  forbidden: string[];
}

export interface VideoPrompt {
  prompt_title?: string;
  prompt_type?: string;
  duration?: string;
  aspect_ratio?: string;
  resolution?: string;
  product?: string;
  creative_concept?: string;
  continuity?: any;
  visual_style?: string;
  product_reference_priority?: ProductReferencePriority;
  product_identity_lock?: any;
  voice_over?: LockedVoiceOver;
  voice_identity?: LockedVoiceOver;
  character_behavior?: CharacterBehavior;
  absolute_clean_frame?: AbsoluteCleanFrame;
  hard_fail_conditions?: string[];
  scenes: Scene[];
  story?: Scene[];
  cta?: string;
  negative_constraints?: string[];
}

export interface CampaignPrompts {
  VIDEO_PROMPT_1: VideoPrompt;
  VIDEO_PROMPT_2: VideoPrompt;
  VIDEO_PROMPT_3: VideoPrompt;
}

export type TabType = "overview" | "prompts" | "simulator" | "persona" | "rules" | "builder";

export interface ProductLinkMeta {
  url?: string;
  platform: "shopee" | "tiktok" | "other";
  title?: string;
  productType?: string;
  productName?: string;
  description?: string;
  imageUrl?: string;
  price?: string;
  fetchedAt?: string;
  isShortlinkProtected?: boolean;
}
