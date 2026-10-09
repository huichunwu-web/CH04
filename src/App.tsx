import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { ScenarioView } from './components/ScenarioView';
import { CertificateView } from './components/CertificateView';
import { StudentModal } from './components/StudentModal';
import { Student, QuizSubmission } from './types';
import { soundManager } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'overview' | 'flashcards' | 'quiz' | 'scenarios' | 'certificate'
  >('overview');

  const [student, setStudent] = useState<Student>(() => {
    try {
      const saved = localStorage.getItem('kitchen_student_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      id: 'S112001',
      name: '學生學員',
      department: '餐旅管理學系 / 食品安全與衛生課程',
    };
  });

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  const [lastSubmission, setLastSubmission] = useState<QuizSubmission | null>(() => {
    try {
      const saved = localStorage.getItem('kitchen_last_submission');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return null;
  });

  const handleSaveStudent = (updated: Student) => {
    setStudent(updated);
    localStorage.setItem('kitchen_student_profile', JSON.stringify(updated));
  };

  const handleSaveSubmission = (sub: QuizSubmission) => {
    setLastSubmission(sub);
    localStorage.setItem('kitchen_last_submission', JSON.stringify(sub));
  };

  const handleGoToCertificate = (sub: QuizSubmission) => {
    setLastSubmission(sub);
    setCurrentTab('certificate');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* Top Navigation & Student Badge */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        student={student}
        onOpenStudentModal={() => setIsStudentModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'overview' && (
          <OverviewView
            onGoToCards={() => setCurrentTab('flashcards')}
            onGoToQuiz={() => setCurrentTab('quiz')}
          />
        )}

        {currentTab === 'flashcards' && <FlashcardsView />}

        {currentTab === 'quiz' && (
          <QuizView
            student={student}
            onGoToCertificate={handleGoToCertificate}
            onOpenStudentModal={() => setIsStudentModalOpen(true)}
            lastSubmission={lastSubmission}
            onSaveSubmission={handleSaveSubmission}
          />
        )}

        {currentTab === 'scenarios' && (
          <ScenarioView
            student={student}
            onOpenStudentModal={() => setIsStudentModalOpen(true)}
          />
        )}

        {currentTab === 'certificate' && (
          <CertificateView
            student={student}
            submission={lastSubmission}
            onOpenStudentModal={() => setIsStudentModalOpen(true)}
            onGoToQuiz={() => setCurrentTab('quiz')}
          />
        )}
      </main>

      {/* Student Profile Setting Modal */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        currentStudent={student}
        onSave={handleSaveStudent}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500 space-y-1 no-print">
        <p className="font-medium text-slate-700">
          Chapter 4 廚房安全衛生守則 數位學習測驗與情境評量系統
        </p>
        <p className="text-[11px] text-slate-400">
          教材內容依據：李學愚、文長安餐飲設備流程規範及食品良好衛生規範準則(GHP)第22條、建築設備編第29條
        </p>
      </footer>
    </div>
  );
}
