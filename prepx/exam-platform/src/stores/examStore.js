import create from 'zustand';

const useExamStore = create((set) => ({
  currentExam: null,
  answers: {},
  timeRemaining: 0,

  setCurrentExam: (exam) => set({ currentExam: exam }),
  setAnswer: (questionId, answer) => set((state) => ({
    answers: { ...state.answers, [questionId]: answer },
  })),
  decrementTime: () => set((state) => ({
    timeRemaining: state.timeRemaining - 1,
  })),
}));

export default useExamStore;
