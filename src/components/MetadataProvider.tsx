import { useState } from 'react';
import { Outlet } from 'react-router';
import MetadataContext, { Metadata } from '../contexts/MetadataContext';

const defaults = {
  apiBase: '/api',
};

export default function Root() {
  const [metadata, setMetadata] = useState<Metadata>(defaults);

  return (
    <MetadataContext.Provider value={[metadata, setMetadata]}>
      <Outlet />
    </MetadataContext.Provider>
  );
}
