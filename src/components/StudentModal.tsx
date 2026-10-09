import React, { useState } from 'react';
import { User, IdCard, GraduationCap, X, Check } from 'lucide-react';
import { Student } from '../types';
import { soundManager } from '../utils/audio';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: Student;
  onSave: (student: Student) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onSave,
}) => {
  const [name, setName] = useState(currentStudent.name || '');
  const [id, setId] = useState(currentStudent.id || '');
  const [department, setDepartment] = useState(
    currentStudent.department || '餐旅管理學系 / 食品安全與衛生課程'
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('請輸入學生姓名');
      soundManager.playWrong();
      return;
    }
    if (!id.trim()) {
      setError('請輸入學生學號');
      soundManager.playWrong();
      return;
    }

    const updated: Student = {
      name: name.trim(),
      id: id.trim().toUpperCase(),
      department: department.trim(),
      loginAt: new Date().toISOString(),
    };

    soundManager.playCorrect();
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header pattern */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <IdCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">學員身分設定</h3>
                <p className="text-xs text-amber-100">測驗成績與證書匯出需填寫學號姓名</p>
              </div>
            </div>
            {currentStudent.name && (
              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onClose();
                }}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-200 rounded-lg flex items-center gap-2">
              <span className="font-bold">提示：</span>
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-orange-600" />
              學生姓名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="例：陳大明"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <IdCard className="w-4 h-4 text-orange-600" />
              學生學號 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={id}
              onChange={(e) => {
                setId(e.target.value);
                if (error) setError('');
              }}
              placeholder="例：S11245089"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm font-mono uppercase transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-orange-600" />
              班級 / 科系所（選填）
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="例：餐旅廚藝系 二年甲班"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm transition"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-medium rounded-xl shadow-lg shadow-orange-600/25 transition duration-150 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Check className="w-4 h-4" />
              確認儲存並開始學習
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
