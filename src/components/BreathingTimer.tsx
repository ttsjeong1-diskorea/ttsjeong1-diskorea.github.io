import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Activity, Clock, Compass, CornerDownRight, Play, Square, Volume2, VolumeX } from 'lucide-react';
import { BreathPattern } from '../types';

const BREATH_PATTERNS: BreathPattern[] = [
  {
    name: "초심자 이완 호흡",
    inhale: 4,
    hold: 0,
    exhale: 4,
    description: "처음 단전호흡을 접하는 분들을 위한 기본 리듬입니다. 깊고 편안한 들숨과 날숨에 집중합니다."
  },
  {
    name: "정체 조식 수련",
    inhale: 5,
    hold: 0,
    exhale: 5,
    description: "호흡 속도를 늦추며 긴장을 내려놓는 안정형 패턴입니다. 업무 전후의 리셋에 적합합니다."
  },
  {
    name: "국선도 주천 백하 호흡",
    inhale: 5,
    hold: 3,
    exhale: 5,
    description: "숙련자를 위한 유지 단계가 포함된 패턴입니다. 불편함이 있으면 즉시 쉬어 주세요."
  }
];

export default function BreathingTimer() {
  const [selectedPatternIndex, setSelectedPatternIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [step, setStep] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timeLeft, setTimeLeft] = useState(BREATH_PATTERNS[0].inhale);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [totalCycles, setTotalCycles] = useState(0);

  const pattern = BREATH_PATTERNS[selectedPatternIndex];
  const audioContextRef = useRef<AudioContext | null>(null);

  const playChime = (type: "start" | "transition" | "stop") => {
    if (!isSoundOn) return;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (type === "start") {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === "transition") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(step === "inhale" ? 523.25 : 392.0, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.frequency.setValueAtTime(329.63, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (error) {
      console.warn("AudioContext failed to trigger sound:", error);
    }
  };

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;

    if (isActive) {
      if (timeLeft > 0) {
        timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      } else if (step === "inhale") {
        setStep(pattern.hold > 0 ? "hold" : "exhale");
        setTimeLeft(pattern.hold > 0 ? pattern.hold : pattern.exhale);
        playChime("transition");
      } else if (step === "hold") {
        setStep("exhale");
        setTimeLeft(pattern.exhale);
        playChime("transition");
      } else {
        setStep("inhale");
        setTimeLeft(pattern.inhale);
        setTotalCycles((prev) => prev + 1);
        playChime("transition");
      }
    } else {
      setStep("inhale");
      setTimeLeft(pattern.inhale);
    }

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isActive, timeLeft, step, pattern]);

  const toggleTimer = () => {
    if (isActive) {
      setIsActive(false);
      playChime("stop");
    } else {
      setIsActive(true);
      setStep("inhale");
      setTimeLeft(pattern.inhale);
      setTotalCycles(0);
      playChime("start");
    }
  };

  const handlePatternChange = (index: number) => {
    setIsActive(false);
    setSelectedPatternIndex(index);
    setStep("inhale");
    setTimeLeft(BREATH_PATTERNS[index].inhale);
  };

  const stepLabel = step === "inhale" ? "들이쉬기" : step === "hold" ? "머무르기" : "내쉬기";
  const cycleLength = pattern.inhale + pattern.hold + pattern.exhale;

  return (
    <div id="breathing-lab-section" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-brand-700 font-medium mb-1">
            <Compass className="w-5 h-5 animate-spin-slow text-brand-600" />
            <span className="text-xs uppercase tracking-wider font-semibold">Somatic Breath Science</span>
          </div>
          <h3 className="text-2xl font-serif text-gray-900 font-semibold tracking-tight">
            단전호흡 실시간 수련 가이드
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            부드러운 리듬과 시각적 안내로 호흡을 안정시키는 인터랙티브 수련 도구입니다.
          </p>
        </div>

        <button
          id="toggle-chime-sound"
          onClick={() => setIsSoundOn(!isSoundOn)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            isSoundOn
              ? 'bg-brand-50 text-brand-700 hover:bg-brand-100'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
          title="안내음을 켜거나 끕니다"
        >
          {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{isSoundOn ? 'Chime ON' : 'Chime Muted'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs text-gray-400 font-mono tracking-wider block uppercase">Select Breathing Ritual</span>
          {BREATH_PATTERNS.map((p, idx) => (
            <button
              id={`pattern-button-${idx}`}
              key={p.name}
              onClick={() => handlePatternChange(idx)}
              disabled={isActive}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                selectedPatternIndex === idx
                  ? 'border-brand-600 bg-brand-50/50 shadow-xs'
                  : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50'
              } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex justify-between items-start gap-3 mb-1">
                <span className={`font-semibold text-sm ${selectedPatternIndex === idx ? 'text-brand-800' : 'text-gray-800'}`}>
                  {p.name}
                </span>
                <span className="text-xs bg-white text-gray-500 px-2.5 py-0.5 rounded-full border border-gray-100 font-mono shrink-0">
                  {p.inhale}s - {p.hold > 0 ? `${p.hold}s - ` : ''}{p.exhale}s
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{p.description}</p>
            </button>
          ))}

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4">
            <h4 className="text-xs font-semibold text-gray-800 mb-1 flex items-center gap-1">
              <CornerDownRight className="w-3.5 h-3.5 text-brand-700" />
              단전호흡 준비 기본 정렬
            </h4>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              의자에 편안히 앉아 허리를 세우고 어깨 힘을 내려놓습니다. 아랫배가 자연스럽게 움직이도록 억지로 힘을 주지 말고 천천히 따라오세요.
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-gray-50/70 py-10 px-6 rounded-2xl border border-gray-100 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div className="w-full h-full bg-[radial-gradient(#16a34a_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          <div className="relative flex justify-center items-center w-64 h-64 mb-6">
            <AnimatePresence>
              {isActive && (
                <>
                  <motion.div
                    className={`absolute inset-0 rounded-full border-1 opacity-10 ${
                      step === "inhale"
                        ? 'border-brand-600 bg-brand-100/30'
                        : step === "hold"
                          ? 'border-amber-400 bg-amber-50/20'
                          : 'border-blue-500 bg-blue-50/20'
                    }`}
                    animate={{
                      scale: step === "inhale" ? [1, 1.4, 1] : step === "hold" ? 1.3 : [1.3, 1, 1.3],
                      opacity: step === "inhale" ? [0.4, 0.1, 0.4] : 0.25,
                    }}
                    transition={{
                      duration: step === "inhale" ? pattern.inhale : step === "hold" ? pattern.hold : pattern.exhale,
                      ease: "easeInOut",
                      repeat: Infinity
                    }}
                  />
                  <motion.div
                    className={`absolute rounded-full w-48 h-48 border border-dashed opacity-25 ${
                      step === "inhale" ? 'border-brand-600' : step === "hold" ? 'border-amber-500' : 'border-blue-500'
                    }`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                </>
              )}
            </AnimatePresence>

            <motion.div
              id="breathing-core-circle"
              className={`flex flex-col items-center justify-center rounded-full shadow-lg z-10 select-none ${
                step === "inhale"
                  ? 'bg-gradient-to-br from-brand-600 to-green-700 text-white'
                  : step === "hold"
                    ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white'
                    : 'bg-gradient-to-br from-indigo-700 to-indigo-800 text-white'
              }`}
              animate={{
                scale: isActive
                  ? step === "inhale"
                    ? [1, 1.25]
                    : step === "hold"
                      ? 1.25
                      : [1.25, 1]
                  : 1,
              }}
              transition={{
                duration: isActive
                  ? step === "inhale"
                    ? pattern.inhale
                    : step === "hold"
                      ? pattern.hold
                      : pattern.exhale
                  : 1,
                ease: "easeInOut"
              }}
              style={{ width: "160px", height: "160px" }}
            >
              <div className="text-center">
                <span className="text-xs uppercase tracking-widest font-mono opacity-80 block">
                  {isActive ? stepLabel : "대기"}
                </span>
                <span className="text-3xl font-bold font-mono my-0.5 block">
                  {isActive ? timeLeft : pattern.inhale}
                </span>
                <span className="text-[10px] opacity-75 block font-mono">seconds</span>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-4 z-20">
            <button
              id="start-breath-button"
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                isActive
                  ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                  : 'bg-gradient-to-r from-brand-700 to-brand-800 text-white shadow-md shadow-brand-100 hover:shadow-lg'
              }`}
            >
              {isActive ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>수련 일시정지</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current animate-pulse" />
                  <span>가이드 시작</span>
                </>
              )}
            </button>
          </div>

          <div className="flex gap-8 mt-6 border-t border-gray-200/60 pt-4 w-full justify-center max-w-sm">
            <div className="text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-mono">Completed Loops</span>
              <span className="text-lg font-bold text-gray-800 font-mono flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-brand-600" />
                {totalCycles}회
              </span>
            </div>
            <div className="text-center">
              <span className="text-[10px] text-gray-400 block uppercase font-mono">Current Pace</span>
              <span className="text-lg font-bold text-gray-800 font-mono flex items-center justify-center gap-1">
                <Activity className="w-4 h-4 text-brand-600" />
                60s / {Math.round(60 / cycleLength)}회
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
