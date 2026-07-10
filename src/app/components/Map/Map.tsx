"use client";

import { useRef, useCallback } from "react";
import MapGL, { Marker, NavigationControl, GeolocateControl } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import type { RestaurantData } from "@/lib/types";
import "maplibre-gl/dist/maplibre-gl.css";

type Props = {
  restaurants: RestaurantData[];
  onMarkerClick: (restaurant: RestaurantData) => void;
};

// 珍食レベルに応じたマーカーの色
const getDangerLevelStyle = (level: number) => {
  const styles = [
    { bg: "bg-green-500", border: "border-green-600" },
    { bg: "bg-lime-500", border: "border-lime-600" },
    { bg: "bg-yellow-500", border: "border-yellow-600" },
    { bg: "bg-orange-500", border: "border-orange-600" },
    { bg: "bg-red-500", border: "border-red-600" },
  ];
  return styles[level - 1] || styles[0];
};

export function Map({ restaurants, onMarkerClick }: Props) {
  const mapRef = useRef<MapRef>(null);

  const handleGeolocate = useCallback(() => {
    // 現在地取得時の処理（必要に応じて）
  }, []);

  return (
    <MapGL
      ref={mapRef}
      initialViewState={{
        longitude: 139.7032,
        latitude: 35.6762,
        zoom: 12,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="https://tile.openstreetmap.jp/styles/osm-bright-ja/style.json"
    >
      {/* ナビゲーションコントロール */}
      <NavigationControl position="top-right" />

      {/* 現在地追従ボタン */}
      <GeolocateControl
        position="top-right"
        trackUserLocation
        onGeolocate={handleGeolocate}
      />

      {/* 飲食店マーカー */}
      {restaurants.map((restaurant) => {
        const avgLevel = restaurant.reviewAverageDangerLevel;
        const roundedLevel = Math.round(avgLevel);
        const style = getDangerLevelStyle(roundedLevel || 1);
        return (
          <Marker
            key={restaurant.id}
            longitude={restaurant.longitude}
            latitude={restaurant.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onMarkerClick(restaurant);
            }}
          >
            <div
              className={`
                w-8 h-8 rounded-full ${style.bg} border-2 ${style.border}
                flex items-center justify-center cursor-pointer
                shadow-lg hover:scale-110 transition-transform
              `}
            >
              <span className="text-white text-xs font-bold">
                {roundedLevel}
              </span>
            </div>
          </Marker>
        );
      })}
    </MapGL>
  );
}
