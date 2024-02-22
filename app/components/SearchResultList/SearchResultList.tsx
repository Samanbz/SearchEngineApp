"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import SearchResult from "../types/SearchResult";
import SearchResultItem from "../SearchResultItem/SearchResultItem";
import styles from "./SearchResultList.module.scss";
import NamedEntity from "../types/NamedEntity";
import BarChartComponent from "../BarChart/BarChart";
import { motion } from "framer-motion";

const SearchResultList = ({
    searchResults,
    namedEntities,
    summary,
    loading,
}: {
    searchResults: SearchResult[];
    namedEntities: NamedEntity[];
    summary: string;
    loading: boolean;
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.summary_container}>
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: summary ? 1 : 0 }}
                    transition={{ delay: summary ? 0 : 1 }}
                    className={styles.summary_header}
                >
                    TL;DR?
                </motion.h1>

                <h2 className={styles.summary}>
                    {summary
                        .replaceAll('"', "")
                        .split(" ")
                        .map((word, index) => {
                            let coef = index + 1;
                            let delay =
                                Math.fround((2 + coef * 0.2) * 100) / 100;
                            return (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: summary ? 1 : 0 }}
                                    transition={{
                                        delay: summary ? delay : 0,
                                    }}
                                >
                                    {`${
                                        word +
                                        (index === summary.split(" ").length
                                            ? ""
                                            : " ")
                                    }`}
                                </motion.span>
                            );
                        })}
                </h2>
            </div>
            <div className={styles.chart_container}>
                <BarChartComponent data={namedEntities} />
                <motion.div
                    className={styles.loader_container}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: loading ? 1 : 0 }}
                >
                    <div className={styles.loader} />
                    <div className={styles.loader} />
                    <div className={styles.loader} />
                </motion.div>
            </div>
            {searchResults &&
                searchResults.map((result, index) => (
                    <SearchResultItem
                        key={index}
                        searchResult={result}
                        index={index}
                    />
                ))}
        </div>
    );
};

export default SearchResultList;
