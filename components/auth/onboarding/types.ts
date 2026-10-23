export type Situation = "student" | "it_services" | "product_tech" | "non_tech";
export type YearsBand = "0-2" | "3-5" | "6-10" | "10+";
export type RoleId = "genai_llm" | "ml_mlops" | "ai_platform" | "ai_data" | "backend_to_ai";
export type OnboardingStep = "situation" | "role" | "payoff" | "done";

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
