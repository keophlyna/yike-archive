// The place dropdown is built from this list only. Free text is never accepted.
// It holds Cambodia, then the country's 25 first-level divisions (Phnom Penh
// plus the 24 provinces) in alphabetical order, each with an English name and
// its Khmer name. The English name is what the user picks; the Khmer name is
// saved into place_kh automatically and is never typed by hand.

const PLACES = [
  { en: "Cambodia", kh: "កម្ពុជា" },
  { en: "Banteay Meanchey", kh: "បន្ទាយមានជ័យ" },
  { en: "Battambang", kh: "បាត់ដំបង" },
  { en: "Kampong Cham", kh: "កំពង់ចាម" },
  { en: "Kampong Chhnang", kh: "កំពង់ឆ្នាំង" },
  { en: "Kampong Speu", kh: "កំពង់ស្ពឺ" },
  { en: "Kampong Thom", kh: "កំពង់ធំ" },
  { en: "Kampot", kh: "កំពត" },
  { en: "Kandal", kh: "កណ្តាល" },
  { en: "Kep", kh: "កែប" },
  { en: "Koh Kong", kh: "កោះកុង" },
  { en: "Kratié", kh: "ក្រចេះ" },
  { en: "Mondulkiri", kh: "មណ្ឌលគិរី" },
  { en: "Oddar Meanchey", kh: "ឧត្តរមានជ័យ" },
  { en: "Pailin", kh: "ប៉ៃលិន" },
  { en: "Phnom Penh", kh: "ភ្នំពេញ" },
  { en: "Preah Sihanouk", kh: "ព្រះសីហនុ" },
  { en: "Preah Vihear", kh: "ព្រះវិហារ" },
  { en: "Prey Veng", kh: "ព្រៃវែង" },
  { en: "Pursat", kh: "ពោធិ៍សាត់" },
  { en: "Ratanakiri", kh: "រតនគិរី" },
  { en: "Siem Reap", kh: "សៀមរាប" },
  { en: "Stung Treng", kh: "ស្ទឹងត្រែង" },
  { en: "Svay Rieng", kh: "ស្វាយរៀង" },
  { en: "Takeo", kh: "តាកែវ" },
  { en: "Tboung Khmum", kh: "ត្បូងឃ្មុំ" },
];

export default PLACES;