"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./SearchBar.module.scss";
import axios from "axios";
import SearchResult from "../types/SearchResult";
import MeshBackground from "../MeshBackground/MeshBackground";
import NamedEntity from "../types/NamedEntity";
import { motion } from "framer-motion";
import FastAPIError from "../types/FastAPIError";
import HTTPError from "../types/HTTPError";

const isHTTPError = (error: any): number => {
    return error.response && error.response.status;
};
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

    const [responseStati, setResponseStati] = useState({
        searchResults: 0,
        namedEntities: 0,
        summary: 0,
    });
    const [finalStatus, setFinalStatus] = useState("");

    useEffect(() => {
        setFinalStatus(interpretResponseStati());
    }, [responseStati]);

    const validate = {
        results: (results: SearchResult[]) => {
            if (!results || results.length < 2) {
                setResponseStati((prev) => ({
                    ...prev,
                    summary: 404,
                    searchResults: 404,
                }));
                return false;
            } else {
                setSearchResults(results);
                return true;
            }
        },
        summary: (summary: string) => {
            if (summary && summary.length < 10) {
                setResponseStati((prev) => ({
                    ...prev,
                    summary: 404,
                }));
                return false;
            } else if (summary) {
                setSummary(summary);
                return true;
            }
        },
        namedEntities: (namedEntities: NamedEntity[]) => {
            if (!namedEntities || namedEntities.length < 1) {
                setResponseStati((prev) => ({
                    ...prev,
                    namedEntities: 404,
                }));
                return false;
            } else {
                setNamedEntities(namedEntities);
                return true;
            }
        },
    };

    const resetState = () => {
        setSummary("");
        setNamedEntities([]);
        setSearchResults([]);
        setResponseStati({ searchResults: 0, namedEntities: 0, summary: 0 });
    };

    const fetchData = async () => {
        resetState();
        setLoading(true);

        try {
            const results = await fetchSearchResults();
            const resultsValid = validate.results(results);
            if (!resultsValid) {
                setLoading(false);
                return;
            }

            const summary = await fetchSummary(results);
            validate.summary(summary);

            const namedEntities = await fetchNamedEntities(results);
            validate.namedEntities(namedEntities);
        } catch (error) {
            setResponseStati({
                searchResults: 503,
                summary: 503,
                namedEntities: 503,
            });
        }

        setLoading(false);
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

            setSearchQuery("");
            setResponseStati((prev) => ({ ...prev, summary: response.status }));

            return summary;
        } catch (error) {
            let statusCode = isHTTPError(error) || 0;
            setResponseStati((prev) => ({
                ...prev,
                summary: statusCode || 503,
            }));
            throw error;
        }
    };

    const fetchSearchResults = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_API_URL + "/search",
                {
                    params: { query: searchQuery, language: "en" },
                }
            );

            setResponseStati((prev) => ({
                ...prev,
                searchResults: response.status,
            }));
            return response.data.results;
        } catch (error) {
            console.log(error);
            let statusCode = isHTTPError(error) || 0;
            setResponseStati((prev) => ({
                ...prev,
                searchResults: statusCode || 503,
            }));
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

            if (namedEntities.length < 3) {
                setResponseStati((prev) => ({ ...prev, namedEntities: 404 }));
                return;
            }
            setResponseStati((prev) => ({
                ...prev,
                namedEntities: response.status,
            }));

            return namedEntities.length > 30
                ? namedEntities.slice(0, 30)
                : namedEntities;
        } catch (error) {
            let statusCode = isHTTPError(error) || 0;
            setResponseStati((prev) => ({
                ...prev,
                namedEntities: statusCode || 503,
            }));
            throw error;
        }
    };

    const interpretResponseStati = () => {
        const {
            searchResults: searchResultsStatus,
            namedEntities: namedEntitiesStatus,
            summary: summaryStatus,
        } = responseStati;

        class ResponseConditions {
            static NoResults =
                searchResultsStatus == 404 || summaryStatus == 404;

            static ServerError = [
                searchResultsStatus,
                summaryStatus,
                namedEntitiesStatus,
            ].some((status) => status == 503);

            static LimitReached = [
                searchResultsStatus,
                summaryStatus,
                namedEntitiesStatus,
            ].some((status) => status == 429);

            static NoAnalysis = namedEntitiesStatus == 404;

            static Success = [
                searchResultsStatus,
                summaryStatus,
                namedEntitiesStatus,
            ].every((status) => status == 200);
        }

        let errorMessage = "";

        if (ResponseConditions.NoResults) {
            errorMessage = "No results found for this query, try another one.";
        } else if (ResponseConditions.ServerError) {
            errorMessage =
                "Either the server is down, or you don't have permission to access.";
        } else if (ResponseConditions.NoAnalysis) {
            errorMessage = "No analysis could be made on the search results.";
        } else if (ResponseConditions.LimitReached) {
            errorMessage = "Too many searches, try again later.";
        } else if (ResponseConditions.Success) {
            errorMessage = "";
        }
        return errorMessage;
    };
    return (
        <div className={styles.container}>
            <div
                className={styles.bg_container}
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

                <div className={styles.search_bar_container}>
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
                        disabled={
                            loading ||
                            !searchQuery.match(/^[a-zA-Z\s]+[0-9]*$/) ||
                            searchQuery.length < 3
                        }
                        onClick={() => fetchData()}
                        style={
                            loading ||
                            !searchQuery.match(/^[a-zA-Z\s]+[0-9]*$/) ||
                            searchQuery.length < 3
                                ? { opacity: 0.6, cursor: "not-allowed" }
                                : { opacity: 1, cursor: "pointer" }
                        }
                    >
                        Search
                    </button>
                </div>
            </div>{" "}
            {finalStatus && (
                <p className={styles.error_message}>{finalStatus}</p>
            )}
        </div>
    );
};

export default SearchBar;
