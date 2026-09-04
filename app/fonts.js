import { Roboto } from "next/font/google";
import { Noto_Serif_Khmer } from "next/font/google";

export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const notoSerifKhmer = Noto_Serif_Khmer({
  subsets: ["khmer"],
  weight: ["400"],
  variable: "--font-noto-serif-khmer",
});
