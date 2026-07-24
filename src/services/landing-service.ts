import { httpClient } from "@/services/http-client";

export type LandingSection = { sectionKey: string; content: Record<string, string>; visible: boolean };
export type LandingResponse = { sections: LandingSection[]; gallery: { media: { url: string; altText?: string } }[]; promotions: { title: string; description?: string }[] };

export async function getLanding(): Promise<LandingResponse> {
  const { data } = await httpClient.get<LandingResponse>("/api/public/landing");
  return data;
}
