import type { LucideIcon } from "lucide-react";
import {
  ArrowUpCircle,
  Baby,
  Building2,
  Droplets,
  FileSearch,
  FileText,
  HeartHandshake,
  HelpCircle,
  Landmark,
  Laptop,
  Scale,
  ShieldAlert,
  ShoppingBag,
  Train,
  Wrench,
  Zap,
} from "lucide-react";
import type { ComplaintCategory, SubmissionMode } from "../types";

export function getCategoryIcon(category: ComplaintCategory | string): LucideIcon {
  switch (category) {
    case "Civic Issues":
      return Building2;
    case "Consumer Complaints":
      return ShoppingBag;
    case "Public Safety":
      return ShieldAlert;
    case "Legal Assistance":
      return Scale;
    case "Government Services":
      return Landmark;
    default:
      return HelpCircle;
  }
}

export function getSubmissionModeIcon(mode: SubmissionMode): LucideIcon {
  switch (mode) {
    case "rti":
      return FileSearch;
    case "escalation":
      return ArrowUpCircle;
    default:
      return FileText;
  }
}

export function getSampleScenarioIcon(index: number): LucideIcon {
  if (index === 0) return Droplets;
  if (index === 1) return Zap;
  return Wrench;
}

export function getPortalIcon(portalId?: string): LucideIcon {
  if (!portalId) return Landmark;
  if (portalId.includes("tangedco") || portalId.includes("bescom") || portalId.includes("mahavitaran")) {
    return Zap;
  }
  if (portalId.includes("cmwssb")) return Droplets;
  if (portalId.includes("gcc") || portalId.includes("rbi")) return Building2;
  if (portalId.includes("rail")) return Train;
  if (portalId.includes("cyber")) return ShieldAlert;
  if (portalId.includes("consumer")) return ShoppingBag;
  if (portalId.includes("nalsa") || portalId.includes("legal")) return Scale;
  if (portalId.includes("rti")) return FileSearch;
  return Landmark;
}

export function getHelplineIcon(number: string): LucideIcon {
  switch (number) {
    case "112":
      return ShieldAlert;
    case "1930":
      return Laptop;
    case "1915":
      return ShoppingBag;
    case "139":
      return Train;
    case "181":
      return HeartHandshake;
    case "1098":
      return Baby;
    default:
      return ShieldAlert;
  }
}
