import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import SearchOverlay from "@/components/SearchOverlay";
import LoadingOverlay from "@/components/LoadingOverlay";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "Woolenza - Shop",
  description: "E-Commerce with Next.js ",
  icons: {
    icon: "/assets/woolenza_logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`} >
          <Toaster />
          <AppContextProvider>
            <SearchOverlay />
            <LoadingOverlay />
            <WhatsAppFloat />
            {children}
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
      
  );
}
