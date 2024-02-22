import React, { Dispatch, SetStateAction, useEffect } from "react";
import styles from "./LanguageToggle.module.scss";
import { cubicBezier, motion } from "framer-motion";
const LanguageToggle = ({
    loading,
    language,
    setLanguage,
}: {
    loading: boolean;
    language: string;
    setLanguage: Dispatch<SetStateAction<string>>;
}) => {
    return (
        <motion.div
            animate={
                loading
                    ? {
                          opacity: 0.4,
                          pointerEvents: "none",
                          cursor: "not-allowed",
                      }
                    : { opacity: 1, pointerEvents: "all", cursor: "pointer" }
            }
            className={styles.container}
            onClick={() =>
                setLanguage((prev) => {
                    return prev == "en" ? "de" : "en";
                })
            }
        >
            <motion.div
                className={styles.language}
                animate={language == "en" ? { opacity: 1 } : { opacity: 0.4 }}
                transition={{ ease: cubicBezier(0.3, 1.01, 0.54, 0.97) }}
            >
                en
            </motion.div>
            <motion.div
                className={styles.language}
                initial={{ opacity: 0.4 }}
                animate={language == "de" ? { opacity: 1 } : { opacity: 0.4 }}
                transition={{ ease: cubicBezier(0.3, 1.01, 0.54, 0.97) }}
            >
                de
            </motion.div>
            <motion.div
                className={styles.toggle}
                animate={language == "en" ? { left: "0%" } : { left: "45%" }}
                transition={{ ease: cubicBezier(0.3, 1.01, 0.54, 0.97) }}
            />
        </motion.div>
    );
};

export default LanguageToggle;
