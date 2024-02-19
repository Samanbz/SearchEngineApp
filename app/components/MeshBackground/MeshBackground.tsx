import React from "react";
import styles from "./MeshBackground.module.scss";
const MeshBackground = ({
    bgcolor,
    colors,
}: {
    bgcolor: string;
    colors: string[];
}) => {
    return (
        <div style={{ backgroundColor: bgcolor }} className={styles.container}>
            <div
                style={{ backgroundColor: colors[0] }}
                className={styles.mesh_tile}
            />
            <div
                style={{ backgroundColor: colors[1] }}
                className={styles.mesh_tile}
            />
            <div
                style={{ backgroundColor: colors[2] }}
                className={styles.mesh_tile}
            />
        </div>
    );
};

export default MeshBackground;
