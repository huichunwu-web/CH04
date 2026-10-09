import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Search,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { FLASHCARDS } from '../data/flashcards';
import { CardCategory, Flashcard } from '../types';
import { soundManager } from '../utils/audio';

export const FlashcardsView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CardCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kitchen_mastered_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter cards
  const filteredCards = FLASHCARDS.filter((card) => {
    const matchCategory = selectedCategory === 'all' || card.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === '' ||
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.keyPoints.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (card.mnemonic && card.mnemonic.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, searchQuery]);

  const currentCard: Flashcard | undefined = filteredCards[currentIndex];

  const handleFlip = () => {
    soundManager.playFlip();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (filteredCards.length === 0) return;
    soundManager.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    if (filteredCards.length === 0) return;
    soundManager.playClick();
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    if (filteredCards.length <= 1) return;
    soundManager.playClick();
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * filteredCards.length);
    setCurrentIndex(randomIndex);
  };

  const toggleMastered = (cardId: string) => {
    soundManager.playCorrect();
    setMasteredIds((prev) => {
      const updated = prev.includes(cardId)
        ? prev.filter((id) => id !== cardId)
        : [...prev, cardId];
      localStorage.setItem('kitchen_mastered_cards', JSON.stringify(updated));
      return updated;
    });
  };

  const isCurrentMastered = currentCard ? masteredIds.includes(currentCard.id) : false;

  const categories = [
    { id: 'all', label: '全部字卡' },
    { id: 'zones_flow', label: '廚房分區與動線' },
    { id: 'facility_env', label: '地面與空氣補足' },
    { id: 'management_rules', label: '管理守則全集' },
    { id: 'grease_trap', label: '截油槽與法規' },
  ] as const;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Category Pills & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundManager.playClick();
                setSelectedCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋關鍵字或口訣..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
          />
        </div>
      </div>

      {/* Progress & Quick Stats */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <div>
          共 <span className="font-bold text-slate-800">{filteredCards.length}</span> 張字卡
          {filteredCards.length > 0 && (
            <span className="ml-2 font-mono">
              (目前第 {currentIndex + 1} / {filteredCards.length} 張)
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-emerald-600 font-medium">
          <CheckCircle className="w-3.5 h-3.5" />
          已掌握：{masteredIds.length} / {FLASHCARDS.length}
        </div>
      </div>

      {/* Flashcard Area */}
      {filteredCards.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-700">沒有找到相符的字卡</h4>
          <p className="text-xs text-slate-400 mt-1">請嘗試調整分類或搜尋詞彙</p>
        </div>
      ) : (
        currentCard && (
          <div className="relative perspective-1000 min-h-[440px] sm:min-h-[460px]">
            <div
              onClick={handleFlip}
              className={`relative w-full min-h-[440px] sm:min-h-[460px] cursor-pointer transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front Face */}
              <div className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-10 shadow-lg border bg-white border-slate-200 text-slate-800 backface-hidden flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-700">
                        {currentCard.categoryLabel}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600">
                        {currentCard.tag}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{currentCard.sourceSlide}</span>
                  </div>

                  <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                    {currentCard.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-500 mb-6 font-medium">
                    {currentCard.subtitle}
                  </p>

                  <div className="space-y-3 bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      核心重點摘要
                    </div>
                    {currentCard.keyPoints.map((point, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0"></span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-slate-100">
                  {currentCard.mnemonic ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      記憶口訣：{currentCard.mnemonic}
                    </div>
                  ) : (
                    <div />
                  )}
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    點擊卡片翻面看詳解 ↻
                  </span>
                </div>
              </div>

              {/* Back Face (pre-rotated 180deg so it displays upright when container is rotated) */}
              <div className="absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-10 shadow-lg border bg-slate-900 text-white border-slate-800 backface-hidden rotate-y-180 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500 text-white">
                      深度解說與實務要領
                    </span>
                    <span className="text-xs text-slate-400">{currentCard.sourceSlide}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
                    {currentCard.title}
                  </h3>

                  <div className="p-5 rounded-2xl bg-white/10 text-slate-200 text-sm leading-relaxed mb-4 border border-white/10">
                    {currentCard.detailedContent}
                  </div>

                  {currentCard.mnemonic && (
                    <div className="p-4 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-200 text-xs">
                      <span className="font-bold text-white">💡 高分口訣必記：</span>{' '}
                      {currentCard.mnemonic}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-white/10 text-xs text-slate-400">
                  <span>再次點擊翻回正面</span>
                  <span className="text-orange-400">Chapter 4 衛教手冊</span>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      {/* Controls Bar */}
      {filteredCards.length > 0 && currentCard && (
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
              title="上一張"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleShuffle}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
              title="隨機抽卡"
            >
              <Shuffle className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
              title="下一張"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFlip}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              翻轉卡片
            </button>
            <button
              onClick={() => toggleMastered(currentCard.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                isCurrentMastered
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              {isCurrentMastered ? '已掌握' : '標記已掌握'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
