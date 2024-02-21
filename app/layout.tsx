import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "News Search Engine",
    description: "Created by Saman B.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <link
                rel="shortcut icon"
                type="image/x-icon"
                href="https://emojifavicon.dev/favicons/1f64a.ico"
            />
            <body className={poppins.className}>{children}</body>
        </html>
    );
}
