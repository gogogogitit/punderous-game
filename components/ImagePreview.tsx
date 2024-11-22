'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Alert, AlertTitle, AlertDescription } from '@/shadcn-backup/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ImagePreviewProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt, width, height }) => {
  const [error, setError] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-white">
      {!error && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
          priority
        />
      )}
      {error && (
        <Alert variant="destructive" className="m-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Image</AlertTitle>
          <AlertDescription>
            Failed to load {src}. Please verify the file exists in the public directory.
          </AlertDescription>
        </Alert>
      )}
      {!error && !loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse bg-gray-200 w-full h-full" />
        </div>
      )}
    </div>
  );
};

export default ImagePreview;