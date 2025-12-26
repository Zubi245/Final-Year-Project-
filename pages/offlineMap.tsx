import React, { useState } from 'react';
import { Spot } from '../types';

interface Props {
  spots: Spot[];
}

export const OfflineMap: React.FC<Props> = ({ spots }) => {
  const [selected, setSelected] = useState<Spot | null>(null);

  // Pakistan bounds
  const minLat = 23.5, maxLat = 37.5;
  const minLng = 60.5, maxLng = 78.0;

  const getPosition = (lat: number, lng: number) => {
    const top = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    const left = ((lng - minLng) / (maxLng - minLng)) * 100;
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">

      {/* Pakistan Label */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <span className="text-7xl font-extrabold tracking-widest">
          PAKISTAN
        </span>
      </div>

      {/* Border */}
      <div className="absolute inset-6 border-2 border-dashed border-gray-400 rounded-3xl"></div>

      {/* Markers */}
      {spots.map(spot => {
        const pos = getPosition(
          spot.coordinates.lat,
          spot.coordinates.lng
        );
        return (
          <button
            key={spot.id}
            className="absolute w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-lg -translate-x-1/2 -translate-y-1/2"
            style={{ top: pos.top, left: pos.left }}
            onClick={() => setSelected(spot)}
          />
        );
      })}

      {/* Info Card */}
      {selected && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white p-4 rounded-xl shadow-2xl w-72">
          <div className="flex gap-3">
            <img
              src={selected.imageUrl}
              alt={selected.name}
              className="w-16 h-16 rounded object-cover"
            />
            <div>
              <h3 className="font-bold text-sm">
                {selected.name}
              </h3>
              <p className="text-xs text-gray-500">
                {selected.region}
              </p>
              <p className="text-xs mt-1">
                ⭐ {selected.rating}
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelected(null)}
            className="mt-2 text-xs text-emerald-600 hover:underline"
          >
            Close
          </button>
        </div>
      )}

      {/* Offline Badge */}
      <div className="absolute top-4 right-4 bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-semibold">
        Offline Map Mode
      </div>
    </div>
  );
};
