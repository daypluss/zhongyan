import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Set your desk" };

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
