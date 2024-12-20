import { createContext } from 'react';

export interface Metadata {
  apiBase: string;
}

const MetadataContext = createContext<
  [Metadata, React.Dispatch<React.SetStateAction<Metadata>>]
>({} as [Metadata, React.Dispatch<React.SetStateAction<Metadata>>]);

export default MetadataContext;
