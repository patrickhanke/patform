import { create } from "zustand";

type FeedbackStore = {
  feedback: string;
  type: string;
  date: Date;
  setFeedback: (
    a: FeedbackStore["feedback"],
    b: FeedbackStore["type"],
    c?: FeedbackStore["date"]
  ) => void;
};

const useFeedbackStore = create<FeedbackStore>((set) => ({
  feedback: "",
  type: "",
  date: new Date(),
  setFeedback: (feedback: string, type: string, date?: Date) => {
    set({ feedback, type, date });
    if (type !== "loading") {
      setTimeout(() => {
        set({ feedback: "", type: "" });
      }, 4000);
    }
  },
}));

export default useFeedbackStore;
