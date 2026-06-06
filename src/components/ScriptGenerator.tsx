import React, { useState } from "react";
import { Store, GeneratedScript, Scene } from "../types";
import { Sparkles, Copy, Calendar, Loader2, Check, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface ScriptGeneratorProps {
  activeStore: Store;
  onAddToPlanner: (title: string, concept: string, scriptMarkdown: string) => void;
}

const SAMPLE_KEYWORDS = [
  { text: "Khách chốt bill 2 triệu mua túi xách và giày đi quẩy", category: "both" },
  { text: "Bóc phốt shop bán rẻ: túi Quảng Châu chất da mềm xịn mà có 139k", category: "bags" },
  { text: "Thử thách dùng búa đập giày cao gót xem độ chắc chắn", category: "shoes" },
  { text: "POV: Đứa bạn thân mượn túi đi hẹn hò rồi tưởng giá tiền triệu", category: "bags" },
  { text: "Khui seal kiện giày thể thao Douyin hottrend mới về", category: "shoes" }
];

export default function ScriptGenerator({ activeStore, onAddToPlanner }: ScriptGeneratorProps) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<"bags" | "shoes" | "both">("both");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  const steps = [
    "🔍 Đang phân tích từ khóa và bối cảnh...",
    "⚡ Đang thiết lập Hook giữ chân 3s...",
    "🎬 Đang sắp xếp phân cảnh quay phù hợp...",
    "✍️ Đang chuyển hóa kịch bản sang ngôn ngữ Gen Z..."
  ];

  const handleGenerate = async (selectedKeyword?: string) => {
    const textToGenerate = selectedKeyword || keyword;
    if (!textToGenerate.trim()) return;

    setLoading(true);
    setScript(null);
    setAdded(false);
    
    // Simulate smart step progress
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const response = await fetch("/api/generate-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword: textToGenerate,
          shopName: activeStore.name,
          shopStyle: activeStore.style,
          category: category
        }),
      });

      if (!response.ok) throw new Error("Thất bại khi kết nối server!");
      
      const data = await response.json();
      setScript(data);
    } catch (error) {
      console.error("Generator error:", error);
      alert("Đã xảy ra lỗi khi tạo kịch bản. Vui lòng thử lại!");
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleCopy = () => {
    if (!script) return;
    
    let markdown = `# KỊCH BẢN: ${script.title}\n`;
    markdown += `**Concept:** ${script.concept}\n`;
    markdown += `**Hook 3s:** "${script.hook}"\n`;
    markdown += `**Lý do cuốn hút Gen Z:** ${script.targetAudience}\n\n`;
    markdown += `## PHÂN CẢNH CHI TIẾT\n`;
    
    script.scenes.forEach((s) => {
      markdown += `### Cảnh ${s.sceneNumber}\n`;
      markdown += `- **Hình ảnh (Visual):** ${s.visual}\n`;
      markdown += `- **Âm thanh (Audio):** ${s.audio}\n`;
      markdown += `- **Chữ hiện trên video (Text Overlay):** ${s.textOverlay}\n`;
      if (s.note) markdown += `- **Lưu ý:** ${s.note}\n`;
      markdown += `\n`;
    });
    
    markdown += `**Đoạn lồng tiếng:** ${script.voiceover}\n\n`;
    markdown += `**Khuyên dùng đạo cụ & âm nhạc:** ${script.recommendations}\n`;

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToSchedule = () => {
    if (!script) return;
    onAddToPlanner(script.title, script.concept, script.hook);
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="space-y-6" id="script-generator-root">
      {/* Input section */}
      <div className="bg-white rounded-[32px] border-2 border-orange-50 p-6 shadow-xl shadow-orange-100/20 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-400/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5 relative z-10">
          <div>
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
              <Sparkles className="w-5 h-5 text-orange-500 fill-orange-500 animate-pulse" />
              Lên Ý Tưởng Nhanh Cho Clip Mới
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
              Nhập một sự kiện thực tế tại shop hoặc từ khóa bất kỳ, AI sẽ viết kịch bản giật gân bám sát trend TikTok.
            </p>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-full shrink-0">
            Phục vụ shop: {activeStore.name}
          </span>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-3 mb-5 relative z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sản phẩm:</span>
          {(["both", "bags", "shoes"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                category === cat
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md shadow-orange-200/50"
                  : "bg-orange-50/50 text-slate-600 hover:bg-orange-50"
              }`}
            >
              {cat === "both" ? "Túi & Giày kết hợp" : cat === "bags" ? "Chuyên Túi xách" : "Chuyên Giày dép"}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="relative mb-5 z-10">
          <textarea
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Ví dụ: Hôm nay có khách mang theo người yêu bảnh trai, mua một chiếc túi Quảng Châu 149k rồi bảo giá rẻ thế..."
            className="w-full bg-slate-50/50 border border-slate-200 rounded-[20px] p-4 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-400 focus:border-orange-400 focus:bg-white transition-all resize-none h-28 leading-relaxed"
          />
          <div className="absolute right-3.5 bottom-3.5 text-[10px] font-mono font-bold text-slate-400 bg-white/80 px-2 py-0.5 rounded-md border border-slate-100">
            {keyword.length} ký tự
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-wrap gap-1.5 justify-start max-w-2xl">
            <span className="text-[10px] uppercase font-black text-slate-400 block w-full mb-1 tracking-wider">💡 Thử nhanh bối cảnh ví dụ:</span>
            {SAMPLE_KEYWORDS.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setKeyword(sample.text);
                  setCategory(sample.category as any);
                }}
                className="text-[11px] bg-orange-50/25 hover:bg-orange-50 hover:text-orange-600 text-slate-700 border border-orange-100/50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer font-medium"
              >
                {sample.text.length > 35 ? sample.text.slice(0, 35) + "..." : sample.text}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={loading || !keyword.trim()}
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:shadow-lg disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400 text-white font-bold text-xs px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang biên soạn...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Viết Kịch Bản Trend
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading overlay styled creatively */}
      {loading && (
        <div className="bg-white rounded-[32px] border-2 border-orange-50 p-10 shadow-xl shadow-orange-100/25 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
            <Sparkles className="w-6 h-6 text-orange-500 absolute animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">AI Đang Sản Xuất Nội Dung Cho {activeStore.creator}</h3>
            <p className="text-xs text-orange-600 font-mono font-bold animate-pulse">
              {steps[loadingStep]}
            </p>
          </div>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed font-semibold">
            AI đang tính toán tâm lý khách hàng 18-25 tuổi, ghép nối sản phẩm để kích thích kịch bản đạt tương tác triệu view.
          </p>
        </div>
      )}

      {/* Script output display */}
      {script && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border-2 border-orange-50 p-6 shadow-xl shadow-orange-100/10 space-y-6 relative overflow-hidden"
        >
          {/* Header metadata */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-orange-50">
            <div>
              <span className="text-[10px] font-black bg-orange-50 text-orange-600 border border-orange-250 px-3 py-1 rounded-full uppercase tracking-wider">
                📢 {script.concept}
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-2">
                {script.title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="bg-orange-50/50 hover:bg-orange-100 text-orange-700 p-2.5 px-4 rounded-full border border-orange-100/80 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Sao chép kịch bản dạng ghi chú"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
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
                {added ? <Check className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
                {added ? "Đã lên lịch nháp!" : "Đưa vào Lịch"}
              </button>
            </div>
          </div>

          {/* 3s retention hook alert block */}
          <div className="bg-orange-50/30 border border-orange-100 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-20 h-20 bg-orange-300/10 blur-xl rounded-full"></div>
            <h4 className="text-xs font-extrabold text-orange-850 uppercase tracking-widest flex items-center gap-1.5 relative z-10">
              🚀 HOOK 3 GIÂY ĐẦU (QUYẾT ĐỊNH GIỮ CHÂN KHÁCH)
            </h4>
            <p className="text-base font-black text-slate-800 mt-2.5 italic relative z-10">
              &ldquo;{script.hook}&rdquo;
            </p>
            <div className="text-xs text-slate-600 mt-2 flex items-center gap-1 relative z-10 font-medium">
              <span className="font-bold text-orange-600">Lý do hút khách Gen Z:</span> {script.targetAudience}
            </div>
          </div>

          {/* Scene list */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              🎬 Hướng dẫn quay phim phân cảnh chi tiết
            </h4>
            <div className="overflow-x-auto border border-orange-50/80 rounded-2xl shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-orange-50/40 text-orange-800 font-bold border-b border-orange-100">
                    <th className="p-3.5 w-14 text-center select-none font-sans uppercase text-[10px]">Cảnh</th>
                    <th className="p-3.5 w-1/3 font-sans uppercase text-[10px]">Hình ảnh quay gì (Visual)</th>
                    <th className="p-3.5 w-1/4 font-sans uppercase text-[10px]">Lời thoại/Âm thanh (Audio)</th>
                    <th className="p-3.5 font-sans uppercase text-[10px]">Chữ hiện trên clip (Overlay)</th>
                    <th className="p-3.5 w-1/5 font-sans uppercase text-[10px]">Lưu ý quay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {script.scenes.map((scene: Scene) => (
                    <tr key={scene.sceneNumber} className="hover:bg-orange-50/10 transition-colors">
                      <td className="p-3.5 text-center font-mono font-black text-orange-600 bg-orange-50/10 select-none">
                        #{scene.sceneNumber}
                      </td>
                      <td className="p-3.5 text-slate-800 font-bold leading-relaxed">
                        {scene.visual}
                      </td>
                      <td className="p-3.5 text-slate-600 leading-relaxed italic font-medium">
                        {scene.audio}
                      </td>
                      <td className="p-3.5">
                        {scene.textOverlay ? (
                          <span className="bg-orange-50 text-orange-700 font-extrabold px-2.5 py-1 rounded inline-block border border-orange-100 font-mono text-[10px]">
                            {scene.textOverlay}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic font-medium select-none">Không có</span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-500 italic text-[11px] leading-relaxed font-medium">
                        {scene.note || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Custom voiceover paragraph */}
          {script.voiceover && (
            <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center">
                <span className="w-1 h-3.5 bg-slate-400 mr-2 rounded-full inline-block"></span>
                🎤 Đoạn đọc lồng tiếng (Voiceover thu sẵn)
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed italic font-semibold">
                {script.voiceover}
              </p>
            </div>
          )}

          {/* Recommendations, Sound and music suggestions */}
          <div className="bg-pink-50/30 border border-pink-100 rounded-2xl p-5 space-y-1">
            <h4 className="text-xs font-black text-pink-700 uppercase tracking-widest flex items-center gap-1.5">
              🎵 Đạo cụ, Nhạc nền & Caption đề xuất
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed font-semibold">
              {script.recommendations}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
