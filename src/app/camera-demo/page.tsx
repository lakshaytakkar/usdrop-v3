"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CameraMovementPage() {
    // We'll use the vertical images found
    const images = [
        "/login-bg-vertical.png",
        "/login-bg-vertical-purple.png"
    ];

    const [currentImage, setCurrentImage] = useState(0);

    // Cycle through images every 10 seconds if needed, or just show one.
    // The user asked for "camera movement video around this".
    // Let's do a slow pan and zoom effect (Ken Burns).

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {images.map((src, index) => (
                <motion.div
                    key={src}
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: index === currentImage ? 1 : 0,
                        scale: index === currentImage ? [1, 1.2] : 1,
                        y: index === currentImage ? ["0%", "-10%"] : "0%"
                    }}
                    transition={{
                        opacity: { duration: 1 },
                        scale: { duration: 15, ease: "linear" },
                        y: { duration: 15, ease: "linear" }
                    }}
                    style={{
                        backgroundImage: `url(${src})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: index === currentImage ? 1 : 0
                    }}
                />
            ))}

            <div className="absolute bottom-10 left-10 z-10 text-white">
                <h1 className="text-4xl font-bold mb-2">Login Background</h1>
                <p className="text-xl opacity-80">Vertical Camera Movement Demo</p>
            </div>
        </div>
    );
}
