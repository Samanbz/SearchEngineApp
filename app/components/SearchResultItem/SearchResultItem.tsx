"use client";
import React, { useEffect, useState } from "react";
import SearchResult from "../types/SearchResult";
import styles from "./SearchResultItem.module.scss";
import Image from "next/image";
import { motion } from "framer-motion";
const SearchResultItem = ({
    searchResult,
    index,
}: {
    searchResult: SearchResult;
    index: number;
}) => {
    const { article, url, image_url } = searchResult;
    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0.8, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1 }}
        >
            <div className={styles.text_container}>
                <a href={url} target="_blank" className={styles.title}>
                    {article.title}
                </a>
                <h3 className={styles.source}>{article.source}</h3>
                {article.author && (
                    <h3 className={styles.author}>{article.author}</h3>
                )}
            </div>
            {image_url && (
                <Image
                    src={image_url}
                    className={styles.image}
                    alt={article.title}
                    fill
                />
            )}
        </motion.div>
    );
};

export default SearchResultItem;
