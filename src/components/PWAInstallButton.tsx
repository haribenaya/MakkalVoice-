import { useState } from "react";
import { Download, Share, WifiOff, X } from "lucide-react";
import type { InnovationStrings } from "../data/innovationTranslations";
import { usePWAInstall } from "../hooks/usePWAInstall";

interface PWAInstallButtonProps {
  it: InnovationStrings;
}

export function PWAInstallButton({ it }: PWAInstallButtonProps) {
  const { canInstall, isIOS, promptInstall } = usePWAInstall();
  const [showIosModal, setShowIosModal] = useState(false);

  if (!canInstall) return null;

  const handleClick = async () => {
    if (isIOS) {
      setShowIosModal(true);
    } else {
      await promptInstall();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => void handleClick()}
        className="inline-flex items-center gap-1.5 h-10 px-3 text-xs font-medium text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/80 rounded-xl transition-colors whitespace-nowrap shrink-0"
      >
        <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">{it.installAppBtn}</span>
      </button>

      {showIosModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4"
        >
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 id="ios-install-title" className="font-display text-base font-semibold text-slate-950">
                {it.iosInstallTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowIosModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
                aria-label={it.iosInstallClose}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <ol className="mt-4 space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-semibold text-blue-700 mt-0.5">01.</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  <Share className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                  {it.iosInstallStep1}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-mono text-xs font-semibold text-blue-700 mt-0.5">02.</span>
                <span>{it.iosInstallStep2}</span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              className="mt-5 w-full py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              {it.iosInstallClose}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function OfflineIndicator({ it }: PWAInstallButtonProps) {
  const { isOnline } = usePWAInstall();
  if (isOnline) return null;

  return (
    <div
      role="status"
      className="no-print bg-amber-50 border-b border-amber-200 text-amber-950 px-4 py-2.5 text-xs sm:text-sm"
    >
      <div className="max-w-5xl mx-auto flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
        <span>{it.offlineBanner}</span>
      </div>
    </div>
  );
}
