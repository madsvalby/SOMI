import "./globals.css";

export const metadata = {
  title: "Paper Empires Command Center",
  description: "AI-powered content operations · Paper Empires",
};

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
