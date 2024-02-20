"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./SearchBar.module.scss";
import axios from "axios";
import SearchResult from "../types/SearchResult";
import MeshBackground from "../MeshBackground/MeshBackground";
import NamedEntity from "../types/NamedEntity";
import { motion } from "framer-motion";
const SearchBar = ({
    setSearchResults,
    setNamedEntities,
    setSummary,
    setLoading,
    loading,
}: {
    setSearchResults: Dispatch<SetStateAction<SearchResult[]>>;
    setNamedEntities: Dispatch<SetStateAction<NamedEntity[]>>;
    setSummary: Dispatch<SetStateAction<string>>;
    setLoading: Dispatch<SetStateAction<boolean>>;
    loading: boolean;
}) => {
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        setLoading(true);
        setSummary("");
        setNamedEntities([]);
        setSearchResults([]);

        const results = await fetchSearchResults();
        setSearchResults(results);
        // const summary = await fetchSummary(results);
        const summary =
            "this happened that happend and he did this and she did that.";
        setSummary(summary);
        const namedEntities = await fetchNamedEntities(results);
        setLoading(false);
        setNamedEntities(namedEntities);
    };

    const fetchSummary = async (results: SearchResult[]) => {
        const headlines = results.map((result) => result.article.title);

        try {
            const response = await axios.post(
                process.env.NEXT_PUBLIC_API_URL + "/summary",
                {
                    param: { language: "en" },
                    headlines: headlines,
                    topic: searchQuery,
                }
            );
            const summary = response.data.summary;
            if (!summary) return;
            setSearchQuery("");
            console.log(summary);
            return summary;
        } catch (error) {
            throw error;
        }
    };

    const fetchNamedEntities = async (results: SearchResult[]) => {
        const urls = results.map((result) => result.url);
        const top_urls = urls.slice(0, 7);
        try {
            const response = await axios.post(
                process.env.NEXT_PUBLIC_API_URL + "/analysis",
                {
                    param: { language: "en" },
                    urls: top_urls,
                }
            );
            const namedEntities = response.data.named_entities;
            if (!namedEntities) return;

            return namedEntities.length > 30
                ? namedEntities.slice(0, 30)
                : namedEntities;
        } catch (error) {
            throw error;
        }
    };

    const fetchSearchResults = async () => {
        try {
            const results = await axios.get(
                process.env.NEXT_PUBLIC_API_URL + "/search",
                {
                    params: { query: searchQuery, language: "en" },
                }
            );
            return results.data.results;
        } catch (error) {
            throw error;
        }
    };

    return (
        <div
            className={styles.supercontainer}
            style={
                loading
                    ? { opacity: 0.6, cursor: "not-allowed" }
                    : { opacity: 1, cursor: "pointer" }
            }
        >
            <MeshBackground
                bgcolor={"#ff8fab"}
                colors={["#8338ec", "#ff006e", "#a30051"]}
            />
            <div className={styles.container}>
                <MeshBackground
                    bgcolor={"#0d1b2a"}
                    colors={["#02040f", "#02110d", "#0b132b"]}
                />
                <input
                    disabled={loading}
                    type="text"
                    className={styles.search_bar}
                    placeholder="Search News..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    className={styles.submit_button}
                    disabled={loading}
                    onClick={() => fetchData()}
                    style={
                        loading
                            ? { opacity: 0.6, cursor: "not-allowed" }
                            : { opacity: 1, cursor: "pointer" }
                    }
                >
                    Search
                </button>
            </div>
        </div>
    );
};

export default SearchBar;
