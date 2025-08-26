import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ItemNotAvailable() {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDotCount((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center p-8 font-century-gothic">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-md"
      >
        {/* Animated sad plate emoji */}
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
          <div className="text-8xl mb-4">🍽️</div>
        </motion.div>

        {/* Main message */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
            Oops!
          </h2>
          <p className="text-xl text-[var(--color-muted-foreground)]">
            This delicious item is not available in your location
          </p>
        </motion.div>

        {/* Animated loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center items-center space-x-1 text-[var(--color-muted-foreground)]"
        >
          <span>Checking other locations</span>
          <span className="ml-1">{".".repeat(dotCount)}</span>
        </motion.div>

        {/* Animated food icons */}
        <div className="relative h-16 mt-6">
          <motion.div
            className="absolute left-1/4 text-3xl"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 0,
            }}
          >
            🚫
          </motion.div>
          <motion.div
            className="absolute right-1/4 text-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.8,
            }}
          >
            📍
          </motion.div>
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 text-3xl"
            animate={{
              x: [-8, 8, -8],
              rotate: [0, 360],
            }}
            transition={{
              x: { duration: 3, repeat: Infinity },
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
            }}
          >
            🔍
          </motion.div>
        </div>

        {/* Suggestion text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-[var(--color-muted-foreground)] bg-[var(--color-muted)]/20 rounded-lg p-4 mt-6"
        >
          <p className="mb-2 text-lg">
            💡 <strong>Try this:</strong>
          </p>
          <ul className="text-left space-y-1 text-sm">
            <li>• Change your delivery location</li>
            <li>• Browse similar items available nearby</li>
            <li>• Check back later for updates</li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-400 rounded-full"
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
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-yellow-400 rounded-full"
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
