import { Fraunces, Noto_Serif_Khmer, Work_Sans } from "next/font/google";

export const fraunces = Fraunces({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "900"],
	style: ["normal", "italic"],
	variable: "--font-fraunces",
});

export const workSans = Work_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-work-sans",
});

export const notoSerifKhmer = Noto_Serif_Khmer({
	subsets: ["khmer"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-noto-serif-khmer",
});
