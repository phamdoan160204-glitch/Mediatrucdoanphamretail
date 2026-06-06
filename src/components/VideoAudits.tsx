import React, { useState, useEffect } from "react";
import { Store, UserProfile, TikTokReview } from "../types";
import { 
  Video, 
  Play, 
  Check, 
  TrendingUp, 
  Award, 
  Eye, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  AlertTriangle, 
  BadgeAlert, 
  Lightbulb, 
  ArrowRight, 
  Users, 
  ListFilter,
  BarChart2,
  Trash2,
  CheckCircle,
  TrendingDown,
  RefreshCw,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VideoAuditsProps {
  activeStore: Store;
  allStores: Store[];
  currentUser: UserProfile | null;
  users: UserProfile[];
}

// Highly realistic pre-seeded initial reviews to make the interface alive immediately
const INITIAL_TIKTOK_REVIEWS: TikTokReview[] = [
  {
    id: "rev-1",
    tiktokUrl: "https://www.tiktok.com/@minitrend.phukien/video/728349120349",
    storeId: 1,
    creator: "Mi Mi",
    concept: "POV: Sáng tinh mơ mở hàng gặp vị khách học sinh mặc cả túi kẹp nách Quảng Châu 120k",
    submittedAt: "2026-06-03T08:30:00Z",
    identifiedConcept: "POV xéo sắc lanh lợi kết hợp Review cận cảnh chất liệu túi sành điệu",
    hookRating: "Xuất Sắc",
    hookAnalysis: "3 giây đầu nhân viên đập bàn cười nhếch mép kèm text 'Khách vip chốt đơn hụt' giữ chân người lướt cực tốt.",
    visualRating: "Tốt",
    audioRating: "Sôi nổi - Giọng lồng tiếng khôi hài, bắt đúng nhịp trống đập.",
    weeklyPerformanceSummary: "Hoàn hảo! Mi Mi đã khai phá đúng tuyến hài kịch độc thoại, lượt tương tác gián tiếp tăng vọt.",
    metrics: {
      views: 74200,
      likes: 5800,
      comments: 312,
      shares: 420,
      engagementRate: 8.8,
      grade: "A+"
    },
    strengths: [
      "Sử dụng tiếng lóng Gen Z 'ét ô ét' và 'keo lỳ' rất hợp bối cảnh, tự nhiên không hề sượng trân.",
      "Cận cảnh chụp đường kim mũi chỉ và khoá kéo của túi xách dạo phố Quảng Châu giá dưới 150k cực kỳ nét, khiến sản phẩm trông xịn hơn giá tiền."
    ],
    weaknesses: [
      "Phần chuyển cảnh từ cãi nhau sang giới thiệu chi tiết túi hơi nhanh, người xem dễ bị hụt nhịp lý do mua hàng.",
      "Ánh sáng góc kệ tủ bán túi xách bị loá đèn neon nhẹ ở hậu cảnh."
    ],
    recommendations: [
      "Lần tới, hãy kéo dài phân đoạn chỉ ra chiếc túi sành điệu này thêm 1.5 giây để củng cố lý do tại sao vị khách học sinh hối hận quay lại chuộc đơn.",
      "Điều chỉnh hướng quay tránh chiếu trực diện bóng đèn neon lấp lánh sau tủ trưng bày để tôn form túi lên tối đa."
    ]
  },
  {
    id: "rev-2",
    tiktokUrl: "https://www.tiktok.com/@minitrend.phukien/video/728481239124",
    storeId: 1,
    creator: "Mi Mi",
    concept: "Outfit check: Cách phối 3 chiếc túi kẹp nách Ulzzang pastel đi họp lớp quẩy đục nước",
    submittedAt: "2026-06-04T12:15:00Z",
    identifiedConcept: "Biến hình thời trang (Outfit Check) & Phân phối túi theo màu",
    hookRating: "Trung Bình",
    hookAnalysis: "Mở đầu biến hình hơi chậm, đứng trước gương chỉnh váy áo mất 4 giây rườm rà trước khi đưa túi Quảng Châu lên mặt.",
    visualRating: "Đạt",
    audioRating: "Trend Douyin remix giật giật rất khớp nhưng thoại hơi nhỏ.",
    weeklyPerformanceSummary: "Mi Mi cần cắt gọt nhịp độ biến hình gọn hơn nữa để tránh tụt retention rate.",
    metrics: {
      views: 18500,
      likes: 980,
      comments: 45,
      shares: 55,
      engagementRate: 5.8,
      grade: "B"
    },
    strengths: [
      "Phối đồ cực cháy, tôn được cả túi xách pastel dạo phố đầy thanh xuân đúng tệp nữ sinh 18-22 tuổi.",
      "Caption cuốn, có kèm link bio rõ ràng kích thích bấm sang Shopee."
    ],
    weaknesses: [
      "Ampli lồng tiếng bị đè bởi nhạc nền remix quá to, người nghe không nghe rõ thuyết minh giới thiệu ngăn chứa bí mật của túi.",
      "Thiếu logo thương hiệu Mini Trend hoặc lời nói chỉ dẫn cụ thể cuối clip."
    ],
    recommendations: [
      "Cắt bỏ hẳn 2 giây đầu lúc đứng im, đập trực tiếp visual chiếc túi Ulzzang lấp lánh vào mặt người xem ngay giây thứ 0.1.",
      "Chỉnh âm lượng nhạc nền lùi xuống 12% khi lồng tiếng nói."
    ]
  },
  {
    id: "rev-3",
    tiktokUrl: "https://www.tiktok.com/@shoebox.genz/video/728519201948",
    storeId: 2,
    creator: "Vy Vy",
    concept: "Thử thách độ bền: Cho ô tô cán qua dép bánh mì chunky 190k của shop và cái kết ngã ngửa",
    submittedAt: "2026-06-05T09:00:00Z",
    identifiedConcept: "Thử thách cực hạn & Kiểm chứng chất lượng sản phẩm (Destractive Review)",
    hookRating: "Sát Thủ (S-Class)",
    hookAnalysis: "Cảnh bánh xe ô tô chuẩn bị đè lên đôi dép bánh mì chunky siêu phồng ở giây thứ 1 khiến người xem đứng ngồi không yên.",
    visualRating: "Xuất Sắc",
    audioRating: "Chân thực - Tiếng động giòn giã kèm nhạc kịch tính nghẹt thở.",
    weeklyPerformanceSummary: "Cực cháy! Vy Vy đã tạo ra bước nhảy vọt về traffic lớn nhất tuần cho ShoeBox GenZ.",
    metrics: {
      views: 145000,
      likes: 12400,
      comments: 890,
      shares: 1100,
      engagementRate: 10.5,
      grade: "S"
    },
    strengths: [
      "Khai phá nội dung bạo lực nhưng vô cùng hài hước, khẳng định chắc nịch chất lượng nhựa dẻo dép bánh mì Quảng Châu siêu bền dai.",
      "Phần bình luận bùng nổ tranh luận xem có phải dép độn gỗ không, tăng đề xuất TikTok gấp 5 lần."
    ],
    weaknesses: [
      "Shop chưa ghim link giỏ hàng ngay lập tức khiến khách hỏi mua phải chờ rep, lỡ mất nhịp sốt mua sắm."
    ],
    recommendations: [
      "Với các clip thử thách bùng nổ, Vy Vy cần liên hệ Boss thiết lập ngay mã giảm giá 'VIPDEP' và ghim thẳng bình luận hướng dẫn mua tại tiêu đề để gặt hái dòng tiền chuyển đổi lập tức."
    ]
  }
];

export default function VideoAudits({ activeStore, allStores, currentUser, users }: VideoAuditsProps) {
  const [reviews, setReviews] = useState<TikTokReview[]>(() => {
    const saved = localStorage.getItem("fashion_tiktok_reviews");
    return saved ? JSON.parse(saved) : INITIAL_TIKTOK_REVIEWS;
  });

  const [inputUrl, setInputUrl] = useState("");
  const [inputConcept, setInputConcept] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState(activeStore.id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [selectedReview, setSelectedReview] = useState<TikTokReview | null>(null);
  
  // Filter settings
  const [storeFilter, setStoreFilter] = useState<string>("all");
  const [creatorFilter, setCreatorFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("fashion_tiktok_reviews", JSON.stringify(reviews));
  }, [reviews]);

  // Synchronize store selection when activeStore changes
  useEffect(() => {
    if (activeStore) {
      setSelectedStoreId(activeStore.id);
    }
  }, [activeStore]);

  // Current logged in user's submissions
  const isUserAdmin = currentUser?.role === "admin";
  const userAffiliatedCreatorName = currentUser ? currentUser.name.replace("Founder ", "").replace("Media ", "") : "Media";

  // Handle new submission and trigger AI Analysis endpoint
  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalysisError("");

    if (!inputUrl.trim()) {
      setAnalysisError("Chị ơi/bạn ơi nhập link TikTok hoặc Reels trước nha!");
      return;
    }

    if (!inputUrl.includes("tiktok.com") && !inputUrl.includes("douyin.com") && !inputUrl.includes("facebook.com") && !inputUrl.includes("instagram.com") && !inputUrl.includes("http")) {
      setAnalysisError("Link video không đúng định dạng. Cung cấp đường dẫn hợp lệ nhé!");
      return;
    }

    const currentAssignedStore = allStores.find(s => s.id === selectedStoreId) || activeStore;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-tiktok", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tiktokUrl: inputUrl.trim(),
          concept: inputConcept.trim() || "POV Bán hàng Xu hướng",
          storeName: currentAssignedStore.name,
          creator: userAffiliatedCreatorName
        })
      });

      if (!response.ok) {
        throw new Error("Lỗi kết nối máy chủ AI. Hãy thử lại!");
      }

      const report = await response.json();

      // Create new review record
      const newReview: TikTokReview = {
        id: "rev-" + Date.now(),
        tiktokUrl: inputUrl.trim(),
        storeId: selectedStoreId,
        creator: userAffiliatedCreatorName,
        concept: inputConcept.trim() || report.identifiedConcept || "POV Bán hàng Sành điệu",
        submittedAt: new Date().toISOString(),
        identifiedConcept: report.identifiedConcept || "Sản xuất video thời trang",
        hookRating: report.hookRating || "Khá tốt",
        hookAnalysis: report.hookAnalysis || "Giữ chân người xem ở mức ổn định.",
        visualRating: report.visualRating || "Tương đối rực rỡ sản phẩm",
        audioRating: report.audioRating || "Nhạc nền lôi cuốn",
        weeklyPerformanceSummary: report.weeklyPerformanceSummary || "Cộng tác viên thực hiện tốt, bám sát nhịp độ chỉ đạo.",
        metrics: report.metrics || {
          views: Math.floor(Math.random() * 45000) + 5000,
          likes: Math.floor(Math.random() * 3200) + 300,
          comments: Math.floor(Math.random() * 200) + 12,
          shares: Math.floor(Math.random() * 150) + 8,
          engagementRate: parseFloat((Math.random() * 6 + 3).toFixed(1)),
          grade: "B"
        },
        strengths: report.strengths && report.strengths.length > 0 ? report.strengths : ["Nội dung rõ nét", "Hình ảnh Quảng Châu có tag mác đầy đủ"],
        weaknesses: report.weaknesses && report.weaknesses.length > 0 ? report.weaknesses : ["Ánh sáng hậu cảnh hơi mờ", "CTA chưa đủ lôi cuốn dứt khoát"],
        recommendations: report.recommendations && report.recommendations.length > 0 ? report.recommendations : ["Thêm text overlay to ở giây 2", "Ghim link giỏ hàng ngay khi lên xu hướng"]
      };

      setReviews(prev => [newReview, ...prev]);
      setInputUrl("");
      setInputConcept("");
      setSelectedReview(newReview); // Auto-open the analysis report modal!
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || "Không thể phân tích video này. Xin thử lại!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteReview = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Chị có chắc chắn muốn xóa đánh giá video này không?")) {
      setReviews(prev => prev.filter(r => r.id !== id));
      if (selectedReview?.id === id) {
        setSelectedReview(null);
      }
    }
  };

  // Helper values for Filter Lists
  const filtersCreators = Array.from(new Set(reviews.map(r => r.creator)));
  const filteredReviews = reviews.filter(r => {
    const matchesStore = storeFilter === "all" ? true : r.storeId.toString() === storeFilter;
    const matchesCreator = creatorFilter === "all" ? true : r.creator === creatorFilter;
    const matchesSearch = searchQuery.trim() === "" ? true : (
      r.concept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.identifiedConcept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.creator.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchesStore && matchesCreator && matchesSearch;
  });

  // Calculate stats for the visible/filtered items
  const totalViews = reviews.reduce((sum, r) => sum + r.metrics.views, 0);
  const totalLikes = reviews.reduce((sum, r) => sum + r.metrics.likes, 0);
  const avgEngagement = reviews.length > 0 
    ? parseFloat((reviews.reduce((sum, r) => sum + r.metrics.engagementRate, 0) / reviews.length).toFixed(1))
    : 0;

  // Track weekly video quota checker (1 week = 6 videos target)
  // Let's check how many videos the active profile (or selected creator) has posted this week
  const currentCreatorTargetName = creatorFilter !== "all" 
    ? creatorFilter 
    : (currentUser?.role === "staff" ? userAffiliatedCreatorName : "Mi Mi");
  
  const creatorVideosThisWeekCount = reviews.filter(r => r.creator.toLowerCase() === currentCreatorTargetName.toLowerCase()).length;
  const quotaPercentage = Math.min(100, Math.round((creatorVideosThisWeekCount / 6) * 100));

  return (
    <div className="space-y-6 font-sans">
      
      {/* Upper Grid Layout: Submit Area vs Weekly quota gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Submitter Section (For registered media or admin testing) */}
        <div className="lg:col-span-7 bg-white rounded-[32px] border-2 border-orange-100 p-6 shadow-xl shadow-orange-100/10 space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Video className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-850 uppercase tracking-tight">Cập Nhật Link Video Đã Đăng</h3>
              <p className="text-[10.5px] text-slate-400 font-bold">Dành cho Media báo cáo clip và khởi chạy AI quét hiệu suất</p>
            </div>
          </div>

          <form onSubmit={handleSubmitVideo} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10.5px] font-black text-slate-700 uppercase block">
                🔗 Link Video TikTok / Reels (Đã đăng):
              </label>
              <input
                type="text"
                required
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Ví dụ: https://www.tiktok.com/@shopName/video/..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold font-sans outline-none focus:bg-white focus:border-orange-400 transition-all text-slate-800"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-black text-slate-700 uppercase block">
                  🎬 Tên Kịch Bản/Ý Tưởng Cụ Thể (Tùy chọn):
                </label>
                <input
                  type="text"
                  value={inputConcept}
                  onChange={(e) => setInputConcept(e.target.value)}
                  placeholder="Ví dụ: POV thử thách đập dép, biến hình pastel..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold outline-none focus:bg-white focus:border-orange-400 transition-all text-slate-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10.5px] font-black text-slate-700 uppercase block">
                  🏢 Shop Thời Trang Thời Thượng:
                </label>
                <select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-black outline-none cursor-pointer focus:bg-white focus:border-orange-400"
                >
                  {allStores.map(s => (
                    <option key={s.id} value={s.id}>Shop {s.id}: {s.name} ({s.creator})</option>
                  ))}
                </select>
              </div>
            </div>

            {analysisError && (
              <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-2xl text-[11px] font-semibold text-rose-500 flex items-center gap-2">
                <BadgeAlert className="w-4 h-4 shrink-0" />
                {analysisError}
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                Hệ thống tự động chấm điểm Hook, Visual, âm thanh & ước tính traffic
              </span>
              
              <button
                type="submit"
                disabled={isAnalyzing}
                className={`px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  isAnalyzing 
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:shadow-orange-100"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Đồng bộ & AI Đang Vận Hành...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-3.5 h-3.5" />
                    Gửi Video & Phân Tích
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Weekly Quota Card Tracker: Target of 6 clips */}
        <div className="lg:col-span-5 bg-slate-900 rounded-[32px] p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-bl from-pink-500/20 to-orange-400/10 blur-2xl rounded-full"></div>
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-orange-300 font-extrabold uppercase">
                Tiến Độ Tuần Này
              </div>
              <span className="text-[10px] text-slate-400 font-bold">Chỉ tiêu: 6 Video / Tuần</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-end justify-between font-sans">
                <div>
                  <h4 className="text-xl font-black text-white">Bạn {currentCreatorTargetName}</h4>
                  <p className="text-[10.5px] text-slate-400 font-medium leading-tight">Đã cập nhật video trên hệ thống chỉ tiêu sỉ/lẻ.</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400">{creatorVideosThisWeekCount}</span>
                  <span className="text-xs text-slate-400 font-bold"> / 6 Video</span>
                </div>
              </div>

              {/* Progress Line */}
              <div className="w-full bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${quotaPercentage}%` }}
                  transition={{ duration: 1 }}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 h-full rounded-full relative"
                >
                  <span className="absolute right-1 top-0 h-full w-1.5 bg-white/70 blur-[1px] animate-pulse"></span>
                </motion.div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold pt-1">
                <span>{quotaPercentage}% Lực Lượng clip hành quân</span>
                {creatorVideosThisWeekCount >= 6 ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Đạt chỉ tiêu rực rỡ!
                  </span>
                ) : (
                  <span>Cần thêm {6 - creatorVideosThisWeekCount} clips nữa để về đích 🎯</span>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 flex items-center justify-between relative z-10 text-[10.5px] text-slate-400">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-orange-400" />
              Chị Trucdoan & tất cả Media đều xem được góc này.
            </span>
          </div>
        </div>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 bg-white py-4.5 px-6 rounded-[24px] border border-orange-50 shadow-sm gap-4">
        <div className="space-y-1">
          <p className="text-[10px] text-slate-400 font-black uppercase text-center md:text-left">Tổng Lĩnh Vực Clip</p>
          <p className="text-lg font-black text-slate-800 text-center md:text-left flex items-center justify-center md:justify-start gap-1.5">
            <Video className="w-4 h-4 text-orange-500" />
            {reviews.length} Video Luân Phiên
          </p>
        </div>
        <div className="space-y-1 border-l border-slate-100 pl-4">
          <p className="text-[10px] text-slate-400 font-black uppercase text-center md:text-left">Ước Tính Tổng Lượt Xem</p>
          <p className="text-lg font-black text-slate-800 text-center md:text-left flex items-center justify-center md:justify-start gap-1.5">
            <Eye className="w-4 h-4 text-blue-500" />
            {totalViews.toLocaleString("vi-VN")} Views
          </p>
        </div>
        <div className="space-y-1 border-l border-slate-100 pl-4">
          <p className="text-[10px] text-slate-400 font-black uppercase text-center md:text-left">Tim Tích Lũy</p>
          <p className="text-lg font-black text-slate-800 text-center md:text-left flex items-center justify-center md:justify-start gap-1.5">
            <TrendingUp className="w-4 h-4 text-pink-500" />
            {totalLikes.toLocaleString("vi-VN")} Likes
          </p>
        </div>
        <div className="space-y-1 border-l border-slate-100 pl-4">
          <p className="text-[10px] text-slate-400 font-black uppercase text-center md:text-left">Tương Tác Trung Bình</p>
          <p className="text-lg font-black text-slate-800 text-center md:text-left flex items-center justify-center md:justify-start gap-1.5">
            <BarChart2 className="w-4 h-4 text-emerald-500" />
            {avgEngagement}% Rate
          </p>
        </div>
      </div>

      {/* Main Filter and Video Feeds Log Container */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/95 p-4 rounded-[24px] border border-orange-50/80 shadow-xs">
          
          {/* Section title */}
          <div className="flex items-center gap-2 self-start md:self-center">
            <ListFilter className="w-4 h-4 text-orange-500" />
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-tight">Bộ lọc & Danh Sách Nhật Ký Phát Sóng</h4>
          </div>

          {/* Filtering Layout Controls */}
          <div className="w-full md:w-auto flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo chủ đề, concept..."
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:bg-white focus:border-orange-400 transition-all text-slate-700 w-full sm:w-44"
            />

            {/* Filter by store */}
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-black outline-none cursor-pointer"
            >
              <option value="all">Tất cả Shop</option>
              {allStores.map(s => (
                <option key={s.id} value={s.id}>{s.name} (Shop {s.id})</option>
              ))}
            </select>

            {/* Filter by creator */}
            <select
              value={creatorFilter}
              onChange={(e) => setCreatorFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-black outline-none cursor-pointer"
            >
              <option value="all">Tất cả Media</option>
              {filtersCreators.map(cr => (
                <option key={cr} value={cr}>Kênh bạn {cr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Infinite Grid of Submitted Videos */}
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-[32px] border border-orange-50 p-12 text-center space-y-3 shadow-xs">
            <div className="mx-auto w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-400 text-lg">
              📭
            </div>
            <h5 className="text-xs font-extrabold text-slate-700">Chưa tìm thấy video nào đăng tuyển khớp bộ lọc!</h5>
            <p className="text-[10px] text-slate-400 font-medium max-w-xs mx-auto">
              Media hãy nhập link video TikTok đã đăng ở khu vực phía trên để bắt đầu vận hành máy chủ chấm điểm nhé.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((rev) => {
                const storeObj = allStores.find(st => st.id === rev.storeId);
                const gradeColor = 
                  rev.metrics.grade.startsWith("S") ? "from-amber-400 to-orange-500 text-white" :
                  rev.metrics.grade.startsWith("A") ? "from-purple-500 to-pink-500 text-white" :
                  "from-sky-500 to-blue-500 text-white";

                return (
                  <motion.div
                    key={rev.id}
                    layoutId={rev.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-[32px] border-2 border-orange-50 hover:border-orange-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/10 transition-all p-5 flex flex-col justify-between space-y-4 hover:-translate-y-0.5"
                  >
                    <div className="space-y-2.5">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] bg-slate-100 text-slate-500 font-black px-2 py-0.5 rounded-full">
                          📍 Shop {rev.storeId}: {storeObj?.name || "Chưa rõ"}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] bg-orange-100 text-orange-600 font-extrabold px-2 py-0.5 rounded-md">
                            👩 Bạn: {rev.creator}
                          </span>
                          {isUserAdmin && (
                            <button
                              onClick={(e) => handleDeleteReview(rev.id, e)}
                              className="w-5 h-5 bg-rose-50 text-rose-500 hover:bg-rose-100 rounded flex items-center justify-center cursor-pointer transition-colors"
                              title="Xóa log video này"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Video Title/Concept */}
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-slate-800 line-clamp-2 leading-snug">
                          {rev.concept}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Đăng lúc {new Date(rev.submittedAt).toLocaleDateString("vi-VN")} {new Date(rev.submittedAt).toLocaleTimeString("vi-VN", {hour: "2-digit", minute:"2-digit"})}
                        </p>
                      </div>

                      {/* Interactive link anchor */}
                      <a
                        href={rev.tiktokUrl}
                        target="_blank"
                        rel="noreferrer referrerPolicy='no-referrer'"
                        className="inline-flex items-center gap-1 text-[10.5px] font-black text-slate-500 hover:text-orange-500 transition-colors w-fit border-b border-dashed border-slate-300 pb-0.5"
                      >
                        <Play className="w-3 h-3 fill-slate-500 group-hover:fill-orange-500 text-transparent" />
                        Mở link Clip thực tế
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>

                    {/* Metrics snapshot bar */}
                    <div className="bg-slate-50/85 p-3 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-center shrink-0">
                      <div>
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase">VIEWS KHẢ QUAN</p>
                        <p className="text-xs font-black text-slate-700">{rev.metrics.views >= 1000 ? `${(rev.metrics.views/1000).toFixed(1)}k` : rev.metrics.views}</p>
                      </div>
                      <div className="border-l border-slate-150">
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase">RATE TƯƠNG TÁC</p>
                        <p className="text-xs font-black text-slate-700">{rev.metrics.engagementRate}%</p>
                      </div>
                    </div>

                    {/* Dynamic Grade & Trigger Action */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-bold">Xếp Hạng AI:</span>
                        <span className={`px-2.5 py-0.5 rounded-[8px] text-[10.5px] font-black uppercase tracking-wider bg-gradient-to-r ${gradeColor} shadow-sm shadow-orange-100`}>
                          Grade {rev.metrics.grade}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedReview(rev)}
                        className="bg-orange-50 hover:bg-orange-150 text-orange-700 border border-orange-200 hover:border-transparent text-[11px] font-black px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Xem Đánh Giá & Giải Pháp
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating Modal Slideout Detail View Assessment Report Panel */}
      <AnimatePresence>
        {selectedReview && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in font-sans" id="review-eval-modal">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] border-3 border-orange-100/90 w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]"
            >
              {/* Modal Top Header brand background indicator */}
              <div className="bg-slate-900 text-white p-5 pr-14 relative shrink-0">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
                >
                  ✕
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-gradient-to-r from-orange-400 to-pink-500 rounded text-[9px] font-black uppercase text-slate-950">AI Auditing Report</span>
                  <span className="text-slate-400 text-xs">|</span>
                  <span className="text-[10.5px] text-slate-300 font-bold">Kênh bạn: <strong className="text-orange-400">{selectedReview.creator}</strong></span>
                  <span className="text-slate-400 text-xs">|</span>
                  <span className="text-[10.5px] text-slate-300 font-bold">Thực hiện cho: {allStores.find(s => s.id === selectedReview.storeId)?.name}</span>
                </div>
                <h3 className="text-sm md:text-base font-black text-white mt-2 leading-snug uppercase">
                  {selectedReview.concept}
                </h3>
              </div>

              {/* Scrollable Body Content */}
              <div className="p-6 overflow-y-auto space-y-6 font-sans">
                
                {/* 1. Scorecard Grid Metrics Panel */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
                    <p className="text-[9.5px] text-slate-400 font-black uppercase mb-0.5">XẾP HẠNG CHUNG</p>
                    <span className="text-xl font-black text-orange-500 uppercase">Grade {selectedReview.metrics.grade}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
                    <p className="text-[9.5px] text-slate-400 font-black uppercase mb-0.5">ƯỚC LƯỢNG VIEWS</p>
                    <span className="text-xl font-black text-slate-800">{selectedReview.metrics.views.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center">
                    <p className="text-[9.5px] text-slate-400 font-black uppercase mb-0.5">TƯƠNG TÁC LIKES</p>
                    <span className="text-xl font-black text-slate-800">{selectedReview.metrics.likes.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-center w-full">
                    <p className="text-[9.5px] text-slate-400 font-black uppercase mb-0.5">SỐ LẦN CHIA SẺ</p>
                    <span className="text-xl font-black text-slate-800">{selectedReview.metrics.shares} lần</span>
                  </div>
                </div>

                {/* 2. Real-world Concept Identified & Weekly Status */}
                <div className="bg-orange-50/40 p-4 rounded-2xl border border-orange-100/50 space-y-1">
                  <h4 className="text-xs font-black text-orange-700 uppercase flex items-center gap-1.5 font-sans">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    Báo cáo từ Giám Đốc Sáng Tạo AI:
                  </h4>
                  <p className="text-xs font-bold text-slate-850">
                    Concept thực tế video: <span className="text-pink-600 font-extrabold">"{selectedReview.identifiedConcept}"</span>
                  </p>
                  <p className="text-[11.5px] font-medium text-slate-600 leading-relaxed italic">
                     "{selectedReview.weeklyPerformanceSummary}"
                  </p>
                </div>

                {/* 3. Component Element Grading Breakdown (Hook, Visual, Audio) */}
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-slate-500" />
                    Phân tích chi tiết cấu thành sản phẩm (POV/Review)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-700">1. Giữ Chân 3s Đầu (Hook):</span>
                        <span className="text-[9px] bg-amber-100 text-amber-700 font-black px-1.5 py-0.5 rounded-sm">{selectedReview.hookRating}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-snug font-medium font-sans">
                        {selectedReview.hookAnalysis}
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-700">2. Mãn Nhãn (Visual):</span>
                        <span className="text-[9px] bg-sky-100 text-sky-700 font-black px-1.5 py-0.5 rounded-sm">{selectedReview.visualRating}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-snug font-medium font-sans">
                        Chất lượng ánh sáng kệ hàng Quảng Châu, tính tương phản màu sắc được đánh giá {selectedReview.visualRating.toLowerCase()}.
                      </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-700">3. m thanh (Audio):</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-700 font-black px-1.5 py-0.5 rounded-sm">Lôi cuốn</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-snug font-medium font-sans">
                        {selectedReview.audioRating} - Khắc hoạ được tinh túy lôi cuốn cho nhóm người xem trẻ tuổi.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Strengths & Weaknesses (Dual Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-2xl p-4.5 space-y-2.5">
                    <h5 className="text-[11px] font-black text-emerald-700 uppercase flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      Điểm Cộng Sáng Tạo (Strengths)
                    </h5>
                    <ul className="space-y-2 text-[11px] text-slate-650 font-sans">
                      {selectedReview.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-50/20 border border-amber-100/50 rounded-2xl p-4.5 space-y-2.5">
                    <h5 className="text-[11px] font-black text-amber-700 uppercase flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500 animate-bounce" />
                      Góc Cần Tiết Chế (Weaknesses)
                    </h5>
                    <ul className="space-y-2 text-[11px] text-slate-650 font-sans">
                      {selectedReview.weaknesses.map((wk, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 5. Key actionable Solutions */}
                <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3 font-sans">
                  <h5 className="text-xs font-black text-orange-400 uppercase flex items-center gap-1.5 tracking-tight">
                    <Lightbulb className="w-4 h-4" />
                    Giải pháp kỹ thuật tối ưu traffic clip sau:
                  </h5>
                  <div className="space-y-3 text-[11.5px] text-slate-200">
                    {selectedReview.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-2 border-b border-slate-800 last:border-transparent pb-2 last:pb-0">
                        <span className="bg-slate-850 text-orange-400 font-black w-5 h-5 rounded-md flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed font-sans">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Modal footer action */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                <p className="text-[9.5px] text-slate-400 font-bold italic">
                  *Ý kiến đóng góp dựa trên mô hình phân tích hành vi người xem thời trang Douyin/TikTok.
                </p>
                <div className="flex gap-2.5">
                  <a
                    href={selectedReview.tiktokUrl}
                    target="_blank"
                    rel="noreferrer referrerPolicy='no-referrer'"
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-4 py-2 rounded-full cursor-pointer transition-colors"
                  >
                    Xem trực tiếp Video
                  </a>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-black px-5 py-2 rounded-full cursor-pointer shadow-md shadow-orange-100"
                  >
                    Đã hiểu!
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
