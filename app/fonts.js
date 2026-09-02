import { Montserrat } from "next/font/google";
import { Fraunces } from "next/font/google";
import { Source_Serif_4 } from "next/font/google";
import { Noto_Serif_Khmer } from "next/font/google";
import { IBM_Plex_Mono } from "next/font/google";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
});

export const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-fraunces",
});

export const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-source-serif-4",
});

export const notoSerifKhmer = Noto_Serif_Khmer({
  subsets: ["khmer"],
  weight: ["400"],
  variable: "--font-noto-serif-khmer",
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
});
