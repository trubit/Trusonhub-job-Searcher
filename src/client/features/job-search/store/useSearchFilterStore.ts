import { create } from 'zustand';
import { JobSearchParams } from '../../jobs/services/jobApi';

interface SearchFilterState {
  filters: JobSearchParams;
  setFilters: (newFilters: Partial<JobSearchParams>) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
}

const initialFilters: JobSearchParams = {
  keyword: '',
  location: '',
  category: '',
  employmentType: '',
  experienceLevel: '',
  remoteOption: '',
  minSalary: undefined,
  maxSalary: undefined,
  datePosted: 'all',
  sortBy: 'recent',
  page: 1,
  limit: 10,
};

export const useSearchFilterStore = create<SearchFilterState>((set) => ({
  filters: initialFilters,
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: newFilters.page ?? 1 },
    })),
  resetFilters: () => set({ filters: initialFilters }),
  setPage: (page) =>
    set((state) => ({
      filters: { ...state.filters, page },
    })),
}));
