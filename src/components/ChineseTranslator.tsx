import React, { useState } from "react";
import { Store, ChineseAnalysisResult, Scene } from "../types";
import { Languages, HelpCircle, Loader2, Copy, Check, ArrowRight, Share2, Calendar } from "lucide-react";
import { motion } from "motion/react";

interface ChineseTranslatorProps {
  activeStore: Store;
  onAddToPlanner: (title: string, concept: string, scriptMarkdown: string) => void;
}

const SAMPLE_CHINESE_DRAFT = `闺蜜买了一个很好看的帆布包包，在朋友圈晒图炫耀。
我看到后觉得很好看，就问她链接。
闺蜜说这个包要300块，然后故意说：“哎呀你平时不都买几十块的包吗，这个太贵了不适合你吧”。
结果转头我就在直播间/网店里买到了一个一模一样的广州直发包，只需要59元，做工质量甚至更好！
等我们下次见面，闺蜜拎着她300的包，我拿着59元的。
我当场拆穿这个秘密，她气得直咬牙，周围人都来看我的物超所值。`;

export default function ChineseTranslator({ activeStore, onAddToPlanner }: ChineseTranslatorProps) {
  const [chineseContent, setChineseContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ChineseAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  const handleTranslate = async () => {
    if (!chineseContent.trim()) return;

    setLoading(true);
    setAnalysisResult(null);
    setAdded(false);

    try {
      const response = await fetch("/api/analyze-chinese-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawChineseContent: chineseContent,
          shopName: activeStore.name,
          storeStyle: activeStore.style,
        }),
      });

      if (!response.ok) throw new Error("Thất bại khi dịch xu hướng!");
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error("Translation error:", error);
      alert("Đã có lỗi phân tích từ AI. Vui lòng nhập chi tiết bối cảnh clip Trung và thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!analysisResult) return;

    let markdown = `# VIỆT HÓA KỊCH BẢN TRUNG QUỐC: ${analysisResult.vietnameseTitle}\n`;
    markdown += `**Concept:** ${analysisResult.localizedConcept}\n`;
    markdown += `**Tóm tắt bản gốc:** ${analysisResult.originalSummary}\n`;
    markdown += `**Điều chỉnh văn hóa Việt:** ${analysisResult.culturalAdjustments}\n\n`;
    markdown += `## PHÂN CẢNH CHI TIẾT TẠI SHOP\n`;

    analysisResult.scenes.forEach((s) => {
      markdown += `### Cảnh ${s.sceneNumber}\n`;
      markdown += `- **Visual (Quay bối cảnh):** ${s.visual}\n`;
      markdown += `- **Audio (Thoại tiếng Việt):** ${s.audio}\n`;
      markdown += `- **Chữ chạy trên video:** ${s.textOverlay}\n`;
      if (s.note) markdown += `- **Lưu ý:** ${s.note}\n`;
      markdown += `\n`;
    });

    markdown += `**Caption gợi ý:** ${analysisResult.suggestedCaption}\n`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToSchedule = () => {
    if (!analysisResult) return;
    onAddToPlanner(analysisResult.vietnameseTitle, analysisResult.localizedConcept, analysisResult.vietnameseTitle);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="space-y-6" id="chinese-translator-root">
      {/* Input layout card */}
      <div className="bg-white rounded-[32px] border-2 border-orange-50 p-6 shadow-xl shadow-orange-100/20 relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-orange-400/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4 relative z-10">
          <div>
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
              <Languages className="w-5 h-5 text-orange-500" />
              Việt Hóa & Phân Tích Clip Douyin
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              Dán nội dung, kịch bản dịch thô, hoặc mô tả một clip Trung Quốc đang hot. AI sẽ tự động phân tích cấu trúc, dịch nghĩa, bản địa hóa sang tiếng Việt và điều chỉnh phù hợp với mẫu mã dưới 200k tại shop.
            </p>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative mb-4 z-10">
          <textarea
            value={chineseContent}
            onChange={(e) => setChineseContent(e.target.value)}
            placeholder="Dán kịch bản dịch thô bằng tiếng Việt/Trung Quốc, hoặc gõ mô tả clip Douyin bạn vừa xem được từ Trung Quốc..."
            className="w-full bg-slate-50/50 border border-slate-200 rounded-[20px] p-4 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all resize-none h-40 leading-relaxed"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <button
            onClick={() => setChineseContent(SAMPLE_CHINESE_DRAFT)}
            className="text-[11px] text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1.5 cursor-pointer bg-orange-50/50 hover:bg-orange-50 px-3.5 py-2.5 rounded-full border border-orange-100"
          >
            📋 Thử kịch bản mẫu túi xách (Douyin hot)
          </button>

          <button
            onClick={handleTranslate}
            disabled={loading || !chineseContent.trim()}
            className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:shadow-lg disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 text-white font-bold text-xs px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang bản địa hóa kịch bản...
              </>
            ) : (
              <>
                <Languages className="w-4 h-4" />
                Dịch & Việt Hóa Nhận Concept
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading state rendering */}
      {loading && (
        <div className="bg-white rounded-[32px] border-2 border-orange-50 p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl shadow-orange-100/20">
          <div className="p-3.5 bg-orange-50 text-orange-500 rounded-full animate-bounce">
            <Languages className="w-8 h-8 text-orange-500 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Đang nghiên cứu phong cách Douyin...</h3>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-semibold">
              AI biên kịch đang chuyển bối cảnh Trung Quốc thành bối cảnh thực tại kệ giày/túi xách Việt Nam, lồng từ lóng Gen Z thông minh và cài cắm ưu điểm túi/giày Quảng Châu hottrend dưới 200k.
            </p>
          </div>
        </div>
      )}

      {/* Optimized Output Card */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border-2 border-orange-50 p-6 shadow-xl shadow-orange-100/10 space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-orange-50">
            <div>
              <span className="text-[10px] font-black bg-orange-50 text-orange-600 border border-orange-200 px-3 py-1.5 rounded-full uppercase tracking-wider">
                ⚡ ĐÃ BẢN ĐỊA HÓA CHO SHOP {activeStore.name.toUpperCase()}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                🎬 {analysisResult.vietnameseTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="bg-orange-50/50 hover:bg-orange-100 text-orange-700 p-2.5 px-4 rounded-full border border-orange-100/80 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Đã sao chép!" : "Copy kịch bản"}
              </button>

              <button
                onClick={handleAddToSchedule}
                className={`p-2.5 px-4 rounded-full border flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  added 
                    ? "bg-green-50 border-green-200 text-green-700" 
                    : "bg-gradient-to-r from-orange-500 to-pink-500 border-none text-white hover:shadow-md"
                }`}
              >
                {added ? <Check className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                {added ? "Đã lưu nháp!" : "Lưu vào Lịch"}
              </button>
            </div>
          </div>

          {/* Localization reasoning block */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50/10 border border-orange-100/60 rounded-2xl p-4.5">
              <h4 className="text-[10px] font-black text-slate-500 tracking-wider uppercase">🇨🇳 TÓM TẮT BẢN TRUNG GỐC</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-2.5 italic font-medium">
                {analysisResult.originalSummary}
              </p>
            </div>

            <div className="bg-emerald-50/25 border border-emerald-100 rounded-2xl p-4.5">
              <h4 className="text-[10px] font-black text-emerald-800 tracking-wider uppercase">🌟 THAY ĐỔI ĐỂ PHÙ HỢP THỊ TRƯỜNG VIỆT</h4>
              <p className="text-xs text-slate-700 leading-relaxed mt-2.5 font-semibold text-emerald-950">
                {analysisResult.culturalAdjustments}
              </p>
            </div>
          </div>

          <div className="bg-orange-50/25 border border-orange-100 rounded-2xl p-4.5">
            <span className="text-[10px] uppercase font-black text-orange-700 tracking-wider">Concept Tổng Thể:</span>
            <p className="text-sm font-black text-slate-800 mt-1">{analysisResult.localizedConcept}</p>
          </div>

          {/* Display scenes */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest">🎬 Chi tiết phân cảnh quay dựng Việt hóa</h4>
            <div className="overflow-x-auto border border-orange-50/80 rounded-2xl shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-orange-50/40 text-orange-850 font-bold border-b border-orange-100">
                    <th className="p-3.5 w-14 text-center select-none font-sans uppercase text-[10px]">Cảnh</th>
                    <th className="p-3.5 w-2/5 font-sans uppercase text-[10px]">Hướng dẫn quay gì (Visual)</th>
                    <th className="p-3.5 w-1/3 font-sans uppercase text-[10px]">Lời thoại tiếng Việt lầy lội (Audio)</th>
                    <th className="p-3.5 font-mono text-center uppercase text-[10px]">Text Overlay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {analysisResult.scenes.map((scene: Scene) => (
                    <tr key={scene.sceneNumber} className="hover:bg-orange-50/10 transition-colors">
                      <td className="p-3.5 text-center font-mono font-black text-orange-600 bg-orange-50/10 select-none">
                        {scene.sceneNumber}
                      </td>
                      <td className="p-3.5 text-slate-800 font-bold leading-relaxed">
                        {scene.visual}
                        {scene.note && (
                          <div className="text-[10px] text-orange-600 mt-1.5 font-bold flex items-center">
                            ⚠️ Ý đồ: {scene.note}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600 font-medium italic leading-relaxed">
                        {scene.audio}
                      </td>
                      <td className="p-3.5 text-center">
                        {scene.textOverlay ? (
                          <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded inline-block font-black font-mono text-[10px] border border-orange-100">
                            {scene.textOverlay}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic font-medium select-none">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Social Caption */}
          <div className="bg-slate-900 text-white rounded-[24px] p-5 shadow-inner">
            <h4 className="text-[10px] font-black text-orange-400 tracking-widest uppercase mb-2 flex items-center">
              📝 CAPTION GỢI Ý ĐĂNG TIKTOK / REELS
            </h4>
            <div className="text-xs leading-relaxed font-semibold text-slate-200 bg-slate-850 p-4 rounded-xl border border-slate-800 font-sans whitespace-pre-wrap select-all">
              {analysisResult.suggestedCaption}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
