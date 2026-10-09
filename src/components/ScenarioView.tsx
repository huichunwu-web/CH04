import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SCENARIO_CASES } from '../data/scenarios';
import { ScenarioCase, Student } from '../types';
import { soundManager } from '../utils/audio';

interface ScenarioViewProps {
  student: Student;
  onOpenStudentModal: () => void;
}

export const ScenarioView: React.FC<ScenarioViewProps> = ({
  student,
  onOpenStudentModal,
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [answers, setAnswers] = useState<{
    [caseId: string]: { q1ChoiceId?: string; q2ChoiceId?: string };
  }>({});
  const [showAnalysis, setShowAnalysis] = useState<{ [caseId: string]: boolean }>({});

  const currentCase = SCENARIO_CASES[activeCaseIndex];
  const currentAnswers = answers[currentCase.id] || {};

  const handleSelectChoice = (questionNum: 'q1' | 'q2', choiceId: string, isOptimal: boolean) => {
    if (isOptimal) {
      soundManager.playCorrect();
    } else {
      soundManager.playWrong();
    }

    setAnswers((prev) => ({
      ...prev,
      [currentCase.id]: {
        ...prev[currentCase.id],
        [questionNum === 'q1' ? 'q1ChoiceId' : 'q2ChoiceId']: choiceId,
      },
    }));
  };

  // Count total completed cases
  const completedCount = Object.keys(answers).filter(
    (id) => answers[id]?.q1ChoiceId && answers[id]?.q2ChoiceId
  ).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            實務現場情境診斷分析室
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Chapter 4 廚房安全與衛生實例決策
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            學員透過六大真實餐飲案場，診斷動線逆向、地面排水、空氣補足、截油槽與管理體系之破口
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
          <div>
            <div className="text-slate-400">目前學員</div>
            <div className="font-bold text-slate-800">
              {student.name || '訪客學員'} <span className="font-mono">({student.id || '未登記'})</span>
            </div>
          </div>
          <div className="border-l border-slate-200 pl-4 text-center">
            <div className="text-slate-400">案例完成度</div>
            <div className="font-bold text-orange-600 font-mono text-sm">
              {completedCount} / {SCENARIO_CASES.length}
            </div>
          </div>
        </div>
      </div>

      {/* Case Tabs Selection */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
        {SCENARIO_CASES.map((item, idx) => {
          const isSelected = activeCaseIndex === idx;
          const isDone = answers[item.id]?.q1ChoiceId && answers[item.id]?.q2ChoiceId;

          return (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                setActiveCaseIndex(idx);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition border flex items-center gap-2 shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>案例 {idx + 1}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Main Case Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        {/* Case Header */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-xl bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200">
              案例案場：{currentCase.location}
            </span>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold ${
                currentCase.severity === 'high'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              嚴重程度：{currentCase.severity === 'high' ? '高風險危害' : '中度違規'}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
            {currentCase.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">{currentCase.subtitle}</p>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-1">【案情紀實】</span>
            {currentCase.background}
          </div>

          {/* Observed Problems */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              現場稽查發現三大破口：
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {currentCase.problemsObserved.map((prob, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-rose-50/60 border border-rose-200 text-xs text-rose-900 font-medium leading-relaxed flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{prob}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question 1: Root Cause Diagnosis */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-orange-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {currentCase.question1.prompt}
            </h4>
          </div>

          <div className="space-y-2.5">
            {currentCase.question1.choices.map((choice) => {
              const isSelected = currentAnswers.q1ChoiceId === choice.id;
              return (
                <div key={choice.id} className="space-y-2">
                  <button
                    onClick={() => handleSelectChoice('q1', choice.id, choice.isOptimal)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? choice.isOptimal
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                          : 'border-rose-500 bg-rose-50 text-rose-950 font-semibold'
                        : 'border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50/30 text-slate-800'
                    }`}
                  >
                    <span>{choice.text}</span>
                    {isSelected && (
                      <span className="shrink-0">
                        {choice.isOptimal ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded bg-rose-200 text-rose-800 font-bold">
                            得 {choice.score} 分
                          </span>
                        )}
                      </span>
                    )}
                  </button>

                  {/* Immediate Feedback */}
                  {isSelected && (
                    <div
                      className={`p-3.5 rounded-xl text-xs leading-relaxed animate-in fade-in duration-200 border ${
                        choice.isOptimal
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <strong className="block mb-0.5">
                        {choice.isOptimal ? '專家觀點肯定：' : '診斷修正指引：'}
                      </strong>
                      {choice.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Question 2: Corrective Action */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-orange-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              {currentCase.question2.prompt}
            </h4>
          </div>

          <div className="space-y-2.5">
            {currentCase.question2.choices.map((choice) => {
              const isSelected = currentAnswers.q2ChoiceId === choice.id;
              return (
                <div key={choice.id} className="space-y-2">
                  <button
                    onClick={() => handleSelectChoice('q2', choice.id, choice.isOptimal)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? choice.isOptimal
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                          : 'border-rose-500 bg-rose-50 text-rose-950 font-semibold'
                        : 'border-slate-200 bg-white hover:border-orange-400 hover:bg-orange-50/30 text-slate-800'
                    }`}
                  >
                    <span>{choice.text}</span>
                    {isSelected && (
                      <span className="shrink-0">
                        {choice.isOptimal ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <span className="text-xs px-2 py-0.5 rounded bg-rose-200 text-rose-800 font-bold">
                            得 {choice.score} 分
                          </span>
                        )}
                      </span>
                    )}
                  </button>

                  {/* Immediate Feedback */}
                  {isSelected && (
                    <div
                      className={`p-3.5 rounded-xl text-xs leading-relaxed animate-in fade-in duration-200 border ${
                        choice.isOptimal
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <strong className="block mb-0.5">
                        {choice.isOptimal ? '專家觀點肯定：' : '對策修正指引：'}
                      </strong>
                      {choice.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Expandable Key Regulations & Expert Analysis */}
        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              soundManager.playClick();
              setShowAnalysis((prev) => ({
                ...prev,
                [currentCase.id]: !prev[currentCase.id],
              }));
            }}
            className="w-full p-4 rounded-2xl bg-amber-50 hover:bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-between transition"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-700" />
              查看此案例之對照法規條文與專家總結剖析
            </div>
            {showAnalysis[currentCase.id] ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showAnalysis[currentCase.id] && (
            <div className="mt-3 p-5 rounded-2xl bg-slate-900 text-white space-y-4 text-xs animate-in fade-in duration-200">
              <div>
                <span className="text-orange-400 font-bold block mb-1">【法定條文依據】</span>
                <ul className="space-y-1 text-slate-300">
                  {currentCase.keyRegulations.map((reg, idx) => (
                    <li key={idx}>• {reg}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-orange-400 font-bold block mb-1">【專家精闢講評】</span>
                <p className="text-slate-300 leading-relaxed">{currentCase.expertAnalysis}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation between cases */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            disabled={activeCaseIndex === 0}
            onClick={() => {
              soundManager.playClick();
              setActiveCaseIndex((prev) => prev - 1);
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none"
          >
            ← 上一個案例
          </button>

          <span className="text-xs text-slate-400">
            案例 {activeCaseIndex + 1} / {SCENARIO_CASES.length}
          </span>

          <button
            disabled={activeCaseIndex === SCENARIO_CASES.length - 1}
            onClick={() => {
              soundManager.playClick();
              setActiveCaseIndex((prev) => prev + 1);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
          >
            下一個案例 →
          </button>
        </div>
      </div>
    </div>
  );
};
