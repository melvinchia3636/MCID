import React from 'react';

export default function Custom404() {
  return (
    <div className="flex items-center justify-center w-full h-screen text-neutral-600">
      <div className="flex items-center gap-3">
        <h1 className="font-medium text-xl tracking-[0.325em]">404</h1>
        <div className="h-8 border-r-2 border-neutral-600" />
        <p className="font-medium text-base ml-2 uppercase tracking-[0.325em]">Page Not Found</p>
      </div>
    </div>
  );
}
