import React from 'react';
import {
  ArrowRight,
  Shield,
  Wind,
  Droplets,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ThermometerSnowflake,
  BugOff,
  Sparkles,
  BookOpen,
  ClipboardList,
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface OverviewViewProps {
  onGoToQuiz: () => void;
  onGoToCards: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onGoToQuiz, onGoToCards }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-8 sm:p-10 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            華立圖書 餐飲安全與衛生教材精華
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Chapter 4 廚房安全衛生守則
          </h2>
          <p className="text-sm sm:text-base text-amber-100 font-normal leading-relaxed">
            廚房分區要明確，動線流程無交叉污染之虞！掌握四分區落菌標準、人流氣流水流正逆向原則、空氣補足系統、截油槽運作法規以及 4P/5S/6M/雙T/3不/3C/3生管理體系。
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                onGoToCards();
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-orange-700 font-bold text-sm shadow-md hover:bg-orange-50 transition flex items-center gap-2 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              翻閱學習字卡
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onGoToQuiz();
              }}
              className="px-5 py-2.5 rounded-xl bg-orange-700/80 hover:bg-orange-800 text-white font-bold text-sm border border-white/20 transition flex items-center gap-2 active:scale-95"
            >
              <ClipboardList className="w-4 h-4" />
              立即模擬測驗
            </button>
          </div>
        </div>
      </div>

      {/* Part 1: 廚房四分區與動線要求 */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-orange-500 rounded-full"></span>
              <h3 className="text-xl font-bold text-slate-900">壹、廚房分區與動線衛生要求</h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              廚房最怕操作流程逆向，設計錯誤必定一塌糊塗
            </p>
          </div>
          <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg border border-amber-200">
            核心規範 (Slide 2-3)
          </span>
        </div>

        {/* 4 Zones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* 一般工作區 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-200 text-slate-700">
                一般工作區
              </span>
              <span className="text-xs text-slate-500">外部周邊</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">辦公室、檢驗室、廁所</p>
            <ul className="text-xs space-y-1.5 text-slate-600">
              <li>• 水流/氣流：獨立系統</li>
              <li>• 氣壓：獨立系統</li>
              <li>• 地板要求：<strong className="text-slate-800">乾</strong></li>
              <li>• 落菌數：標準未單列</li>
            </ul>
          </div>

          {/* 污染區 */}
          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/60">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-200 text-rose-800">
                污染區
              </span>
              <span className="text-xs font-mono font-bold text-rose-600">菌落 &lt; 500</span>
            </div>
            <p className="text-xs text-rose-900 mb-3">驗收區、洗菜區、餐具洗滌區</p>
            <ul className="text-xs space-y-1.5 text-rose-800">
              <li>• 氣壓：充足空氣 (排風負壓)</li>
              <li>• 地板要求：<strong className="text-rose-900">作業中可濕</strong> (非作業需乾)</li>
              <li>• 落菌數：<strong className="text-rose-900">500 個以下</strong> (較高)</li>
              <li>• 物質進出：原料入口</li>
            </ul>
          </div>

          {/* 準清潔區 */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-200 text-amber-800">
                準清潔區
              </span>
              <span className="text-xs font-mono font-bold text-amber-600">菌落 &lt; 50</span>
            </div>
            <p className="text-xs text-amber-900 mb-3">切割區、調理區、烹調區、冷盤區</p>
            <ul className="text-xs space-y-1.5 text-amber-800">
              <li>• 氣壓：空氣補足系統 (Air Make-Up)</li>
              <li>• 地板要求：<strong className="text-amber-900">乾</strong></li>
              <li>• 落菌數：<strong className="text-amber-900">500 個以下 → 50 個以下</strong></li>
              <li>• 人員：管制作業區 (非作業人員不得進入)</li>
            </ul>
          </div>

          {/* 清潔區 */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60">
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-200 text-emerald-800">
                清潔區
              </span>
              <span className="text-xs font-mono font-bold text-emerald-600">菌落 &lt; 30</span>
            </div>
            <p className="text-xs text-emerald-900 mb-3">上菜區 / 包裝區 / 配膳區</p>
            <ul className="text-xs space-y-1.5 text-emerald-800">
              <li>• 氣壓：<strong className="text-emerald-900">正壓 (Positive Pressure)</strong></li>
              <li>• 地板要求：<strong className="text-emerald-900">乾</strong></li>
              <li>• 落菌數：<strong className="text-emerald-900">30 個以下</strong> (最嚴格)</li>
              <li>• 人員：管制作業區，嚴禁反向走動</li>
            </ul>
          </div>
        </div>

        {/* 4 Flow Arrows Diagram */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            四大流向原則（極為重要！測驗必考）
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                人流方向
              </div>
              <div className="font-semibold text-blue-600 flex items-center gap-1">
                清潔區 <ArrowRight className="w-3.5 h-3.5 text-blue-400" /> 污染區
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                物流方向 (唯一反向)
              </div>
              <div className="font-bold text-amber-600 flex items-center gap-1">
                污染區 <ArrowRight className="w-3.5 h-3.5 text-amber-400" /> 清潔區
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                水流方向
              </div>
              <div className="font-semibold text-cyan-600 flex items-center gap-1">
                清潔區 <ArrowRight className="w-3.5 h-3.5 text-cyan-400" /> 污染區
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                氣流方向
              </div>
              <div className="font-semibold text-purple-600 flex items-center gap-1">
                清潔區 (正壓) <ArrowRight className="w-3.5 h-3.5 text-purple-400" /> 污染區
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: 食物製備流程與地面排水 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 食物製備動線 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-5 bg-blue-500 rounded-full"></span>
              <h3 className="font-bold text-slate-900">食物製備動線流程 (Slide 4)</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              李學愚、文長安餐飲設備及流程：順暢單向不逆流
            </p>

            <div className="space-y-2">
              {[
                { step: '1', title: '採收、驗收', desc: '原料品管檢查與初步分類' },
                { step: '2', title: '洗滌、貯存', desc: '清水多道浸泡清洗、低溫冷藏' },
                { step: '3', title: '切割', desc: '刀具砧板生熟分離，進入準清潔區' },
                { step: '4', title: '調理、加工', desc: '醃漬、調味、配料原料貯存支援' },
                { step: '5', title: '烹飪', desc: '高溫殺菌熟化，雙T控溫控時' },
                { step: '6', title: '分裝、盤飾', desc: '盛裝防塵防污染，餐具貯存配合' },
                { step: '7', title: '配膳', desc: '清潔包裝/配膳區保持正壓環境' },
                { step: '8', title: '供膳', desc: '出餐送達顧客端，廢棄物與餐具洗滌循獨立路線' },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 text-xs transition"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    {item.step}
                  </span>
                  <div className="flex-1 font-semibold text-slate-800">{item.title}</div>
                  <div className="text-slate-500 text-[11px]">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 地面安全與空氣補足 */}
        <div className="space-y-6">
          {/* 乾式地面 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-5 bg-amber-500 rounded-full"></span>
              <h3 className="font-bold text-slate-900">先有個「乾」的地面 (Slide 5, 18)</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              國內廚房髒亂之源，莫過於地板的「<strong>濕與滑</strong>」。走起路來如履薄冰，嚴重降低工作效率與廚工安全。
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                <div className="font-bold text-amber-900 mb-1">濕漉兩大主因</div>
                <div className="text-amber-700 space-y-1">
                  <div>1. 地下水之濫用</div>
                  <div>2. 排水溝設計 (明暗溝)</div>
                </div>
              </div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <div className="font-bold text-emerald-900 mb-1">對策方案</div>
                <div className="text-emerald-700 space-y-1">
                  <div>• 無障礙格柵截水槽</div>
                  <div>• 非作業時間嚴格保持乾燥</div>
                </div>
              </div>
            </div>
          </div>

          {/* 空氣補足系統 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-5 bg-purple-500 rounded-full"></span>
              <h3 className="font-bold text-slate-900">空氣補足系統 (Air Make-Up System)</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">大廚房設置 5 大優點 (Slide 6)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>1. 降低廚房溫度</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>2. 隔開爐灶之熱</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 sm:col-span-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>3. 補充油煙機抽氣後局部低壓與空氣不足</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 sm:col-span-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>4. 導順油煙順暢抽出，油煙不亂竄</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2 sm:col-span-2">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>5. 提供廚師良好的操作環境</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 3: 管理矩陣 (4P/5S/6M/雙T/3不/3C/3生/截油槽) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-rose-500 rounded-full"></span>
            <h3 className="text-xl font-bold text-slate-900">肆、廚房重要管理規則全景矩陣</h3>
          </div>
          <span className="text-xs text-slate-500">Slide 7 ~ 19 精粹速覽</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 4P/5P/6P */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-orange-300 transition">
            <div className="text-xs font-bold text-orange-600 mb-1">行銷與營運</div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">4P / 5P / 6P 管理</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• <strong>Place</strong>：地點與通路要對</div>
              <div>• <strong>Product</strong>：品質與口感要好</div>
              <div>• <strong>Price</strong>：充足資金與合適價位</div>
              <div>• <strong>Promotion</strong>：淡季/滯銷促銷</div>
              <div className="text-orange-700 font-semibold">• 5P: + <strong>People</strong> 員工與客群研究</div>
              <div className="text-orange-700 font-semibold">• 6P: + <strong>Program</strong> e化系統建立</div>
            </div>
          </div>

          {/* 美式 5S */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 transition">
            <div className="text-xs font-bold text-blue-600 mb-1">制度化模式</div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">美國式 5S 管理</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• <strong>Sanitation</strong>：衛生落實化</div>
              <div>• <strong>Simplification</strong>：制度簡單化</div>
              <div>• <strong>Specialization</strong>：廚房專業化</div>
              <div>• <strong>Standardization</strong>：廚房標準化</div>
              <div>• <strong>Supervision</strong>：管理督導化</div>
            </div>
          </div>

          {/* 日式 5S */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-emerald-300 transition">
            <div className="text-xs font-bold text-emerald-600 mb-1">現場改善力</div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">日本式 5S 管理</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• <strong>整理 Seiri</strong>：丟棄不要之物</div>
              <div>• <strong>整頓 Seiton</strong>：要的定位標示</div>
              <div>• <strong>清掃 Seiso</strong>：打掃與點檢保養</div>
              <div>• <strong>清潔 Seiketsu</strong>：維持前3S美好狀態</div>
              <div>• <strong>教養 Shitsuke</strong>：養成自律素養習慣</div>
            </div>
          </div>

          {/* 6M 至 9M */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-purple-300 transition">
            <div className="text-xs font-bold text-purple-600 mb-1">生產六大要素</div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">6M ~ 9M 管理</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• <strong>Men</strong>：人員衛生與訓練</div>
              <div>• <strong>Money</strong>：資金與預算控制</div>
              <div>• <strong>Material</strong>：食材安全貯存</div>
              <div>• <strong>Machinery</strong>：設施保養維護</div>
              <div>• <strong>Minutes</strong>：時間管理控管</div>
              <div>• <strong>Methods</strong>：正確方法Know-how</div>
              <div className="text-purple-700 font-semibold">• 7-9M: + Management, Morale, Market</div>
            </div>
          </div>

          {/* 雙T管制 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-red-300 transition">
            <div className="text-xs font-bold text-red-600 mb-1">微生物控制</div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">雙 T 管制</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• <strong>Temperature (溫度)</strong></div>
              <div>• <strong>Time (時間)</strong></div>
              <p className="text-[11px] text-slate-500 pt-1">
                嚴格控制在危險溫度帶 (7~60℃) 的停留時間，保溫需 60℃ 以上，冷藏需 7℃ 以下。
              </p>
            </div>
          </div>

          {/* 3不政策 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-amber-300 transition">
            <div className="text-xs font-bold text-amber-600 mb-1">病蟲害管制</div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">3 不政策</h4>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                1. 不讓它來 (紗窗/風幕/格柵)
              </div>
              <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                2. 不讓它吃 (加蓋/廚餘淨空)
              </div>
              <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                3. 不讓它住 (清除紙箱積水)
              </div>
            </div>
          </div>

          {/* 3C 管理 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-teal-300 transition">
            <div className="text-xs font-bold text-teal-600 mb-1">安全衛生日常</div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">3 C 管理</h4>
            <div className="text-xs text-slate-600 space-y-1.5">
              <div>• <strong>Cook or Cold</strong>：加熱或冷藏/冷凍</div>
              <div>• <strong>Clean</strong>：洗手消毒與器具潔淨</div>
              <div>• <strong>Cover</strong>：所有容器隨時加蓋</div>
            </div>
          </div>

          {/* 截油槽與法規 */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-indigo-300 transition">
            <div className="text-xs font-bold text-indigo-600 mb-1">法規與設施</div>
            <h4 className="font-bold text-slate-900 text-sm mb-2">截油槽 (油脂截留器)</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div>• <strong>GHP 22 條</strong>：應經常清理乾淨</div>
              <div>• <strong>建築設備編 29/30條</strong>：強制設置</div>
              <div>• 原理：水流動力、高水位浮油、水力停留時間、菜渣沉渣分離</div>
            </div>
          </div>
        </div>

        {/* 3生金字塔頂層 */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border border-orange-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-600 text-white">
                金字塔頂峰
              </span>
              <h4 className="font-black text-slate-900 text-base">九、3 生管理最高境界</h4>
            </div>
            <p className="text-xs text-slate-600">
              整合「3不政策」與「3C管理」，構築餐飲安全衛生的永續基石
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="px-3.5 py-2 bg-white rounded-xl shadow-xs border border-orange-200">
              <strong className="text-orange-700">1. 生態要衛生</strong>
              <div className="text-slate-500 text-[11px]">抽風、排水、管制人員</div>
            </div>
            <div className="px-3.5 py-2 bg-white rounded-xl shadow-xs border border-orange-200">
              <strong className="text-orange-700">2. 生產要衛生</strong>
              <div className="text-slate-500 text-[11px]">生熟食分開、動線管控、定期消毒</div>
            </div>
            <div className="px-3.5 py-2 bg-white rounded-xl shadow-xs border border-orange-200">
              <strong className="text-orange-700">3. 生活要衛生</strong>
              <div className="text-slate-500 text-[11px]">從業人員體檢、洗手良好習慣</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
