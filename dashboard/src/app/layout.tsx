import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthCheck from "@/components/AuthCheck";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Omnexus - Dashboard",
  description: "Yapay Zeka Destekli Gayrimenkul Analiz Platformu",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Omnexus",
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthCheck>
              {/* Sidebar her sayfada olacak */}
              <Sidebar />
              
              {/* Main Content Wrapper */}
              <div className="ml-64 flex-1">
                {children}
              </div>
            </AuthCheck>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
