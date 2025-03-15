import { create } from 'zustand';
import { TourStore } from '../types';

const useTourStore = create<TourStore>(set => ({
    week: { value: 0, label: 'Übersicht' },
    worker: null,
    setWeek: (week: TourStore['week']) => set({ week }),
    setWorker: (worker: string) => set({ worker }),
}));

export default useTourStore;
