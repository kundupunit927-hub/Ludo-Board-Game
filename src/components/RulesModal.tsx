import React, { useEffect } from 'react';
import { BookOpen, Dices, RotateCw, ShieldCheck, Sparkles, Swords, Trophy, X } from 'lucide-react';
import { sounds } from '../utils/audio';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="rules-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="rules-modal-content"
        className="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-2xl border border-slate-200 text-slate-800 max-h-[90vh] flex flex-col justify-between overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading leading-tight">
                Ludo Rules & Guidelines
              </h2>
              <p className="text-xs text-slate-500 font-medium">Khel Ke Niyam (Official Rules)</p>
            </div>
          </div>
          <button
            id="close-rules-btn"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sounds.playClick();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-500 hover:text-slate-800 transition-all flex items-center justify-center cursor-pointer border border-slate-200"
            aria-label="Close Rules"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - 6 Rules */}
        <div className="py-3 space-y-2 overflow-y-auto pr-1 flex-1 text-xs text-slate-600">
          {/* Rule 1 */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Dices className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 font-bold text-xs">1. Roll 6 to Exit Yard:</strong>
              <p className="mt-0.5 leading-relaxed text-slate-700">
                Goti ko ghar (yard) se bahar nikalne ke liye dice par <strong>6 aana zaroori</strong> hai.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200/60">
            <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <RotateCw className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 font-bold text-xs">2. Clockwise Track Movement:</strong>
              <p className="mt-0.5 leading-relaxed text-slate-700">
                Gotiyan pure board par 52 squares ka clockwise chakkar lagati hain.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 font-bold text-xs">3. Safe Cross (X) & Star Zones (🛡️):</strong>
              <p className="mt-0.5 leading-relaxed text-slate-700">
                Cross (✖) nishan wale squares aur starting points 100% <strong>Safe Zones</strong> hain! Cross (X) ke nishan par baithi goti ko koi bhi opponent cut ya capture nahi kar sakta!
              </p>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-rose-50/70 border border-rose-200/60">
            <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Swords className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 font-bold text-xs">4. Capture & Knockout:</strong>
              <p className="mt-0.5 leading-relaxed text-slate-700">
                Opponent ki goti wale cell par aane se opponent ki goti katkar yard me laut jati hai.
              </p>
            </div>
          </div>

          {/* Rule 5 */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/60">
            <div className="w-7 h-7 rounded-lg bg-purple-500 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 font-bold text-xs">5. Extra Bonus Turn:</strong>
              <p className="mt-0.5 leading-relaxed text-slate-700">
                Dice par <strong>6</strong> aane par ya kisi goti ko capture karne par ek <strong>extra roll</strong> milta hai.
              </p>
            </div>
          </div>

          {/* Rule 6 */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-300/70">
            <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-slate-900 font-bold text-xs">6. Victory & Winning:</strong>
              <p className="mt-0.5 leading-relaxed text-slate-700">
                Jo player apni chaaron gotiyan sabse pehle Home Triangle me pahuchata hai, wo jeet jata hai!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex-shrink-0">
          <button
            id="rules-ok-btn"
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Got it (Samajh Gaye)
          </button>
        </div>
      </div>
    </div>
  );
};
