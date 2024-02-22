"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import SearchBar from "./components/SearchBar/SearchBar";
import SearchResult from "./components/types/SearchResult";
import SearchResultList from "./components/SearchResultList/SearchResultList";
import NamedEntity from "./components/types/NamedEntity";

export default function Home() {
    const [searchResults, setSearchResults] = useState([] as SearchResult[]);
    const [namedEntities, setNamedEntities] = useState([] as NamedEntity[]);
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("en");

    return (
        <div className={styles.container}>
            <SearchBar
                setSearchResults={setSearchResults}
                setNamedEntities={setNamedEntities}
                setSummary={setSummary}
                setLoading={setLoading}
                loading={loading}
                language={language}
                setLanguage={setLanguage}
            />

            <SearchResultList
                searchResults={searchResults}
                namedEntities={namedEntities}
                summary={summary}
                loading={loading}
            />
        </div>
    );
}
