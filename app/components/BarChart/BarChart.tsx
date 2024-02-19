"use client";
import React, { PureComponent, useEffect } from "react";
import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import styles from "./BarChart.module.scss";
const BarChartComponent = ({
    data,
}: {
    data: { name: string; label: string; frequency: number }[];
}) => {
    const colors: { [key: string]: string } = {
        CARDINAL: "#0077b6",
        DATE: "#06d6a0",
        EVENT: "#cfbaf0",
        FAC: "#FFFF00",
        GPE: "#38b000",
        LANGUAGE: "#00FFFF",
        LAW: "#800000",
        LOC: "#ffc300",
        MONEY: "#80b918",
        NORP: "#f35b04",
        ORDINAL: "#90e0ef",
        ORG: "#d00000",
        PERCENT: "#005f73",
        PERSON: "#4cc9f0",
        PRODUCT: "#2b9348",
        QUANTITY: "#0096c7",
        TIME: "#FFFFFF",
        WORK_OF_ART: "#fcd5ce",
    };
    return (
        <ResponsiveContainer
            width="100%"
            height="100%"
            className={styles.chart}
            style={{ pointerEvents: data.length == 0 ? "none" : "all" }}
        >
            <BarChart
                width={500}
                height={300}
                data={data}
                margin={{
                    top: 0,
                    right: 0,
                    left: 0,
                    bottom: 20,
                }}
            >
                <XAxis
                    dataKey="name"
                    angle={-60}
                    textAnchor="end"
                    interval={0}
                />
                <Legend
                    payload={data
                        .map((ent) => ent.label)
                        .filter(
                            (value, index, array) =>
                                array.indexOf(value) === index
                        )
                        .map((label, index) => ({
                            id: label,
                            type: "circle",
                            value: label,
                            color: colors[label],
                        }))}
                    verticalAlign="top"
                    layout="vertical"
                    align="right"
                    wrapperStyle={{
                        paddingLeft: "10px",
                    }}
                />
                <Tooltip
                    contentStyle={{
                        lineHeight: "50%",
                    }}
                />
                <Bar
                    dataKey="frequency"
                    activeBar={<Rectangle fill="pink" stroke="blue" />}
                >
                    {data.map(
                        ({
                            name,
                            label,
                            frequency,
                        }: {
                            name: string;
                            label: string;
                            frequency: number;
                        }) => (
                            <Cell key={`${name}-cell`} fill={colors[label]} />
                        )
                    )}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default BarChartComponent;
