import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function buildTwitterShareUrl(projectName: string): string {
  const url = `https://pilot.smoothsend.xyz/?partner=${encodeURIComponent(projectName)}`;
  const tweet = `Preparing for the AIP-141 gas spike. Just applied to the @SmoothSend Pilot Program to bring 100% gasless txs to ${projectName} on @Aptos ⛽🚫\n\n${url}`;
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
}
