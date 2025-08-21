import { create } from 'zustand';

type BackrollsState = {
    backrollId: string;
    setBackrollId: (id: string) => void;
    searchHistory: string[];
    addToSearchHistory: (query: string) => void;
    viewHistory: string[];
    addToViewHistory: (id: string) => void;
}

export const useBackrollsStore = create<BackrollsState>((set) => ({
    backrollId: "",
    setBackrollId: (id: string) => set({ backrollId: id }),
    searchHistory: [],
    addToSearchHistory: (query: string) => set((state) => ({
        searchHistory: [...state.searchHistory, query]
    })),
    viewHistory: [],
    addToViewHistory: (id: string) => set((state) => ({
        viewHistory: [...state.viewHistory, id]
    })),
}))
