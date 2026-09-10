const entries = [
  {
    title: "History & Cultural Context of Lakhon Yike",
    description:
      "A foundational historical narrative detailing the origins, development, and cultural evolution of Lakhon Yike in Cambodia. It explores historical connections with Cham/Malay musical traditions, its flourishing in rural communities (particularly in Takeo province), royal patronage during the 20th century, and resilience in the post-1979 cultural reconstruction era.",
    contributor: "Royal University of Fine Arts (RUFA)",
    place: "Cambodia, Takeo",
    photo: "/entries/entry1.jpg",
    titleKh: "ប្រវត្តិសាស្ត្រ និងបរិបទវប្បធម៌នៃល្ខោនយីកេ",
    category: "History",
  },
  {
    title: "Performance Structure, Staging & Movement",
    description:
      "Documentation of traditional Yike performance structures and choreographic movement. This entry covers the ritualistic opening ceremony (Hom Rong), the invocation of ancestral teachers, stage geography, vocal call-and-response dynamics, and ensemble cast organization (typically ranging from 12 to 25 performers including actors, musicians, and chorus).",
    contributor: "Yike - Wikipedia",
    place: "Cambodia",
    photo: "/entries/entry2.png",
    titleKh: "រចនាសម្ព័ន្ធការសម្តែង ការរៀបចំ និងចលនា",
    category: "Performance",
    phases: [
      {
        num: "01",
        phase: "Ceremonial Blessing",
        title: "Ceremonial Blessing",
        kh: "ហោមរោង (Hom Rong)",
        text: "Serves as a sacred ceremonial prelude performed by dancers to pay tribute to ancestral artistic masters (Kru), purify the performance ground, and invoke divine spiritual protection for the troupe.",
        photo: "/entries/yike-hom-rong.jpg",
      },
      {
        num: "02",
        phase: "Percussive Overture",
        title: "Percussive Overture",
        kh: "ក្បួនស្គរមេ (Skor Mei Call)",
        text: "Captures the community's attention through the commanding strokes of the master Skor Mei frame drum, establishing ensemble tempo while signaling upcoming character entrances and scene changes.",
        photo: "/entries/skor-mei-call.jpg",
      },
      {
        num: "03",
        phase: "Arena Drama & Movement",
        title: "Arena Drama & Movement",
        kh: "ការសម្តែង និង ចលនា (Rom Kbach)",
        text: "Enacts the main story within an open in-the-round setting, blending fluid Rom Kbach folk dance gestures with melismatic vocal monologues, dynamic song modes, and lively improvisational dialogue.",
        photo: "/entries/arena-drama.jpg",
      },
      {
        num: "04",
        phase: "Percussive Resolution",
        title: "Percussive Resolution",
        kh: "ការបញ្ចប់ (Recessional)",
        text: "Brings the dramatic story to an orderly close as melodic string instruments and secondary drums gradually fade out, leaving the lead Skor Mei drum to sound final solo percussive rhythms.",
        photo: "/entries/ending.jpg",
      },
    ],
  },
  {
    title: "Music, Instrumentation & Narrative Soundscapes",
    titleKh: "តន្ត្រី និងឧបករណ៍សម្រាប់បង្ហាញរឿង",
    category: "Music",
    description:
      "A complete catalog of Yike musical accompaniment, showing how rhythmic patterns drive dramatic narrative. Centers on the Skor Yike (graduated frame drums), alongside the Tromuo (spiked fiddle), Krap (bamboo clappers), and Chhing (finger cymbals) — with tempo signaling tension, royal arrivals, comedy, or battle.",
    contributor:
      "Master Yike percussionists; acoustic field recordings and musical transcriptions",
    place: "Cambodia",
    photo: "/entries/khmer-traditional-music-instruments.jpg",
  },
  {
    title: "Costume Symbolism & Character Archetypes",
    titleKh: "និមិត្តសញ្ញាសំលៀកបំពាក់ និងគំរូតួអង្គ",
    category: "Costume",
    description: "In Lakhon Yike, costumes and character designs bridge the gap between sacred court traditions and rural folk accessibility. Unlike classical court dance dramas that enforce rigid, ornate costuming, Yike balances traditional visual symbolism with practical, expressive mobility suited for village audiences.", 
    contributor: "Dept. of Performing Arts costume designers; senior wardrobe masters",
    place: "Cambodia",
    photo: "/entries/costume.png",
    characters: [
      {
        role: "The Prince / Hero",
        kh: "នាយរោង (Neay Rong)",
        tag: "Royal Crown & Kben",
        text: "Represents noble leadership, moral righteousness (Dharma), and courage. Dressed in an embroidered tunic paired with the Sampot Chang Kben and a golden Mokot crown.",
        photo: "/entries/prince.jpg",
      },
      {
        role: "The Princess",
        kh: "នាង (Neang)",
        tag: "Silk Hol & Sbai",
        text: "Embodies classical grace, modesty, and emotional depth. Adorned in an ikat-patterned Sampot Hol silk skirt and a flowing, pleated Sbai shoulder shawl.",
        photo: "/entries/princess.jpg",
      },
      {
        role: "The Ogre / Giant",
        kh: "យក្ស (Yeak)",
        tag: "Mask & Dark Attire",
        text: "Serves as a dynamic symbol of raw ambition and spiritual trials. Identified by dark jackets, dramatic face paint or half-masks, and a wooden club prop.",
        photo: "/entries/yeak.jpg",
      },
      {
        role: "The Clown / Narrator",
        kh: "ត្លុក (Tlak)",
        tag: "Peasant Attire & Krama",
        text: "Provides comedic relief and folk wisdom directly to rural audiences. Wears plain peasant attire paired with the iconic checkered Krama scarf.",
        photo: "/entries/tlok.jpg",
      },
    ],
    garments: [
      {
        name: "Sampot Chang Kben",
        kh: "សំពត់ចងក្បិន",
        text: "Tucked cloth wrap for male nobility symbolizing readiness, dignity, and martial strength.",
        photo: "/entries/sampot-chong-kben.jpg",
      },
      {
        name: "Sampot Hol",
        kh: "សំពត់ហូល",
        text: "Handwoven ikat silk skirt whose complex patterns reflect female status and refinement.",
        photo: "/entries/sampot-hol.jpg",
      },
      {
        name: "Sbai",
        kh: "ស្បៃ",
        text: "Pleated silk shoulder shawl draped diagonally, embodying modesty and grace.",
        photo: "/entries/sbai.jpg",
      },
      {
        name: "Mokot",
        kh: "មកុដ",
        text: "Multi-tiered golden crown signifying royal authority and spiritual alignment.",
        photo: "/entries/mkot.jpg",
      },
    ],
  },
  {
    title: "Living Traditions: Oral History of Yike Performers",
    titleKh: "ប្រវត្តិសាស្ត្រដ៏រស់នៅ: ការពិភាក្សាប្រវត្តិនៃអ្នកសម្តែង Yike",
    category: "Oral History",
    description:
      "Human-centered oral histories of veteran and contemporary Yike artists — knowledge transmission, passion for preserving Khmer heritage, post-war struggle, and reflections on performance art's future in the digital age.",
    contributor:
      "Master Sobpa Sith and other living Yike practitioners across generations, Khmer Times",
    place: "Cambodia",
    photo: "/entries/oral-history.jpg",
  },
];

export default entries;
