import React from 'react';

export default function FlyToBagLayer({ flyItems }) {
  if (!flyItems.length) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {flyItems.map((item) => (
        <div
          key={item.id}
          className="animate-fly-to-bag fixed flex h-14 w-11 items-center justify-center overflow-hidden rounded-xl border-2 border-[#181615] bg-white shadow-2xl"
          style={{
            left: `${item.startX - 22}px`,
            top: `${item.startY - 28}px`,
            '--tx': `${item.deltaX}px`,
            '--ty': `${item.deltaY}px`
          }}
        >
          <img
            src={item.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
