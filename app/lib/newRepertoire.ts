interface DragRaceSeries {
    code: string;
    name: string;
    type: "main-series" | "spin-off" | "international" | "all-stars";
    region?: "americas" | "asia" | "europe" | "oceania" | "africa" | "global";
}

interface SeriesSeasons {
    [seriesName: string]: number;
}

interface SeriesEpisodes {
    [seriesName: string]: {
        [seasonNumber: number]: number;
    };
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
    { code: "dr-br", name: "Drag Race Brazil", region: "americas", type: "international" },
    { code: "dr-mx", name: "Mexico's Drag Race", region: "americas", type: "international" },

    // All Stars
    { code: "rpdr-as", name: "RuPaul's Drag Race All Stars", region: "americas", type: "all-stars" },
    { code: "ts-dr", name: "The Switch Drag Race", region: "americas", type: "spin-off" },

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
    // Americas - Main Series
    "RuPaul's Drag Race": 19,
    "Canada's Drag Race": 7,
    "Mexico's Drag Race": 3,
    "Drag Race Brazil": 2,

    // Americas - All Stars
    "RuPaul's Drag Race All Stars": 11,

    // Americas - Spin-Offs
    "The Switch Drag Race": 2,
    "RuPaul's Drag Race Untucked": 18,
    "RuPaul's Drag U": 3,
    "RuPaul's Drag Race: Vegas Revue": 1,
    "RuPaul's Secret Celebrity Drag Race": 2,
    "RuPaul's Drag Race: Holi-slay Spectacular": 1,

    // Asia - Main Series
    "Drag Race Thailand": 3,
    "Drag Race Philippines": 4,
    "Drag Race Japan": 1,

    // Europe - Main Series
    "Drag Race UK": 8,
    "Drag Race Holland": 3,
    "Drag Race España": 6,
    "Drag Race Italia": 4,
    "Drag Race France": 4,
    "Drag Race Belgique": 2,
    "Drag Race Sverige": 1,
    "Drag Race Germany": 1,

    // Europe - All Stars
    "Drag Race España All Stars": 1,
    "Drag Race France All Stars": 1,

    // Oceania
    "Drag Race Down Under": 4,

    // Africa
    "Drag Race South Africa": 2,

    // Global - All Stars
    "RuPaul's Drag Race UK vs The World": 3,
    "Canada's Drag Race: Canada vs The World": 2,
    "RuPaul's Drag Race Global All Stars": 1,
    "Drag Race Philippines: Slaysian Royale": 1,
    "Drag Race Down Under vs The World": 1,
    "Drag Race México: Latina Royale": 1,
};

const seriesEpisodes: SeriesEpisodes = {
    // Americas - Main Series
    "RuPaul's Drag Race": {
        1: 9, 2: 12, 3: 16, 4: 14, 5: 14, 6: 14, 7: 14, 8: 10,
        9: 14, 10: 14, 11: 14, 12: 14, 13: 16, 14: 16, 15: 16, 16: 16,
        17: 16, 18: 16, 19: 16
    },
    "Canada's Drag Race": {
        1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10
    },
    "Mexico's Drag Race": {
        1: 10, 2: 10, 3: 10
    },
    "Drag Race Brazil": {
        1: 10, 2: 10
    },

    // Americas - All Stars
    "RuPaul's Drag Race All Stars": {
        1: 6, 2: 10, 3: 8, 4: 10, 5: 8, 6: 12, 7: 12, 8: 12,
        9: 12, 10: 12, 11: 12
    },

    // Americas - Spin-Offs
    "RuPaul's Drag Race Untucked": {
        1: 9, 2: 12, 3: 16, 4: 14, 5: 14, 6: 14, 7: 14, 8: 10,
        9: 14, 10: 14, 11: 14, 12: 14, 13: 16, 14: 16, 15: 16, 16: 16,
        17: 16, 18: 16
    },
    "RuPaul's Drag U": {
        1: 8, 2: 8, 3: 8
    },
    "RuPaul's Drag Race: Vegas Revue": {
        1: 6
    },
    "RuPaul's Secret Celebrity Drag Race": {
        1: 6, 2: 6
    },
    "RuPaul's Drag Race: Holi-slay Spectacular": {
        1: 1
    },
    "The Switch Drag Race": {
        1: 10, 2: 10
    },

    // Asia - Main Series
    "Drag Race Thailand": {
        1: 10, 2: 12, 3: 10
    },
    "Drag Race Philippines": {
        1: 10, 2: 10, 3: 10, 4: 10
    },
    "Drag Race Japan": {
        1: 8
    },

    // Europe - Main Series
    "Drag Race UK": {
        1: 10, 2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10
    },
    "Drag Race Holland": {
        1: 8, 2: 8, 3: 8
    },
    "Drag Race España": {
        1: 8, 2: 8, 3: 8, 4: 10, 5: 10, 6: 10
    },
    "Drag Race Italia": {
        1: 8, 2: 8, 3: 8, 4: 8
    },
    "Drag Race France": {
        1: 8, 2: 8, 3: 10, 4: 10
    },
    "Drag Race Belgique": {
        1: 8, 2: 8
    },
    "Drag Race Sverige": {
        1: 8
    },
    "Drag Race Germany": {
        1: 8
    },

    // Europe - All Stars
    "Drag Race España All Stars": {
        1: 6
    },
    "Drag Race France All Stars": {
        1: 8
    },

    // Oceania
    "Drag Race Down Under": {
        1: 8, 2: 8, 3: 8, 4: 8
    },

    // Global - All Stars
    "RuPaul's Drag Race UK vs The World": {
        1: 6, 2: 8, 3: 8
    },
    "Canada's Drag Race: Canada vs The World": {
        1: 6, 2: 8
    },
    "RuPaul's Drag Race Global All Stars": {
        1: 8
    },
    "Drag Race Philippines: Slaysian Royale": {
        1: 6
    },
    "Drag Race Down Under vs The World": {
        1: 8
    },
    "Drag Race México: Latina Royale": {
        1: 8
    }
};

{/* const contestants: SeriesContestants[] = [
        // RuPaul's Drag Race - Main Series
        { name: 'Akashia', franchise: 'rpdr', series: 'main-series', season: 1, episode: 1 },
        { name: 'Chanel', franchise: 'rpdr', series: 'main-series', season: 1, episode: 1 },
        { name: 'Rave', franchise: 'rpdr', series: 'main-series', season: 1, episode: 2 },
        { name: 'Jujube', franchise: 'rpdr', series: 'main-series', season: 1, episode: 2 },
        // RuPaul's Drag Race - All Stars
        { name: 'Tammie Brown', franchise: 'rpdr', series: 'all-stars', season: 1, episode: 1 },
        { name: 'Nina Flowers', franchise: 'rpdr', series: 'all-stars', season: 1, episode: 1 },
        { name: 'Alaska Thunderfuck', franchise: 'rpdr', series: 'all-stars', season: 1, episode: 2 },
        { name: 'Katya', franchise: 'rpdr', series: 'all-stars', season: 1, episode: 2 },
        // Canada's Drag Race - Main Series
        { name: 'Priyanka', franchise: 'cdr', series: 'main-series', season: 1, episode: 1 },
        { name: 'Jimbo', franchise: 'cdr', series: 'main-series', season: 1, episode: 1 },
        { name: 'Suki Doll', franchise: 'cdr', series: 'main-series', season: 2, episode: 2 },
        { name: 'Icesis Couture', franchise: 'cdr', series: 'main-series', season: 2, episode: 2 }
];
*/}

export { series, codeEquivalence, seriesSeasons, seriesEpisodes };
export type { DragRaceSeries };