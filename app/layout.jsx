import "./globals.css";

export const metadata = {
  title: "SOMI Command",
  description: "Kommandocentral · Paper Empires",
};

export default function RootLayout({ children }) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
