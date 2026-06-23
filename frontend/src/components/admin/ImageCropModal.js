'use client';
import { useState, useRef, useEffect } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose, IoCheckmark, IoRefresh } from 'react-icons/io5';

// Helper function to center crop
function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function ImageCropModal({ 
  isOpen, 
  onClose, 
  onCropComplete, 
  imageFile 
}) {
  const [crop, setCrop] = useState(undefined);
  const [rotation, setRotation] = useState(0);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const imgRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // Reset crop when modal opens with new image
  useEffect(() => {
    if (isOpen && imageFile) {
      const timer = setTimeout(() => {
        setCrop(undefined);
        setCompletedCrop(null);
        setRotation(0);
        setImageLoaded(false);
        setIsFirstLoad(true);
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, imageFile]);

  if (!isOpen || !imageFile) return null;

  const imageUrl = URL.createObjectURL(imageFile);

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    setImageLoaded(true);
    
    if (isFirstLoad) {
      // Use aspect 1:1 for square crop (best for profile photos)
      const initialCrop = centerAspectCrop(width, height, 1);
      setCrop(initialCrop);
      setCompletedCrop(initialCrop);
      setIsFirstLoad(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const generateCroppedImage = async () => {
    if (!completedCrop || !imgRef.current || !imageLoaded) {
      alert('Please wait for the image to load and select a crop area');
      return;
    }

    setIsProcessing(true);

    try {
      const image = imgRef.current;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const cropWidth = completedCrop.width * scaleX;
      const cropHeight = completedCrop.height * scaleY;
      const cropX = completedCrop.x * scaleX;
      const cropY = completedCrop.y * scaleY;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Use 800x800 for square images
      const SIZE = 800;

      canvas.width = SIZE;
      canvas.height = SIZE;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw the cropped area
      ctx.drawImage(
        image,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        SIZE,
        SIZE
      );

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.95);
      });

      if (!blob) {
        throw new Error('Failed to create image');
      }

      const croppedFile = new File(
        [blob],
        `profile_${Date.now()}.jpg`,
        {
          type: 'image/jpeg',
          lastModified: Date.now(),
        }
      );

      onCropComplete(croppedFile);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    URL.revokeObjectURL(imageUrl);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-dark-card rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">Crop Profile Image</h2>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/10 rounded-lg transition-all cursor-pointer text-white"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Image Crop Area */}
          <div className="p-4 max-h-[60vh] overflow-auto">
            {imageUrl && (
              <div className="flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(newCrop) => {
                    setCrop(newCrop);
                    if (newCrop) {
                      setCompletedCrop(newCrop);
                    }
                  }}
                  onComplete={(c) => {
                    if (c) {
                      setCompletedCrop(c);
                    }
                  }}
                  aspect={1}
                  // Removed circularCrop for square crop
                  minWidth={50}
                  minHeight={50}
                  className="max-h-[50vh] w-auto"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={imageUrl}
                    alt="Crop preview"
                    onLoad={onImageLoad}
                    style={{ 
                      maxHeight: '50vh', 
                      maxWidth: '100%',
                      transform: `rotate(${rotation}deg)`,
                      transition: 'transform 0.3s ease'
                    }}
                    className="object-contain"
                  />
                </ReactCrop>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleRotate}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-sm text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  <IoRefresh size={18} />
                  Rotate
                </button>
                <span className="text-xs text-gray-400">
                  {rotation}° rotation
                </span>
                <span className="text-xs text-gray-500 ml-2 px-2 py-1 bg-primary/10 text-primary rounded">
                  Square crop (1:1)
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-white/5 rounded-xl text-sm text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={generateCroppedImage}
                  disabled={isProcessing || !completedCrop || !imageLoaded}
                  className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <IoCheckmark size={18} />
                      Crop & Save
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Drag the crop area to select your image. Use rotate to adjust orientation. The image will be cropped to a square (1:1) for your profile.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}