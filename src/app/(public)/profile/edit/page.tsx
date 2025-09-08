"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function UnderConstruction() {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDotCount((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center p-8 font-century-gothic relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md z-10"
      >
        {/* Animated construction emoji */}
        <motion.div
          animate={{
            rotate: [0, -10, 10, -5, 5, 0],
            y: [0, -5, 0],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, repeatDelay: 1 },
            y: { duration: 1.5, repeat: Infinity },
          }}
        >
          <div className="text-8xl mb-4">🚧</div>
        </motion.div>

        {/* Main message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-accent mb-2">
            Page Under Construction
          </h2>
          <p className="text-xl text-accent">
            We’re working hard to bring you something amazing!
          </p>
        </motion.div>

        {/* Animated loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center items-center space-x-1 text-accent"
        >
          <span>Loading</span>
          <span className="ml-1">{".".repeat(dotCount)}</span>
        </motion.div>

        {/* Suggestion text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-accent bg-[var(--color-muted)]/20 rounded-lg p-4 mt-6"
        >
          <p className="mb-2 text-lg">
            🔔 <strong>Check back soon</strong>
          </p>
          <ul className="text-left space-y-1 text-sm">
            <li>• Meanwhile, explore other sections</li>
            <li>• Thank you for your patience 🙏</li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-orange-400 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-red-400 rounded-full"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity },
          }}
        />
      </div>
    </div>
  );
}
