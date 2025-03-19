import create from 'zustand';

const useQuestionStore = create((set) => ({
  questions: [],
  filters: { category: 'all', difficulty: 'all', status: 'all' },
  isGenerating: false,

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters },
  })),
  generateQuestions: async (params) => {
    set({ isGenerating: true });
    // Simulate question generation process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    set((state) => ({
      questions: [...state.questions, { id: Date.now(), ...params }],
      isGenerating: false,
    }));
  },
}));

export default useQuestionStore;
