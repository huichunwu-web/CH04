import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  FileText,
  Clock,
  Sparkles,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { QuizQuestion, QuizSubmission, Student } from '../types';
import { soundManager } from '../utils/audio';

interface QuizViewProps {
  student: Student;
  onGoToCertificate: (submission: QuizSubmission) => void;
  onOpenStudentModal: () => void;
  lastSubmission: QuizSubmission | null;
  onSaveSubmission: (submission: QuizSubmission) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  student,
  onGoToCertificate,
  onOpenStudentModal,
  lastSubmission,
  onSaveSubmission,
}) => {
  // Mode: 'start' | 'testing' | 'finished'
  const [mode, setMode] = useState<'start' | 'testing' | 'finished'>('start');
  const [quizLength, setQuizLength] = useState<number>(20); // 10 or 20
  const [examMode, setExamMode] = useState<'practice' | 'formal'>('practice'); // 'practice': instant feedback, 'formal': submit at end
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [id: string]: number[] }>({});
  const [revealedIds, setRevealedIds] = useState<{ [id: string]: boolean }>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showOnlyWrong, setShowOnlyWrong] = useState(false);

  // Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === 'testing') {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode]);

  const handleStartExam = (count: number, type: 'practice' | 'formal') => {
    soundManager.playClick();
    if (!student.name || !student.id) {
      onOpenStudentModal();
      return;
    }

    // Shuffle and pick
    const shuffled = [...QUIZ_QUESTIONS].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, count);

    setActiveQuestions(picked);
    setQuizLength(count);
    setExamMode(type);
    setCurrentIdx(0);
    setSelectedAnswers({});
    setRevealedIds({});
    setElapsedSeconds(0);
    setShowOnlyWrong(false);
    setMode('testing');
  };

  const currentQ = activeQuestions[currentIdx];

  const handleSelectOption = (optionIndex: number) => {
    if (!currentQ) return;
    const isAlreadyAnswered = revealedIds[currentQ.id];
    if (examMode === 'practice' && isAlreadyAnswered) return;

    const isCorrect = currentQ.correctAnswers.includes(optionIndex);

    // Audio Feedback
    if (examMode === 'practice') {
      if (isCorrect) {
        soundManager.playCorrect();
      } else {
        soundManager.playWrong();
      }
      setRevealedIds((prev) => ({ ...prev, [currentQ.id]: true }));
    } else {
      soundManager.playClick();
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: [optionIndex],
    }));
  };

  const handleFinishExam = () => {
    let correct = 0;
    const categoryScores: { [category: string]: { correct: number; total: number } } = {};

    activeQuestions.forEach((q) => {
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { correct: 0, total: 0 };
      }
      categoryScores[q.category].total += 1;

      const userAns = selectedAnswers[q.id] || [];
      const isRight =
        userAns.length === q.correctAnswers.length &&
        userAns.every((val) => q.correctAnswers.includes(val));

      if (isRight) {
        correct += 1;
        categoryScores[q.category].correct += 1;
      }
    });

    const finalScore = Math.round((correct / activeQuestions.length) * 100);

    const submission: QuizSubmission = {
      student,
      date: new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      score: finalScore,
      totalQuestions: activeQuestions.length,
      correctCount: correct,
      answers: selectedAnswers,
      timeSpentSeconds: elapsedSeconds,
      categoryScores,
    };

    onSaveSubmission(submission);
    setMode('finished');

    if (finalScore >= 80) {
      soundManager.playVictory();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else if (finalScore >= 60) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // START SCREEN
  if (mode === 'start') {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Chapter 4 廚房安全衛生守則 模擬測驗
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6">
            完整涵蓋廚房四分區劃分、落菌數管制、人水氣物流動線、空氣補足系統、截油槽法規及 4P/5S/6M/3C/3生管理守則。
          </p>

          {/* Student Status Check */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto mb-8 text-left">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>受測學員資訊</span>
              <button
                onClick={onOpenStudentModal}
                className="text-orange-600 font-bold hover:underline"
              >
                變更資料
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-sm">
                  {student.name || '未填寫姓名'}
                </span>
                <span className="text-xs text-slate-500 font-mono ml-2">
                  ({student.id || '未設定學號'})
                </span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium">
                已準備就緒
              </span>
            </div>
          </div>

          {/* Test Option Card (Instant Practice Mode Only) */}
          <div className="max-w-md mx-auto">
            <div className="p-6 rounded-2xl border border-orange-200 bg-gradient-to-b from-orange-50/60 to-white text-left hover:border-orange-400 transition shadow-sm space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-200 text-orange-800">
                    即時練習模式
                  </span>
                  <span className="text-xs font-semibold text-slate-500">共 20 題完整測驗</span>
                </div>
                <h4 className="font-bold text-slate-900 text-lg">
                  Chapter 4 全真題目練習 (含答題音效與題解)
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  完整涵蓋教材分區劃分、落菌數管制、人水氣物流向、空氣補足系統、截油槽法規及各項廚房管理守則。每題點選後立即播放答題音效並展開詳細題解。
                </p>
              </div>

              <button
                onClick={() => handleStartExam(20, 'practice')}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/25 transition flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                開始即時練習測驗 (20 題)
              </button>
            </div>
          </div>
        </div>

        {/* Previous submission review if exists */}
        {lastSubmission && (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                {lastSubmission.score}分
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">上次測驗紀錄</div>
                <div className="text-[11px] text-slate-500">
                  {lastSubmission.date} · 答對 {lastSubmission.correctCount} / {lastSubmission.totalQuestions} 題
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onGoToCertificate(lastSubmission);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5" />
              查看證書與成績單
            </button>
          </div>
        )}
      </div>
    );
  }

  // TESTING SCREEN
  if (mode === 'testing') {
    if (!currentQ) return null;
    const answeredCount = Object.keys(selectedAnswers).length;
    const currentAnswer = selectedAnswers[currentQ.id]?.[0];
    const isAnswered = currentAnswer !== undefined;
    const isRevealed = revealedIds[currentQ.id];
    const isCorrect = currentAnswer !== undefined && currentQ.correctAnswers.includes(currentAnswer);

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Progress & Header Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
              第 {currentIdx + 1} / {activeQuestions.length} 題
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600 font-medium">{currentQ.category}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(elapsedSeconds)}
            </div>
            <button
              onClick={handleFinishExam}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition text-xs shadow-xs"
            >
              提早交卷 ({answeredCount}/{activeQuestions.length})
            </button>
          </div>
        </div>

        {/* Progress Line */}
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-orange-500 h-full transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / activeQuestions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">{currentQ.sourceSlide}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                單選題
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentIdx + 1}. {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = currentAnswer === idx;
              const isOptionCorrect = currentQ.correctAnswers.includes(idx);

              let optionStyle =
                'border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50/30 text-slate-800';

              if (examMode === 'practice' && isRevealed) {
                if (isOptionCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold';
                } else if (isSelected && !isOptionCorrect) {
                  optionStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                } else {
                  optionStyle = 'border-slate-200 bg-slate-50/50 text-slate-400';
                }
              } else if (isSelected) {
                optionStyle = 'border-orange-500 bg-orange-50 text-orange-950 font-semibold ring-2 ring-orange-500/20';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {examMode === 'practice' && isRevealed && isOptionCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {examMode === 'practice' && isRevealed && isSelected && !isOptionCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Practice Mode Explanation Box */}
          {examMode === 'practice' && isRevealed && (
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-200 ${
                isCorrect
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-200 text-rose-900'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    回答正確！
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    回答錯誤！正確答案為：
                    {currentQ.correctAnswers.map((a) => String.fromCharCode(65 + a)).join(', ')}
                  </>
                )}
              </div>
              <p className="text-slate-700">{currentQ.explanation}</p>
              <div className="text-[11px] text-slate-500 pt-1">出處依據：{currentQ.sourceSlide}</div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              disabled={currentIdx === 0}
              onClick={() => {
                soundManager.playClick();
                setCurrentIdx((prev) => prev - 1);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              上一題
            </button>

            {currentIdx < activeQuestions.length - 1 ? (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setCurrentIdx((prev) => prev + 1);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1 transition shadow-xs"
              >
                下一題
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishExam}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-1 transition shadow-md shadow-orange-600/25"
              >
                交卷並結算成績
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // FINISHED SCREEN (Report & Review)
  if (mode === 'finished') {
    let correct = 0;
    activeQuestions.forEach((q) => {
      const userAns = selectedAnswers[q.id] || [];
      if (
        userAns.length === q.correctAnswers.length &&
        userAns.every((val) => q.correctAnswers.includes(val))
      ) {
        correct += 1;
      }
    });

    const score = Math.round((correct / activeQuestions.length) * 100);
    const isPassed = score >= 60;

    const currentSubmission: QuizSubmission = {
      student,
      date: new Date().toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      score,
      totalQuestions: activeQuestions.length,
      correctCount: correct,
      answers: selectedAnswers,
      timeSpentSeconds: elapsedSeconds,
      categoryScores: {},
    };

    const wrongQuestions = activeQuestions.filter((q) => {
      const userAns = selectedAnswers[q.id] || [];
      const isRight =
        userAns.length === q.correctAnswers.length &&
        userAns.every((val) => q.correctAnswers.includes(val));
      return !isRight;
    });

    const displayedQuestions = showOnlyWrong ? wrongQuestions : activeQuestions;

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Score Card Banner */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden">
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border-4 text-3xl font-black ${
              isPassed
                ? 'bg-emerald-50 text-emerald-600 border-emerald-500'
                : 'bg-rose-50 text-rose-600 border-rose-500'
            }`}
          >
            {score}
            <span className="text-sm font-bold">分</span>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-900 mb-1">
            {score >= 90
              ? '🌟 太優秀了！特優通過！'
              : score >= 80
              ? '🎉 表現優異！高分通過！'
              : score >= 60
              ? '👍 測驗及格！基礎扎實！'
              : '💪 仍需加油，建議多翻閱字卡！'}
          </h3>

          <p className="text-xs text-slate-500 mb-6">
            學員：{student.name} ({student.id}) · 答對 {correct} / {activeQuestions.length} 題 · 耗時{' '}
            {formatTime(elapsedSeconds)}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onGoToCertificate(currentSubmission);
              }}
              className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition active:scale-95"
            >
              <FileText className="w-4 h-4" />
              匯出 PDF 學習成績證書
            </button>

            <button
              onClick={() => handleStartExam(quizLength, examMode)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              重新再測一次
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setMode('start');
              }}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-medium text-xs transition"
            >
              返回測驗首頁
            </button>
          </div>
        </div>

        {/* Detailed Review Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-lg font-bold text-slate-900">試卷逐題檢討與教材解析</h4>
              <p className="text-xs text-slate-500">深入了解每題核心依據與出處</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowOnlyWrong(false);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  !showOnlyWrong
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                全部題目 ({activeQuestions.length})
              </button>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setShowOnlyWrong(true);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  showOnlyWrong
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                錯題複習 ({wrongQuestions.length})
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {displayedQuestions.map((q, qIndex) => {
              const userAns = selectedAnswers[q.id]?.[0];
              const isRight = userAns !== undefined && q.correctAnswers.includes(userAns);

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border text-xs space-y-3 ${
                    isRight ? 'border-slate-200 bg-white' : 'border-rose-200 bg-rose-50/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-bold text-slate-900 text-sm flex items-start gap-2">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs shrink-0 ${
                          isRight ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isRight ? '✓' : '✗'}
                      </span>
                      <span>
                        第 {qIndex + 1} 題：{q.question}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{q.sourceSlide}</span>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7">
                    {q.options.map((opt, optIdx) => {
                      const isCorrectChoice = q.correctAnswers.includes(optIdx);
                      const isUserChoice = userAns === optIdx;

                      let badgeStyle = 'bg-slate-50 border-slate-200 text-slate-600';
                      if (isCorrectChoice) {
                        badgeStyle = 'bg-emerald-100 border-emerald-300 text-emerald-900 font-bold';
                      } else if (isUserChoice && !isCorrectChoice) {
                        badgeStyle = 'bg-rose-100 border-rose-300 text-rose-900 font-bold';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${badgeStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{String.fromCharCode(65 + optIdx)}.</span>
                            <span>{opt}</span>
                          </div>
                          {isUserChoice && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/80">
                              你的作答
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div className="pl-7 pt-2 text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-700">【教材解析】</span>
                    <p>{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
