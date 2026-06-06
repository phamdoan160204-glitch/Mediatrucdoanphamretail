import React, { useState, useEffect } from "react";
import { Store, DailyIdea } from "../types";
import { Coffee, RefreshCw, Zap, TrendingUp, Calendar, FileText, Loader2, Play } from "lucide-react";
import { motion } from "motion/react";

interface DailyIdeasProps {
  activeStore: Store;
  onSelectIdea: (promptText: string, category: "bags" | "shoes" | "both") => void;
}

// Solid curated ideas so there is instantaneous top-tier content on first reload!
const CURATED_DEFAULT_IDEAS: Record<number, DailyIdea[]> = {
  1: [
    {
      id: "1",
      title: "Review túi xách kẹp nách ulzzang 129k dẫm nước không phai",
      conceptType: "Thử Thách",
      shortDescription: "Tạt thẳng nước ngọt lên chiếc túi kẹp nách Quảng Châu bóng bẩy xem có dễ lau chùi và giữ phom không. Khẳng định chất lượng đỉnh chóp vượt tầm giá học sinh.",
      estimatedDuration: "20s - 30s",
      difficulty: "Dễ",
      promptSuggestion: "Làm kịch bản thử thách tạt nước ngọt dơ lên túi xách kẹp nách ulzzang 129k, lau đi siêu nhanh không hôi mốc, làm nổi bật phom đẹp giá học sinh"
    },
    {
      id: "2",
      title: "Khi mẹ xem bảng giá hóa đơn túi xách Quảng Châu lấp lánh",
      conceptType: "POV Hài Hước",
      shortDescription: "POV mẹ phát hiện con gái sắm 3 chiếc túi mới tinh tưởng tiêu hết tiền triệu bèn dọa đánh. Con gái quăng ra bill tổng cộng chỉ 350k khiến mẹ ngỡ ngàng đòi mua ké.",
      estimatedDuration: "35s - 45s",
      difficulty: "Trung bình",
      promptSuggestion: "Viết kịch bản ngắn hài hước POV con gái mua 3 túi xu hướng Quảng Châu giá học sinh bị mẹ mắng lãng phí, tới lúc biết bill 3 chiếc chưa tới 350k mẹ đòi sắm cùng"
    },
    {
      id: "3",
      title: "Khui kiện túi phao bánh mì béo mềm xả kho 99k",
      conceptType: "Unboxing",
      shortDescription: "Cận cảnh chất túi phao bánh mì mịn mềm, nhét vừa cả thế giới (son, ví, điện thoại, ipad). Quảng cáo mức giá rẻ sập sàn tri ân fan cứng.",
      estimatedDuration: "15s - 25s",
      difficulty: "Dễ",
      promptSuggestion: "Tạo kịch bản khui kiện túi xách phao bánh mì bám trend Douyin, nhét siêu nhiều đồ cá nhân, giới thiệu giá xả kho sập sàn 99k cực keo lỳ"
    }
  ],
  2: [
    {
      id: "1",
      title: "So sánh giày vải 150k của shop với giày hiệu triệuđộ",
      conceptType: "So sánh thực tế",
      shortDescription: "Đặt mẫu giày thể thao vải học sinh 150k cạnh một đôi giày đắt tiền, chạy nhảy uốn dẻo gập mũi cho thấy độ êm ái đàn hồi ngang ngửa, đáng sắm cho mùa hè.",
      estimatedDuration: "30s - 40s",
      difficulty: "Trung bình",
      promptSuggestion: "Lên kịch bản so sánh thực tế giày sneaker vải Quảng Châu 150k ôm dáng với giày đắt tiền, khoe độ dẻo dai êm ái khi chạy bộ"
    },
    {
      id: "2",
      title: "Vừa đi học vừa đi quẩy với 1 đôi slipon 169k",
      conceptType: "Outfit Check",
      shortDescription: "Biến hình 2 phong cách: Set 1 thanh lịch áo thun quần jeans đi học, set 2 đầm đen ôm sát cá tính quẩy tối, cả hai bối cảnh đều cân đẹp bằng đôi slipon da lì.",
      estimatedDuration: "25s - 35s",
      difficulty: "Dễ",
      promptSuggestion: "Viết kịch bản clip biến hình mix&match đôi slipon da lì hottrend 169k đi học thanh lịch và đi quẩy chất lừ cho nữ sinh viên từ 18 đến 22 tuổi"
    },
    {
      id: "3",
      title: "Khi nhân vật phản diện mua giày thể thao đế độn của shop",
      conceptType: "Drama POV",
      shortDescription: "POV cô bạn thân trà xanh thích bôi nhọ shop bán giày lởm, nhưng âm thầm đặt mua lén 2 đôi đạp gót đế cao 5cm để hack dáng chụp ảnh dìm người khác.",
      estimatedDuration: "40s - 50s",
      difficulty: "Khó",
      promptSuggestion: "Kịch bản drama tiktok ngắn bạn thân trà xanh dè bỉu giày rẻ dưới 200k nhưng lén đặt mua giày thể thao đế độn 5cm của shop để hack dáng chụp hình"
    }
  ],
  3: [
    {
      id: "1",
      title: "Con gái bánh bèo đi hẹn hò sắm combo túi nơ kẹp nách",
      conceptType: "Review",
      shortDescription: "Cận cảnh mẫu túi nơ lụa satin lấp lánh tiểu thư sang chảnh giá chỉ 145k. Phù hợp cho các bạn nữ mặc đầm điệu đà thu hút ánh nhìn đầu tiên.",
      estimatedDuration: "20s - 25s",
      difficulty: "Dễ",
      promptSuggestion: "Tạo kịch bản review mẫu túi nơ lụa tiểu thư 145k xách đi hẹn hò, quay cận kề dây đá, phong cách ngọt ngào bánh bèo"
    },
    {
      id: "2",
      title: "Quên túi khi thanh toán, người yêu cũ xuất hiện thanh toán hộ",
      conceptType: "Drama Tình Cảm",
      shortDescription: "Drama ngắn kịch tính: Bạn nữ đi mua giày búp bê nơ xinh xắn, lúc thanh toán bill thẹn thùng vì quên thẻ điện thoại. Người yêu cũ xuất hiện cười nhạt quẹt thẻ ga lăng.",
      estimatedDuration: "45s - 60s",
      difficulty: "Khó",
      promptSuggestion: "Kịch bản drama TikTok mua mẫu giày búp bê nơ quên mang tiền được người yêu cũ ga-lăng mua tặng, bối cảnh sang xịn mịn tại quầy thu ngân"
    },
    {
      id: "3",
      title: "Biến hóa 3 outfit kute hột me sắm giày búp bê tiểu thư",
      conceptType: "Biến hình",
      shortDescription: "Thay đổi 3 mẫu giày búp bê da bóng, gót vuông có quai bèo siêu ôm chân chân thon, đi kèm với 3 đầm bèo nhún cho nàng thơ 18 tuổi.",
      estimatedDuration: "25s - 35s",
      difficulty: "Trung bình",
      promptSuggestion: "Viết kịch bản biến hình thay đổi nhanh 3 kiểu giày búp bê đính đá và nơ cho nữ sinh viên điệu đà, nhạc ngọt ngào"
    }
  ]
};

export default function DailyIdeas({ activeStore, onSelectIdea }: DailyIdeasProps) {
  const [ideas, setIdeas] = useState<DailyIdea[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize with curated defaults based on store ID, fallback to general if empty
  useEffect(() => {
    const storeIdNormalized = (activeStore.id % 3) + 1; // map to 1, 2, or 3
    setIdeas(CURATED_DEFAULT_IDEAS[storeIdNormalized] || CURATED_DEFAULT_IDEAS[1]);
  }, [activeStore]);

  const handleFetchFreshIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate-daily-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: activeStore.name,
          storeStyle: activeStore.style,
          storeCategory: activeStore.category,
        }),
      });

      if (!response.ok) throw new Error("Yêu cầu thất bại!");
      const data = await response.json();
      if (data && data.ideas) {
        setIdeas(data.ideas);
      }
    } catch (error) {
      console.error("Failed to generate fresh ideas:", error);
      alert("Hệ thống bận một chút, đã tải lại gợi ý tuyển chọn chất lượng cao!");
      const storeIdNormalized = (activeStore.id % 3) + 1;
      setIdeas(CURATED_DEFAULT_IDEAS[storeIdNormalized] || CURATED_DEFAULT_IDEAS[1]);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "Dễ":
        return "bg-green-50 text-green-700 border-green-200";
      case "Trung bình":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Khó":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6" id="daily-ideas-root">
      {/* Introduction block */}
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 text-white rounded-[32px] p-6.5 shadow-xl shadow-orange-100/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-15 pointer-events-none">
          <TrendingUp className="w-48 h-48" />
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 animate-fade-in">
            <span className="bg-white/20 select-none text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
              🎯Ý TƯỞNG TRÁNH BÍ CONTENT HẰNG NGÀY
            </span>
            <h2 className="text-xl font-black font-sans uppercase tracking-tight flex items-center gap-2">
              Bảng Đề Xuất Content Hôm Nay ({activeStore.name})
            </h2>
            <p className="text-xs text-orange-50/90 font-medium">
              Cập nhật liên tục xu hướng từ Douyin & mẫu kịch bản hút khách cho Media: <span className="font-bold text-white underline decoration-pink-300">{activeStore.creator}</span>
            </p>
          </div>

          <button
            onClick={handleFetchFreshIdeas}
            disabled={loading}
            className="bg-white hover:bg-orange-50 disabled:bg-orange-100 disabled:text-orange-400 text-slate-900 font-bold text-xs px-5 py-3 rounded-full flex items-center justify-center gap-2 transition-all cursor-pointer self-start sm:self-center shadow-lg hover:shadow-xl active:scale-95"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
            )}
            {loading ? "Đang lên ý tưởng mới..." : "Làm Mới Gợi Ý"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-[32px] border-2 border-orange-50 p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xl shadow-orange-100/20">
          <div className="p-4 bg-orange-50 text-orange-500 rounded-full animate-bounce">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <h3 className="font-extrabold text-slate-800 text-sm">Đang nghiên cứu tệp khách Gen Z...</h3>
          <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
            Hệ thống AI đang quét các mẫu kịch bản Douyin & các sự kiện hot trend cho túi xách và giày dép dưới 200k của shop.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ideas.map((idea, index) => (
            <motion.div
              key={idea.id || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-white rounded-[24px] border-2 border-orange-50/80 p-5 flex flex-col justify-between hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/10 transition-all relative overflow-hidden group shadow-sm bg-radial"
            >
              {/* Card vibrant color strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 to-pink-500" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold bg-orange-50 border border-orange-100 text-orange-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    ⚡ {idea.conceptType}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span className="font-bold text-slate-500 font-mono">{idea.estimatedDuration}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getDifficultyColor(idea.difficulty)}`}>
                      {idea.difficulty}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-850 group-hover:text-orange-500 transition-colors leading-snug tracking-tight">
                    {idea.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2.5 line-clamp-3">
                    {idea.shortDescription}
                  </p>
                </div>
              </div>

              {/* Action triggers */}
              <div className="pt-4 mt-4 border-t border-dashed border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono font-bold">
                  Phân loại: {activeStore.category === "bags" ? "Túi xách" : activeStore.category === "shoes" ? "Giày dép" : "Giày & Túi"}
                </span>

                <button
                  onClick={() => onSelectIdea(idea.promptSuggestion, activeStore.category)}
                  className="bg-orange-50 hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 hover:text-white text-orange-600 py-2 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Kịch Bản
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tip for media staff */}
      <div className="bg-orange-50/40 border border-orange-100 rounded-2xl p-4.5 flex gap-3.5 items-start">
        <div className="bg-orange-100 text-orange-600 p-2.5 rounded-xl mt-0.5 shadow-sm">
          <Zap className="w-4.5 h-4.5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-orange-850 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-3 bg-orange-500 rounded-full inline-block"></span>
            Mẹo truyền thông cho 5 bạn Media:
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            Các cửa hàng Quảng Châu sống bằng <strong className="text-slate-800">Visual lạ mắt + Giá bán thu hút</strong>. Do toàn bộ sản phẩm của chúng ta đều có giá cực mềm dưới 200k, hãy luôn yêu cầu nhân vật quay nhấn mạnh <strong className="text-orange-500">vẻ ngoài chất lượng gấp đôi giá trị thật</strong> và giật kèm bảng giá bill hiện rõ mười mươi để kích thích tò mò mua sắm nhé!
          </p>
        </div>
      </div>
    </div>
  );
}
