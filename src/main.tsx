import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Tier 1 Google Maps Platform Demo Key Quota Detection
// Catches Maps JS SDK auth/quota errors (gm_authFailure & OverQuotaMapError)
declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}

window.gm_authFailure = () => {
  window.dispatchEvent(new CustomEvent("gmp-quota-exceeded"));
};

const originalConsoleError = console.error.bind(console);
console.error = (...args: unknown[]) => {
  try {
    const joined = args.map((a) => (typeof a === "string" ? a : String(a ?? ""))).join(" ");
    if (/OverQuotaMapError|QuotaExceededError|OVER_QUERY_LIMIT|RESOURCE_EXHAUSTED/i.test(joined)) {
      window.dispatchEvent(new CustomEvent("gmp-quota-exceeded"));
    }
  } catch {
    // Ignore inspection error
  }
  originalConsoleError(...args);
};

createRoot(document.getElementById("root")!).render(<App />);
