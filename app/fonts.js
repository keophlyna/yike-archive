import { Noto_Serif_Khmer } from "next/font/google";

export const googleSansFlex = {
	variable: "--font-google-sans",
	className: "",
};

export const notoSerifKhmer = Noto_Serif_Khmer({
	subsets: ["khmer"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-noto-serif-khmer",
});
