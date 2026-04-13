export type NewsCategory = "sports" | "entertainment" | "global" | "local";

export const categoryConfig: Record<NewsCategory, { label: string; emoji: string; color: string }> = {
  sports: { label: "Sports", emoji: "⚽", color: "bg-fun-orange" },
  entertainment: { label: "Entertainment", emoji: "🎬", color: "bg-fun-pink" },
  global: { label: "Global", emoji: "🌍", color: "bg-primary" },
  local: { label: "Local News", emoji: "🏘️", color: "bg-fun-green" },
};

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu & Kashmir", "Ladakh",
] as const;

export type IndianState = (typeof indianStates)[number];
