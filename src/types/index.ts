export interface Student {
  id: string;
  name: string;
  department?: string;
  loginAt?: string;
}

export type CardCategory =
  | 'all'
  | 'zones_flow' // 廚房分區與動線
  | 'facility_env' // 地面、排水與空氣補足
  | 'management_rules' // 4P/5S/6M/雙T/3不/3C/3生
  | 'grease_trap'; // 截油槽與法規

export interface Flashcard {
  id: string;
  category: CardCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  keyPoints: string[];
  detailedContent: string;
  sourceSlide: string;
  tag: string;
  mnemonic?: string; // 口訣
}

export interface QuizQuestion {
  id: string;
  category: string;
  type: 'single' | 'multiple' | 'true_false';
  question: string;
  options: string[];
  correctAnswers: number[]; // 0-indexed
  explanation: string;
  sourceSlide: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizSubmission {
  student: Student;
  date: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  answers: { [questionId: string]: number[] };
  timeSpentSeconds: number;
  categoryScores: { [category: string]: { correct: number; total: number } };
}

export interface ScenarioChoice {
  id: string;
  text: string;
  isOptimal: boolean;
  score: number; // 0-100
  feedback: string;
}

export interface ScenarioCase {
  id: string;
  title: string;
  subtitle: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
  background: string;
  problemsObserved: string[];
  question1: {
    prompt: string;
    choices: ScenarioChoice[];
  };
  question2: {
    prompt: string;
    choices: ScenarioChoice[];
  };
  keyRegulations: string[];
  expertAnalysis: string;
}
