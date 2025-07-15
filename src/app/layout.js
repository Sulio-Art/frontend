import { sora } from "./fonts";
import "./globals.css";
import { Providers } from "./provider";
import { CurrentUser } from "@/components/CurrentUser";

export const metadata = {
  title: "Sulio Art",
  description:
    "Sulio Art: Artist AI ChatBot, A collection of digital art and illustrations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sora.variable} font-sans bg-black text-white`}>
        <Providers>
          <CurrentUser />
          {children}
        </Providers>
      </body>
    </html>
  );
}
