"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle, AlertCircle } from 'lucide-react';

interface ImageData {
  prompt: string;
  url: string;
  filename: string;
}

export default function DownloadLandingImagesPage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());
  const [isDownloading, setIsDownloading] = useState(false);

  const extractImages = () => {
    const imageData: ImageData[] = [];
    
    // Find all img elements with data URLs
    const imgElements = document.querySelectorAll('img[src^="data:image"]');
    
    imgElements.forEach((img, index) => {
      const src = (img as HTMLImageElement).src;
      if (src.startsWith('data:image')) {
        // Try to get prompt from nearby elements or generate a name
        const alt = (img as HTMLImageElement).alt || `image-${index + 1}`;
        const filename = `landing-${alt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index + 1}.png`;
        
        imageData.push({
          prompt: alt,
          url: src,
          filename: filename
        });
      }
    });

    setImages(imageData);
  };

  const downloadImage = async (image: ImageData) => {
    try {
      // Convert data URL to blob
      const response = await fetch(image.url);
      const blob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setDownloaded(prev => new Set([...prev, image.filename]));
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

  const downloadAll = async () => {
    setIsDownloading(true);
    try {
      for (const image of images) {
        await downloadImage(image);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Download Landing Page Images</h1>
          <p className="text-slate-600 mb-6">
            This utility helps you extract and download all generated images from the landing page.
            First, navigate to the landing page and let all images load, then come back here.
          </p>
          
          <div className="flex gap-4 mb-6">
            <Button onClick={extractImages} className="bg-blue-600 hover:bg-blue-700">
              Extract Images from Page
            </Button>
            {images.length > 0 && (
              <Button 
                onClick={downloadAll} 
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All ({images.length})
              </Button>
            )}
          </div>

          {images.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-blue-600 inline mr-2" />
              <span className="text-blue-800">
                No images found. Make sure you've visited the landing page and images have loaded, then click "Extract Images from Page".
              </span>
            </div>
          )}

          {images.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-slate-700 mb-2">
                Found {images.length} images:
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                {images.map((image, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {image.filename}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {image.prompt}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => downloadImage(image)}
                      disabled={downloaded.has(image.filename)}
                      className="ml-4"
                    >
                      {downloaded.has(image.filename) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Downloaded
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-600">
            <li>Navigate to the landing page (/) and wait for all images to generate and load</li>
            <li>Come back to this page</li>
            <li>Click "Extract Images from Page" to find all generated images</li>
            <li>Click "Download All" to download all images, or download them individually</li>
            <li>Save the downloaded images to <code className="bg-slate-100 px-1 rounded">usdrop-v3/public/images/landing/</code></li>
            <li>Update the components to use static images instead of GeneratedImage</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

