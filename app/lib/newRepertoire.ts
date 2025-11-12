interface DragRaceSeries {
    code: string;
    name: string;
    type: "main-series" | "spin-off" | "international" | "all-stars";
    region?: "americas" | "asia" | "europe" | "oceania" | "africa" | "global"; // Add this
}

const codeEquivalence: { [code: string]: string } = {
    "rpdr": "RuPaul's Drag Race",
    "rpdr-as": "RuPaul's Drag Race All Stars",
    "rpdr-ud": "RuPaul's Drag Race Untucked",
    "rpdr-vr": "RuPaul's Drag Race: Vegas Revue",
    "rpdr-sc": "RuPaul's Secret Celebrity Drag Race",
    "rpdr-hs": "RuPaul's Drag Race: Holi-slay Spectacular",
    "rpdr-dru": "RuPaul's Drag U",
    "qotu": "Queen of the Universe",
    "dr-td": "Drag Race Thailand",
    "dr-ph": "Drag Race Philippines",
    "dr-jp": "Drag Race Japan",
    "dr-uk": "Drag Race UK",
    "dr-nl": "Drag Race Holland",
    "dr-es": "Drag Race España",
    "dr-it": "Drag Race Italia",
    "dr-fr": "Drag Race France",
    "dr-be": "Drag Race Belgique",
    "dr-se": "Drag Race Sverige",
    "dr-de": "Drag Race Germany",
    "dr-br": "Drag Race Brazil",
    "dr-za": "Drag Race South Africa",
    "dr-es-as": "Drag Race España All Stars",
    "dr-fr-as": "Drag Race France All Stars",
    "rpdr-uk-vtw": "RuPaul's Drag Race UK vs The World",
    "cdr-cvtw": "Canada's Drag Race: Canada vs The World",
    "rpdr-gas": "RuPaul's Drag Race Global All Stars",
    "dr-ph-sr": "Drag Race Philippines: Slaysian Royale",
    "dr-du-vtw": "Drag Race Down Under vs The World",
    "dr-mx-lr": "Drag Race México: Latina Royale",
}


const series: DragRaceSeries[] = [

    // Americas
    // Main Series
    { code: "rpdr", name: "RuPaul's Drag Race", region: "americas", type: "main-series" },
    { code: "cdr", name: "Canada's Drag Race", region: "americas", type: "international" },

    // All Stars
    { code: "rpdr-as", name: "RuPaul's Drag Race All Stars", region: "americas", type: "all-stars" },
    // Spin-Offs
    { code: "rpdr-ud", name: "RuPaul's Drag Race Untucked", region: "americas", type: "spin-off" },
    { code: "rpdr-dru", name: "RuPaul's Drag U", region: "americas", type: "spin-off" },
    { code: "rpdr-vr", name: "RuPaul's Drag Race: Vegas Revue", region: "americas", type: "spin-off" },
    { code: "rpdr-sc", name: "RuPaul's Secret Celebrity Drag Race", region: "americas", type: "spin-off" },
    { code: "rpdr-hs", name: "RuPaul's Drag Race: Holi-slay Spectacular", region: "americas", type: "spin-off" },

    // Asia
    // Main Series
    { code: "dr-td", name: "Drag Race Thailand", region: "asia", type: "international" },
    { code: "dr-ph", name: "Drag Race Philippines", region: "asia", type: "international" },
    { code: "dr-jp", name: "Drag Race Japan", region: "asia", type: "international" },

    // Europe
    // Main Series
    { code: "dr-uk", name: "Drag Race UK", region: "europe", type: "international" },
    { code: "dr-nl", name: "Drag Race Holland", region: "europe", type: "international" },
    { code: "dr-es", name: "Drag Race España", region: "europe", type: "international" },
    { code: "dr-it", name: "Drag Race Italia", region: "europe", type: "international" },
    { code: "dr-mx", name: "Drag Race Mexico", region: "europe", type: "international" },
    { code: "dr-fr", name: "Drag Race France", region: "europe", type: "international" },
    { code: "dr-be", name: "Drag Race Belgique", region: "europe", type: "international" },
    { code: "dr-se", name: "Drag Race Sverige", region: "europe", type: "international" },
    { code: "dr-de", name: "Drag Race Germany", region: "europe", type: "international" },

    // All Stars
    { code: "dr-es-as", name: "Drag Race España All Stars", region: "europe", type: "all-stars" },
    { code: "dr-fr-as", name: "Drag Race France All Stars", region: "europe", type: "all-stars" },
    // Oceania
    // Main Series
    { code: "dr-au", name: "Drag Race Down Under", region: "oceania", type: "international" },

    // Africa
    // Main Series
    { code: "dr-za", name: "Drag Race South Africa", region: "africa", type: "international" },

    // Global
    // All Stars
    { code: "rpdr-uk-vtw", name: "RuPaul's Drag Race UK vs The World", region: "global", type: "all-stars" },
    { code: "cdr-cvtw", name: "Canada's Drag Race: Canada vs The World", region: "global", type: "all-stars" },
    { code: "rpdr-gas", name: "RuPaul's Drag Race Global All Stars", region: "global", type: "all-stars" },
    { code: "dr-ph-sr", name: "Drag Race Philippines: Slaysian Royale", region: "global", type: "all-stars" },
    { code: "dr-du-vtw", name: "Drag Race Down Under vs The World", region: "global", type: "all-stars" },
    { code: "dr-mx-lr", name: "Drag Race México: Latina Royale", region: "global", type: "all-stars" },
];








const seriesSeasons: SeriesSeasons = {
    "RuPaul's Drag Race": 16,
    "RuPaul's Drag Race All Stars": 8,
    "RuPaul's Drag Race Untucked": 15,
    "RuPaul's Drag U": 3,
    "Drag Race España": 3,
    "Drag Race Thailand": 2,
    "Canada's Drag Race": 4,
    "Drag Race Holland": 2,
    "Drag Race Down Under": 3,
    "Drag Race France": 2,
    "Drag Race Italia": 3,
    "Drag Race Philippines": 2,
    "Drag Race Belgium": 1,
    "Drag Race Mexico": 1,
    "Drag Race Germany": 1,
    "Drag Race Brazil": 1,
    "Drag Race UK": 5,
    "Drag Race Sweden": 1,
    "Drag Race Chile": 1,
    "RuPaul's Drag Race: Vegas Revue": 1,
    "RuPaul's Secret Celebrity Drag Race": 2,
    "RuPaul's Drag Race: Holi-slay Spectacular": 1,
    "Drag Race Live": 1,
    "We're Here": 4,
    "AJ and the Queen": 1,
    "Dragnificent": 1,
    "Queen of the Universe": 2,
    "Call Me Mother": 3,
    "Drag Race España All Stars": 1,
    "Canada's Drag Race: Canada vs. The World": 1,
    "Drag Race UK vs. The World": 2,
    "Drag Race All Stars: All Winners": 1
};

const seriesEpisodes: SeriesEpisodes = {
    "RuPaul's Drag Race": {
        1: 9, 2: 12, 3: 16, 4: 14, 5: 14, 6: 14, 7: 14, 8: 10,
        9: 14, 10: 14, 11: 14, 12: 14, 13: 16, 14: 16, 15: 16, 16: 16
    },
    "RuPaul's Drag Race All Stars": {
        1: 6, 2: 10, 3: 8, 4: 10, 5: 8, 6: 12, 7: 12, 8: 12
    },
    // Add episodes for other series as needed
    "Drag Race UK": {
        1: 10, 2: 10, 3: 10, 4: 10, 5: 10
    },
    "Canada's Drag Race": {
        1: 10, 2: 10, 3: 10, 4: 10
    },
    // Default fallback for other series
    "default": {
        1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10
    }
};