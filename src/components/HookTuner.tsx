import React, { useState } from "react";
import { Store, HookOptimizedResult } from "../types";
import { Trash2, AlertCircle, Loader2, Sparkles, Copy, Check, Info, Flame } from "lucide-react";
import { motion } from "motion/react";

interface HookTunerProps {
  activeStore: Store;
}

const SAMPLE_CRUDE_SCRIPT = `Chào các bạn, hôm nay shop mình có một lô giày cao gót Quảng Châu mới về.
Đôi giày này có hột xoàn sáng lấp lánh, đi rất êm và có quai nơ bèo quyến rũ lắm, đi làm hay đi tiệc cũng đẹp nữa.
Giá chỉ có 140k thôi, chất da lì rất tốt. Hãy ủng hộ và đặt mua nhé.`;

export default function HookTuner({ activeStore }: HookTunerProps) {
  const [draftScript, setDraftScript] = useState("");
  const [transformStyle, setTransformStyle] = useState("Kịch tính, giật gân, tò mò");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HookOptimizedResult | null>(null);
  const [copied, setCopied] = useState(false);

  const STYLES = [
    "Kịch tính, giật gân, tò mò",
    "POV drama, xéo xắt, hài hước",
    "Cảnh báo thật thà, bóc phốt ngược",
    "Biến hình ngầu lòi, cool ngầu",
    "Giàu sang sang chảnh, tổng tài tiểu thư"
  ];

  const handleTune = async () => {
    if (!draftScript.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/optimize-hook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftScript: draftScript,
          transformStyle: transformStyle,
          storeStyle: activeStore.style,
        }),
      });

      if (!response.ok) throw new Error("Chỉnh sửa thất bại!");
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Hook tuning error:", error);
      alert("Đã có lỗi từ AI chỉnh sửa. Vui lòng kiểm tra lại kịch bản nháp!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRefined = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.refinedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="hook-tuner-root">
      {/* Input panel block */}
      <div className="bg-white rounded-[32px] border-2 border-orange-50 p-6 shadow-xl shadow-orange-100/20 space-y-5 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-400/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="border-b border-orange-50 pb-4 relative z-10">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
            Tối Ưu Hook & Sửa Kịch Bản Nhạt
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Media viết kịch bản quá đều đều, giới thiệu lê thê? Hãy dán kịch bản nháp vào đây, AI sẽ bóc tách lỗi, đề xuất 3 dòng Hook kích cầu 3 giây đầu tiên và tối ưu lại kịch bản cho thu hút nhất.
          </p>
        </div>

        {/* Form and selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <div className="md:col-span-2 space-y-3">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Kịch bản nháp của các bạn:</label>
            <div className="relative">
              <textarea
                value={draftScript}
                onChange={(e) => setDraftScript(e.target.value)}
                placeholder="Dán kịch bản nháp rườm rà tại đây..."
                className="w-full bg-slate-50/50 border border-slate-200 rounded-[24px] p-4 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all resize-none h-44 leading-relaxed"
              />
              <button
                onClick={() => setDraftScript(SAMPLE_CRUDE_SCRIPT)}
                className="absolute right-3.5 top-3.5 text-[10px] bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full border border-orange-200 font-bold transition-all cursor-pointer"
              >
                Gợi ý mẫu tẻ nhạt 🥱
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Phong cách lột xác mong muốn:</label>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {STYLES.map((st) => (
                  <button
                    key={st}
                    onClick={() => setTransformStyle(st)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      transformStyle === st
                        ? "bg-orange-50 text-orange-700 border-orange-300 shadow-sm"
                        : "bg-slate-50/50 text-slate-600 hover:bg-slate-50 border-transparent"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleTune}
              disabled={loading || !draftScript.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:shadow-lg disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 text-white font-bold text-xs py-3.5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang mổ xẻ kịch bản...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Lột Xác Kịch Bản Nhạt
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading animation block */}
      {loading && (
        <div className="bg-white rounded-[32px] border-2 border-orange-50 p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl shadow-orange-100/20">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Đang đo lường tỉ lệ Scroll-Away (vụt lướt)...</h3>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-semibold">
            AI đang tính toán nhịp độ của kịch bản nháp, viết lại 3 dòng Hook giật gân, cắt bỏ bớt những câu thừa thãi để nội dung đạt nhịp độ nhanh nhất giữ chân Gen Z.
          </p>
        </div>
      )}

      {/* Structured Output Card */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border-2 border-orange-50 p-6 shadow-xl shadow-orange-100/10 space-y-6"
        >
          {/* Header assessment */}
          <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-5 flex gap-3.5 items-start">
            <div className="bg-rose-100 p-2.5 rounded-xl text-rose-700 mt-0.5 shrink-0 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black text-rose-800 uppercase tracking-widest">⚠️ TẠI SAO KỊCH BẢN GỐC TẺ NHẠT?</h4>
              <p className="text-xs text-slate-750 leading-relaxed font-semibold mt-1">
                {result.originalCritique}
              </p>
            </div>
          </div>

          {/* 3 optimized hooks proposal */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
              👑 Đề xuất 3 Hook lật ngược tình thế (Khách bấm xem tiếp tức thì!)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {result.optimizedHooks.map((h, i) => (
                <div key={i} className="bg-gradient-to-br from-orange-50/10 to-orange-50/30 border-2 border-orange-100/60 rounded-2xl p-4.5 space-y-3.5 flex flex-col justify-between shadow-xs">
                  <div>
                    <span className="text-[9px] font-black bg-orange-100 text-orange-850 px-2.5 py-1 rounded-full uppercase tracking-wider border border-orange-200">
                      HOOK {i + 1}: {h.type}
                    </span>
                    <p className="text-xs font-black text-slate-900 mt-3 leading-relaxed italic">
                      &ldquo;{h.hookText}&rdquo;
                    </p>
                  </div>

                  <div className="bg-white/80 p-3 rounded-xl border border-orange-100/60 text-[11px] text-slate-600 leading-relaxed font-semibold">
                    <span className="font-extrabold text-orange-600">Động tác đi kèm:</span> {h.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transition advice */}
          <div className="bg-orange-50/25 border border-orange-100 rounded-2xl p-4.5">
            <span className="text-[10px] font-black text-orange-700 uppercase tracking-wider block">🔄 BÍ QUYẾT CHUYỂN BẢN (CHUYỂN SANG GIỚI THIỆU SẢN PHẨM KHÔNG BỊ SẰN):</span>
            <p className="text-xs text-slate-750 leading-relaxed mt-1.5 font-semibold">
              {result.improvedTransitions}
            </p>
          </div>

          {/* Fully refined script block */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">✨ Kịch bản lột xác mượt mà và cuốn hút (Chọn và lưu bản này)</h4>
              <button
                onClick={handleCopyRefined}
                className="text-xs text-orange-600 hover:text-orange-700 font-extrabold flex items-center gap-1.5 cursor-pointer bg-orange-50/50 border border-orange-100 px-3 py-1.5 rounded-full"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Đã sao chép!" : "Copy kịch bản"}
              </button>
            </div>
            
            <div className="bg-slate-900 text-slate-100 rounded-[20px] p-5 font-sans text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-96 shadow-inner font-semibold">
              {result.refinedScript}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
