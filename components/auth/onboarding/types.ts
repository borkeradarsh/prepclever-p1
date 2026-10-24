export type Situation = "student" | "it_services" | "product_tech" | "non_tech";
export type YearsBand = "0-1" | "2-5" | "6-10" | "10+";
export type RoleId =
  | "ml_engineer"
  | "genai_llm"
  | "ai_platform_mlops"
  | "ai_data_engineer"
  | "applied_scientist"
  | "ai_backend"
  | "ai_architect";
export type OnboardingStep = "situation" | "role" | "payoff" | "done";

/** The accepted values, for validating anything read from a cookie or a request. */
export const SITUATIONS: Situation[] = ["student", "it_services", "product_tech", "non_tech"];
export const YEARS_BANDS: YearsBand[] = ["0-1", "2-5", "6-10", "10+"];
export const ROLE_IDS: RoleId[] = [
  "ml_engineer",
  "genai_llm",
  "ai_platform_mlops",
  "ai_data_engineer",
  "applied_scientist",
  "ai_backend",
  "ai_architect",
];
export const ONBOARDING_STEPS: OnboardingStep[] = ["situation", "role", "payoff", "done"];

export type OnboardingState = {
  situation: Situation | null;
  yearsBand: YearsBand | null;
  roleId: RoleId | null;
  roleIsDefault: boolean;
  currentStep: OnboardingStep;
  completedAt: string | null;
  updatedAt: string;
};

export const emptyOnboardingState = (): OnboardingState => ({
  situation: null,
  yearsBand: null,
  roleId: null,
  roleIsDefault: false,
  currentStep: "situation",
  completedAt: null,
  updatedAt: new Date().toISOString(),
});
