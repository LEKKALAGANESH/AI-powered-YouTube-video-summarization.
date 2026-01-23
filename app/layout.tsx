import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TubeCritique AI - Deep Intelligence For Every Video",
  description: "AI-powered YouTube video analysis with fact-checking and comprehensive summaries",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black antialiased">{children}</body>
    </html>
  );
}
