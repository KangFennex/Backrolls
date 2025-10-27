interface DragRaceSeries {
    name: string;
    type: "main-series" | "spin-off" | "international" | "all-stars" | "special" | "live" | "related";
}

interface SeriesSeasons {
    [seriesName: string]: number;
}

interface SeriesEpisodes {
    [seriesName: string]: {
        [season: number]: number;
    };
}

const categories = [
    {
        name: 'Rankings',
        href: '',
    },
    {
        name: 'Memes',
        href: '',
    },
    {
        name: 'RPDR',
        href: '/series?category=main-series',
    },
    {
        name: 'All Stars',
        href: '/series?category=all-stars',
    },
    {
        name: 'International',
        href: '/series?category=international',
    },
    {
        name: 'Spin Offs',
        href: '/series?category=spin-off',
    },
]

const series: DragRaceSeries[] = [

    // Main Series
    { name: "RuPaul's Drag Race", type: "main-series" },

    // All Stars
    { name: "RuPaul's Drag Race All Stars", type: "all-stars" },
    { name: "Drag Race España All Stars", type: "all-stars" },
    { name: "Drag Race France All Stars", type: "all-stars" },

    // International
    { name: "Drag Race España", type: "international" },
    { name: "Drag Race Thailand", type: "international" },
    { name: "Canada's Drag Race", type: "international" },
    { name: "Drag Race Holland", type: "international" },
    { name: "Drag Race Down Under", type: "international" },
    { name: "Drag Race France", type: "international" },
    { name: "Drag Race Italia", type: "international" },
    { name: "Drag Race Philippines", type: "international" },
    { name: "Drag Race Belgium", type: "international" },
    { name: "Drag Race Mexico", type: "international" },
    { name: "Drag Race Germany", type: "international" },
    { name: "Drag Race Brazil", type: "international" },
    { name: "Drag Race UK", type: "international" },
    { name: "Drag Race Sweden", type: "international" },
    { name: "Canada's Drag Race: Canada vs. The World", type: "international" },
    { name: "Drag Race UK vs. The World", type: "international" },

    // Spin-Offs
    { name: "RuPaul's Drag Race Untucked", type: "spin-off" },
    { name: "RuPaul's Drag U", type: "spin-off" },
    { name: "RuPaul's Drag Race: Vegas Revue", type: "spin-off" },
    { name: "RuPaul's Secret Celebrity Drag Race", type: "spin-off" },
    { name: "RuPaul's Drag Race: Holi-slay Spectacular", type: "spin-off" },
    { name: "Drag Race Live", type: "spin-off" },
    { name: "Queen of the Universe", type: "spin-off" },
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

const westernZodiacSigns = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const chineseZodiacSigns = [
    'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
    'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];


export { categories, series, seriesSeasons, seriesEpisodes, westernZodiacSigns, chineseZodiacSigns };