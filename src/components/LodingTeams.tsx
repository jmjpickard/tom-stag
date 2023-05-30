import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import type { Variants } from "framer-motion";

const LoadingTeams: React.FC = () => {
  const phraseVariants: Variants = {
    initial: {
      y: 0,
    },
    animate: {
      y: [-10, 10, -5, 5, -2, 2, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
      },
    },
  };

  const textAnimation = useAnimation();

  useEffect(() => {
    async () => {
      await textAnimation.start("animate");
    };
  }, [textAnimation]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <motion.h1
        style={{
          fontFamily: "Courier New",
          fontSize: "32px",
          fontWeight: "bold",
          color: "white",
          display: "flex",
          alignItems: "center",
          transform: "translate3d(0, 0, 0)",
        }}
        initial="initial"
        animate={textAnimation}
        variants={phraseVariants}
      >
        Loading Teams
        <motion.span
          style={{
            width: "20px",
            height: "20px",
            marginLeft: "8px",
            borderRadius: "50%",
            backgroundColor: "white",
          }}
          initial="initial"
          animate={textAnimation}
          variants={phraseVariants}
        />
      </motion.h1>
    </div>
  );
};

export default LoadingTeams;
