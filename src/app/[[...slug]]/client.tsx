'use client';

import dynamic from 'next/dynamic';

const Ghostbook = dynamic(() => import('../../components/Ghostbook'), { 
  ssr: false, 
});

export function ClientOnly() {
  return <Ghostbook />;
}