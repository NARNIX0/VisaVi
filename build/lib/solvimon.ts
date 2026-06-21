// Mocked Solvimon billing integration.
// Replace these placeholder values with real keys from your Solvimon dashboard.
export const SOLVIMON_CONFIG = {
  apiKey:
    process.env.NEXT_PUBLIC_SOLVIMON_API_KEY ?? "sk_test_placeholder_solvimon_key",
  merchantId:
    process.env.NEXT_PUBLIC_SOLVIMON_MERCHANT_ID ?? "merchant_placeholder",
  baseUrl: "https://api.solvimon.example/v1",
};

export interface ProPlan {
  name: string;
  price: string;
  credits: number;
  perks: string[];
}

export const PRO_PLAN: ProPlan = {
  name: "Visavi Pro",
  price: "£19/mo",
  credits: 100,
  perks: [
    "100 credits every month",
    "Unlimited One-Click Apply",
    "Unlimited AI mock interviews",
    "Recruiter contact details",
  ],
};

export const FREE_PLAN: ProPlan = {
  name: "Free",
  price: "£0",
  credits: 12,
  perks: [
    "12 credits to start",
    "Job discovery & AI match scores",
    "Application tracking (Kanban)",
    "Basic interview prep",
  ],
};

/** What each credit-consuming action costs in the demo. */
export const CREDIT_COSTS = {
  oneClickApply: 2,
  mockInterview: 1,
} as const;

// Mocked purchase — pretends to call Solvimon and grants the plan's credits.
export async function purchaseProPlan(): Promise<{ credits: number }> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { credits: PRO_PLAN.credits };
}
