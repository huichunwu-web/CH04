import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Briefcase,
  FileText,
  Volume2,
  VolumeX,
  User,
  Sparkles,
  Map,
  ShieldCheck,
} from 'lucide-react';
import { Student } from '../types';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentTab: 'overview' | 'flashcards' | 'quiz' | 'scenarios' | 'certificate';
  onTabChange: (tab: 'overview' | 'flashcards' | 'quiz' | 'scenarios' | 'certificate') => void;
  student: Student;
  onOpenStudentModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  student,
  onOpenStudentModal,
}) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  const handleToggleSound = () => {
    const nextMute = soundManager.toggleMute();
    setIsMuted(nextMute);
  };

  const navItems = [
    { id: 'overview', label: '教材導圖', icon: Map },
    { id: 'flashcards', label: '學習字卡', icon: BookOpen },
    { id: 'quiz', label: '模擬測驗', icon: HelpCircle },
    { id: 'scenarios', label: '情境分析', icon: Briefcase },
    { id: 'certificate', label: 'PDF 輸出', icon: FileText },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo & Course Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 rounded-md">
                  Chapter 4
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline-block">餐飲專業衛生規範</span>
              </div>
              <h1 className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                廚房安全衛生守則
              </h1>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    soundManager.playClick();
                    onTabChange(item.id);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-orange-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Badge & Sound Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              title={isMuted ? '開啟答題音效' : '關閉答題音效 (靜音)'}
              className={`p-2.5 rounded-xl border transition-all ${
                isMuted
                  ? 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-600'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Student ID Badge */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenStudentModal();
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition text-left group"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                <User className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-800 leading-none flex items-center gap-1">
                  {student.name || '學員登記'}
                  <span className="text-[10px] text-orange-600 font-normal underline">修改</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-0.5 leading-none">
                  {student.id ? student.id : '未登記學號'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto pb-2 gap-1.5 pt-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playClick();
                  onTabChange(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
