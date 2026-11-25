import { useCallback, useEffect, useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map as GoogleMap,
  Pin,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import { Crosshair, Loader2, Map as MapIcon, MapPin } from "lucide-react";
import type { InnovationStrings } from "../data/innovationTranslations";
import type { GpsLocationResult } from "../types";
import { fetchMapsApiKey, requestReverseGeocode } from "../utils/api";

interface LocationPinpointPickerProps {
  it: InnovationStrings;
  language: string;
  lat?: number;
  lng?: number;
  disabled?: boolean;
  onLocationResolved: (result: GpsLocationResult) => void;
}

// Default center: Chennai / Central India fallback when no GPS pin yet
const DEFAULT_CENTER = { lat: 13.0827, lng: 80.2707 };

export function LocationPinpointPicker({
  it,
  language,
  lat,
  lng,
  disabled,
  onLocationResolved,
}: LocationPinpointPickerProps) {
  const [mapsApiKey, setMapsApiKey] = useState<string>("");
  const [showMap, setShowMap] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [pinPos, setPinPos] = useState<{ lat: number; lng: number } | null>(
    typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null,
  );
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(
    typeof lat === "number" && typeof lng === "number" ? { lat, lng } : DEFAULT_CENTER,
  );

  useEffect(() => {
    let active = true;
    void fetchMapsApiKey().then((key) => {
      if (active && key) setMapsApiKey(key);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (typeof lat === "number" && typeof lng === "number") {
      setPinPos({ lat, lng });
      setMapCenter({ lat, lng });
    }
  }, [lat, lng]);

  const resolveCoordinates = useCallback(
    async (targetLat: number, targetLng: number) => {
      setDetecting(true);
      setErrorText(null);
      setStatusMessage(null);
      setPinPos({ lat: targetLat, lng: targetLng });
      setMapCenter({ lat: targetLat, lng: targetLng });

      try {
        const result = await requestReverseGeocode(targetLat, targetLng);
        onLocationResolved(result);
        setStatusMessage(
          result.formattedAddress
            ? `${it.locationDetectedSuccess} (${result.formattedAddress})`
            : it.locationDetectedSuccess,
        );
      } catch (err) {
        setErrorText(
          language === "English" && err instanceof Error && err.message.trim()
            ? err.message
            : it.locationUnavailable,
        );
      } finally {
        setDetecting(false);
      }
    },
    [it.locationDetectedSuccess, it.locationUnavailable, language, onLocationResolved],
  );

  const handleDetectCurrentLocation = () => {
    if (disabled || detecting) return;
    setErrorText(null);
    setStatusMessage(null);

    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setErrorText(it.locationUnavailable);
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLat = position.coords.latitude;
        const nextLng = position.coords.longitude;
        setShowMap(true);
        void resolveCoordinates(nextLat, nextLng);
      },
      (geoErr) => {
        setDetecting(false);
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          setErrorText(it.locationPermissionDenied);
        } else {
          setErrorText(it.locationUnavailable);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 12_000,
        maximumAge: 30_000,
      },
    );
  };

  const handleMapClick = (event: MapMouseEvent) => {
    const latLng = event.detail.latLng;
    if (!latLng || detecting || disabled) return;
    void resolveCoordinates(latLng.lat, latLng.lng);
  };

  return (
    <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 sm:p-4 space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleDetectCurrentLocation}
            disabled={disabled || detecting}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors whitespace-nowrap min-h-[42px] disabled:opacity-50"
          >
            {detecting ? (
              <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
            ) : (
              <Crosshair className="w-4 h-4 shrink-0" aria-hidden="true" />
            )}
            <span>{detecting ? it.detectingLocation : it.detectLocationBtn}</span>
          </button>

          {mapsApiKey && (
            <button
              type="button"
              onClick={() => setShowMap((prev) => !prev)}
              disabled={disabled}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 bg-white border border-slate-300/90 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap min-h-[42px] disabled:opacity-50"
            >
              <MapIcon className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
              <span>{showMap ? it.hideMapPinBtn : it.showMapPinBtn}</span>
            </button>
          )}
        </div>

        {pinPos && (
          <div className="inline-flex items-center gap-1.5 text-xs font-mono tabular-nums text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" aria-hidden="true" />
            <span>
              {it.coordinatesLabel}: {pinPos.lat.toFixed(5)}, {pinPos.lng.toFixed(5)}
            </span>
          </div>
        )}
      </div>

      {statusMessage && (
        <p
          role="status"
          className="text-xs font-medium text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 leading-relaxed"
        >
          {statusMessage}
        </p>
      )}

      {errorText && (
        <p
          role="alert"
          className="text-xs text-amber-950 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 leading-relaxed"
        >
          {errorText}
        </p>
      )}

      {showMap && mapsApiKey && (
        <div className="space-y-2">
          <p className="text-xs text-slate-600">{it.mapPinHint}</p>
          <div className="w-full h-64 rounded-xl overflow-hidden border border-slate-300/90 bg-slate-100">
            <APIProvider apiKey={mapsApiKey}>
              <GoogleMap
                defaultCenter={mapCenter}
                center={mapCenter}
                defaultZoom={pinPos ? 16 : 11}
                mapId="DEMO_MAP_ID"
                gestureHandling="greedy"
                disableDefaultUI={false}
                streetViewControl={false}
                mapTypeControl={false}
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                onClick={handleMapClick}
                className="w-full h-full"
              >
                {pinPos && (
                  <AdvancedMarker
                    position={pinPos}
                    draggable
                    onDragEnd={(e) => {
                      const pos = e.latLng;
                      if (pos) {
                        void resolveCoordinates(pos.lat(), pos.lng());
                      }
                    }}
                  >
                    <Pin background="#1d4ed8" glyphColor="#ffffff" borderColor="#1e3a8a" />
                  </AdvancedMarker>
                )}
              </GoogleMap>
            </APIProvider>
          </div>
        </div>
      )}
    </div>
  );
}
