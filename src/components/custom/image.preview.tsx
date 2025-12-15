"use client";

import React, { useState } from "react";
import Image from "rc-image";
import "rc-image/assets/index.css";
import {
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  FlipHorizontal,
  X,
  Eye,
} from "lucide-react";

interface ImagePreviewProps {
  imageSrc: string;
  alt: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageSrc, alt }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className=" relative w-[250px] h-[250px] bg-[#2a2a2a] flex items-center justify-center rounded cursor-pointer overflow-hidden hover:opacity-80 "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image
        src={imageSrc}
        alt={alt}
        style={{
          width: 250,
          height: 250,
        }}
        preview={{
          icons: {
            rotateLeft: <RotateCcw />,
            rotateRight: <RotateCw />,
            zoomIn: <ZoomIn />,
            zoomOut: <ZoomOut />,
            flipX: <FlipHorizontal />,
            flipY: (
              <FlipHorizontal
                style={{ transform: "rotate(90deg) scaleY(-1)" }}
              />
            ),
            close: <X />,
          },
        }}
      />

      {hovered && (
        <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[18px] font-bold flex items-center gap-1 bg-black/50 px-4 py-2 rounded-full ">
          <Eye className="text-[18px]" />
          Preview
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
