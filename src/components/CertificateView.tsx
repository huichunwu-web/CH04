import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Download,
  Printer,
  Award,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { QuizSubmission, Student } from '../types';
import { soundManager } from '../utils/audio';

interface CertificateViewProps {
  student: Student;
  submission: QuizSubmission | null;
  onOpenStudentModal: () => void;
  onGoToQuiz: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  student,
  submission,
  onOpenStudentModal,
  onGoToQuiz,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // If no submission yet, create a default mock or learning record representation
  const score = submission ? submission.score : 85;
  const isPassed = score >= 60;
  const examDate = submission?.date || new Date().toLocaleString('zh-TW');

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);
    soundManager.playClick();

    try {
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`廚房安全衛生守則_學習證書_${student.id || '學員'}_${student.name || '姓名'}.pdf`);

      soundManager.playVictory();
    } catch (err) {
      console.error('PDF export error:', err);
      soundManager.playWrong();
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Action Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-black text-slate-900">PDF 學習成果證書與成績單輸出</h2>
          <p className="text-xs text-slate-500 mt-1">
            包含學生學號、姓名、測驗評級、法規規範掌握度與合格簽核印記
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            友善列印
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md shadow-orange-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                正在產出 PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                下載 PDF 證書
              </>
            )}
          </button>
        </div>
      </div>

      {!submission && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between text-xs text-amber-800 no-print">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>尚未進行正式測驗！下方為預覽樣板，建議先前往模擬測驗取得正式成績。</span>
          </div>
          <button
            onClick={onGoToQuiz}
            className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 transition"
          >
            立即測驗
          </button>
        </div>
      )}

      {/* CERTIFICATE PREVIEW (This container is captured for PDF) */}
      <div
        ref={certificateRef}
        id="certificate-print-area"
        className="bg-white p-8 sm:p-12 rounded-3xl border-4 border-double border-amber-600/60 shadow-xl relative overflow-hidden text-slate-800"
      >
        {/* Subtle Watermark Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <ShieldCheck className="w-[450px] h-[450px]" />
        </div>

        {/* Certificate Border Decoration */}
        <div className="border border-amber-400/40 p-6 sm:p-8 rounded-2xl space-y-8 relative">
          {/* Header */}
          <div className="text-center space-y-2 pb-6 border-b border-amber-200/80">
            <div className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-amber-700 uppercase">
              <span>中華民國餐飲食品安全教育標準</span>
              <span>•</span>
              <span>第 4 章專題檢定</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              廚房安全衛生守則 學習檢定合格證書
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-serif">
              Certificate of Completion & Competency in Kitchen Safety & Sanitation
            </p>
          </div>

          {/* Student Profile Info Grid */}
          <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5">受測學員姓名</span>
              <strong className="text-slate-900 text-base">{student.name || '陳大明'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">學生學號 (ID)</span>
              <strong className="text-slate-900 text-base font-mono">{student.id || 'A11234567'}</strong>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">所屬科系所 / 班級</span>
              <strong className="text-slate-800 text-xs">
                {student.department || '餐旅管理學系'}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block mb-0.5">檢定日期與時間</span>
              <strong className="text-slate-800 text-xs font-mono">{examDate}</strong>
            </div>
          </div>

          {/* Statement of Certification */}
          <div className="text-center py-4 space-y-2">
            <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-serif">
              茲證明學員 <span className="font-bold underline decoration-amber-500 decoration-2">{student.name || '陳大明'}</span>（學號：
              <span className="font-mono font-bold">{student.id || 'A11234567'}</span>），修習
              <strong className="text-slate-900">《Chapter 4 廚房安全衛生守則》</strong>
              專題課程，完成廚房四分區劃分、落菌數管制標準、動線流向、乾式地面、空氣補足系統、截油槽運作法規及 4P/5S/6M/3C/3生管理守則之數位學習與模擬檢定，成績評定合格，特頒此證以資證明。
            </p>
          </div>

          {/* Competency Evaluation Breakdown */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider text-center">
              學習領域能力指標評核
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">1. 廚房分區與落菌控制 (Slide 2-3)</div>
                  <div className="text-[11px] text-slate-500">清潔區 &lt;30、準清潔 &lt;50、污染 &lt;500</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                  精熟 (A+)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">2. 動線人水氣物流向 (Slide 2, 4)</div>
                  <div className="text-[11px] text-slate-500">清潔流向污染、物流單向由污至潔</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                  精熟 (A+)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">3. 地面排水與空氣補足 (Slide 5-6)</div>
                  <div className="text-[11px] text-slate-500">破除濕滑、Air Make-Up 5大優勢</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                  精熟 (A+)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">4. 截油槽與法規依據 (Slide 15-18)</div>
                  <div className="text-[11px] text-slate-500">GHP第22條、高水位水力浮油分離</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                  精熟 (A+)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between sm:col-span-2">
                <div>
                  <div className="font-bold text-slate-800">5. 綜合管理守則金字塔 (Slide 7-19)</div>
                  <div className="text-[11px] text-slate-500">4P/5P/6P、美式5S、日式5S、6M-9M、雙T、3不、3C、3生頂峰</div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs">
                  特優 (Excellence)
                </span>
              </div>
            </div>
          </div>

          {/* Score & Stamp Verification Footer */}
          <div className="pt-6 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Score Seal */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex flex-col items-center justify-center shadow-lg shadow-amber-600/30">
                <span className="text-2xl font-black">{score}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">檢定總分</span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">
                  評定結果：
                  <span className={isPassed ? 'text-emerald-600' : 'text-rose-600'}>
                    {isPassed ? '測驗合格 PASS' : '未達標準'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  滿分 100 分 · 及格門檻 60 分
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  認證序號：HA-2026-CH4-{Math.abs(student.id?.split('').reduce((a,b)=>a+b.charCodeAt(0), 1000) || 8848)}
                </div>
              </div>
            </div>

            {/* Official Stamp & Sign Box */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="w-24 h-10 border-b border-slate-400 flex items-end justify-center pb-1">
                  <span className="font-serif italic text-sm text-slate-700">指導教師檢覈</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">授課指導教授簽章</span>
              </div>

              {/* Chinese Official Red Seal */}
              <div className="w-20 h-20 border-2 border-red-600 rounded-lg p-1 flex items-center justify-center text-red-600 font-serif font-black text-center text-[10px] leading-tight rotate-[-4deg] opacity-90 shadow-xs">
                餐飲衛生
                <br />
                檢定合格
                <br />
                教學專用
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
