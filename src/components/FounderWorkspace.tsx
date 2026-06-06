import React, { useState, useEffect } from "react";
import { Store, FounderIdea, UserProfile } from "../types";
import { 
  Award, 
  Lightbulb, 
  Send, 
  Check, 
  Trash2, 
  Plus, 
  ThumbsUp, 
  MessageSquare,
  FileText,
  User,
  Bell,
  Sparkles,
  ArrowRight,
  Lock,
  Eye,
  KeyRound,
  UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FounderWorkspaceProps {
  activeStore: Store;
  allStores: Store[];
  onClaimIdea: (title: string, category: "bags" | "shoes" | "both", description: string) => void;
  currentUser: UserProfile | null;
  users: UserProfile[];
  onUpdateUsers?: (updated: UserProfile[]) => void;
}

// Pre-seeded ideas from Trucdoan to spark immediate inspiration
const INITIAL_FOUNDER_IDEAS: FounderIdea[] = [
  {
    id: "fi-1",
    title: "POV: Đứa bạn dâm mưa giày sũng nước nhưng phát hiện giày búp bê PVC của shop phẩy tay cái khô roong",
    description: "Mưa rào mùa hè ngập lối đi học. Nhân vật phụ đi giày vải ướt như chuột lột, ngồi vắt nước vất vả. Nhân vật chính mang giày nhựa búp bê cao gót PVC 120k của shop chỉ cần lấy khăn lau qua là khô sạch, lên giảng đường sang chảnh.",
    category: "shoes",
    styleSuggestion: "POV Hài Hước, Nhịp Điệu Nhanh",
    likes: 12,
    createdAt: "2026-06-05",
    status: "mới"
  },
  {
    id: "fi-2",
    title: "Thử thách dẫm giày, lấy dao cào chất liệu sọc da túi kẹp nách 139k chứng minh không trầy xước",
    description: "Cạnh tranh trực tiếp với các bên túi lởm giòn da. Lấy hẳn chìa khóa và kéo cào trực tiếp trước ống kính, kéo khoá mạnh ràn rạt để thể hiện độ bền vượt trội. Phấn khích cực độ cho khách sỉ sắm số lượng lớn.",
    category: "bags",
    styleSuggestion: "Thử Thách Chất Lượng, Drama Căng thẳng",
    likes: 8,
    createdAt: "2026-06-06",
    status: "mới"
  },
  {
    id: "fi-3",
    title: "Review Combo túi xộp + Sandal quai chéo chỉ 199k cho buổi đi hẹn hò cafe sống ảo lộng lẫy",
    description: "Nhắm vào tệp sinh viên đi làm thêm đi chơi cuối tuần. Biến hình từ bộ đồ mặc nhà luộm thuộm sang outfit chuẩn nàng thơ ngọt ngào thanh lịch. Toàn bộ giày và túi đều dưới 200k.",
    category: "both",
    styleSuggestion: "Biến Hình Mix Đồ, Decor Sang Chảnh",
    likes: 15,
    createdAt: "2026-06-06",
    status: "mới"
  }
];

const INITIAL_DIRECTIVES = [
  "🔥 Tuần tựu trường cận kề: Hoàng Oanh và Vy Vy tập trung đẩy mạnh clip các mẫu sandal quai chéo mảnh học sinh và sneaker vải Canvas bệt dưới 190k. Khách đang tìm mẫu đi học cực nhiều!",
  "💼 Lan Anh chụp decor túi nơ tiểu thư lấp lánh sang chảnh đi cưới. Thiết kế bối cảnh lung linh rắc nhũ lấp lánh để thu hút nàng thơ 19-24 tuổi nha em.",
  "🎬 Để ý nhịp độ nói trong 3 giây đầu: Mi Mi làm tốt nhưng các clip khác của team vẫn bị dài dòng phần dạo đầu, phải đập ngay mâu thuẫn hoặc visual sản phẩm lấp lánh vào mặt người xem trong 3s nhé!"
];

export default function FounderWorkspace({ 
  activeStore, 
  allStores, 
  onClaimIdea,
  currentUser,
  users,
  onUpdateUsers
}: FounderWorkspaceProps) {
  const [ideas, setIdeas] = useState<FounderIdea[]>(() => {
    const saved = localStorage.getItem("trucdoan_founder_ideas");
    return saved ? JSON.parse(saved) : INITIAL_FOUNDER_IDEAS;
  });

  const [directives, setDirectives] = useState<string[]>(() => {
    const saved = localStorage.getItem("trucdoan_founder_directives");
    return saved ? JSON.parse(saved) : INITIAL_DIRECTIVES;
  });

  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaDesc, setNewIdeaDesc] = useState("");
  const [newIdeaCategory, setNewIdeaCategory] = useState<"bags" | "shoes" | "both">("bags");
  const [newIdeaStyle, setNewIdeaStyle] = useState("POV Hài Hước");

  const [newDirective, setNewDirective] = useState("");
  
  const isUserAdmin = currentUser?.role === "admin";
  const [isFounderMode, setIsFounderMode] = useState(isUserAdmin);

  // Synchronize with logged-in role
  useEffect(() => {
    setIsFounderMode(currentUser?.role === "admin");
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("trucdoan_founder_ideas", JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem("trucdoan_founder_directives", JSON.stringify(directives));
  }, [directives]);

  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle.trim() || !newIdeaDesc.trim()) return;

    const fresh: FounderIdea = {
      id: "fi-" + Date.now(),
      title: newIdeaTitle,
      description: newIdeaDesc,
      category: newIdeaCategory,
      styleSuggestion: newIdeaStyle,
      likes: 0,
      createdAt: new Date().toISOString().split("T")[0],
      status: "mới"
    };

    setIdeas([fresh, ...ideas]);
    setNewIdeaTitle("");
    setNewIdeaDesc("");
    alert("Chị Trucdoan đã đăng ý tưởng mới thành công! Các bạn media sẽ nhìn thấy ngay để lên kịch bản.");
  };

  const handleAddDirective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirective.trim()) return;

    setDirectives([newDirective.trim(), ...directives]);
    setNewDirective("");
    alert("Đã cập nhật chỉ đạo mới từ Founder!");
  };

  const handleDeleteIdea = (id: string) => {
    if (confirm("Chị có chắc chắn muốn xóa ý tưởng này không?")) {
      setIdeas(ideas.filter(item => item.id !== id));
    }
  };

  const handleDeleteDirective = (index: number) => {
    setDirectives(directives.filter((_, i) => i !== index));
  };

  const handleClaim = (idea: FounderIdea) => {
    setIdeas(ideas.map(item => 
      item.id === idea.id 
        ? { ...item, status: "đã lấy" as const, claimedBy: activeStore.creator } 
        : item
    ));
    onClaimIdea(idea.title, idea.category, idea.description);
  };

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdeas(ideas.map(item => 
      item.id === id ? { ...item, likes: item.likes + 1 } : item
    ));
  };

  return (
    <div className="space-y-6" id="founder-workspace-root">
      
      {/* Tab Header Vibe block */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-[32px] p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-gradient-to-bl from-pink-500/20 to-orange-400/20 blur-3xl rounded-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1">
            <span className="text-[10px] font-black bg-gradient-to-r from-orange-400 to-pink-500 text-slate-900 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              👑 GÓC CHỈ ĐẠO CỦA FOUNDER (CHỊ TRUCDOAN)
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-3">
              Ý TƯỞNG & ĐỊNH HƯỚNG QUAY DỰNG CLIPS
            </h2>
            <p className="text-xs text-slate-300 font-medium max-w-xl">
              Nơi chị Trucdoan trực tiếp đăng cảm hứng, nhận xét clips, giao chỉ tiêu tuần và đề xuất kịch bản thô. Media khi kẹt ý tưởng cứ vào đây hốt bão súp của chị đem xào nấu ngay nhé!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 animate-fade-in">
            {isUserAdmin ? (
              <>
                <span className="text-xs text-slate-300 font-bold">Chế độ hiển thị:</span>
                <button
                  onClick={() => setIsFounderMode(!isFounderMode)}
                  className={`px-4.5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider cursor-pointer shadow-md transition-all flex items-center gap-2 border ${
                    isFounderMode 
                      ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-transparent"
                      : "bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-755"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  {isFounderMode ? "Chị Trucdoan (Boss)" : "Nhân viên (Xem chỉ đạo)"}
                </button>
              </>
            ) : (
              <div className="bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2.5 rounded-full text-xs font-bold flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                Quyền: Nhân Viên (Media)
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: Editorial Directives & Commands */}
        <div className="space-y-6 md:col-span-1">
          {/* Directives Board */}
          <div className="bg-white rounded-[32px] border-2 border-orange-50 p-6 shadow-xl shadow-orange-100/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-orange-50 pb-3">
              <Bell className="w-5 h-5 text-orange-500 animate-bounce" />
              <h3 className="text-sm font-black text-slate-850 uppercase tracking-tight">Loa chỉ đạo nóng hổi</h3>
            </div>

            {isFounderMode && (
              <form onSubmit={handleAddDirective} className="space-y-2">
                <textarea
                  value={newDirective}
                  onChange={(e) => setNewDirective(e.target.value)}
                  placeholder="Gõ thông báo, chỉ đạo tuần này của chị tại đây (Ví dụ: Đẩy mạnh túi nơ đi cưới, Lan Anh làm tốt...)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-[18px] p-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-orange-400 focus:bg-white transition-all h-20 resize-none leading-relaxed"
                />
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] py-2.5 rounded-full uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <Send className="w-3 h-3" />
                  Bắn thông báo chỉ đạo
                </button>
              </form>
            )}

            <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
              {directives.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">Không có thông báo mới.</p>
              ) : (
                directives.map((dir, idx) => (
                  <div 
                    key={idx} 
                    className="bg-orange-50/20 border border-orange-100/60 rounded-2xl p-3.5 relative group font-sans text-xs font-semibold leading-relaxed text-slate-800"
                  >
                    <p>{dir}</p>
                    
                    {isFounderMode && (
                      <button
                        onClick={() => handleDeleteDirective(idx)}
                        className="absolute right-2 top-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-rose-50 rounded-full"
                        title="Xóa thông báo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Creator Performance Board Widget */}
          <div className="bg-gradient-to-br from-orange-50/10 to-pink-50/20 border-2 border-orange-50 p-6 rounded-[32px] space-y-4 shadow-xl">
            <h4 className="text-[11px] font-black text-rose-800 uppercase tracking-widest flex items-center gap-1.5">
              👑 Trợ Lý Nhắc Nhở Boss
            </h4>
            
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between items-center bg-white/70 p-3 rounded-2xl border border-orange-100/30">
                <span className="font-semibold">Mi Mi (Mini Trend)</span>
                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Clip hottrend 🎬</span>
              </div>
              <div className="flex justify-between items-center bg-white/70 p-3 rounded-2xl border border-orange-100/30">
                <span className="font-semibold">Vy Vy (ShoeBox)</span>
                <span className="text-[10px] font-bold bg-amber-150 text-orange-800 px-2 py-0.5 rounded-full">Sắp tới hạn ⏳</span>
              </div>
              <div className="flex justify-between items-center bg-white/70 p-3 rounded-2xl border border-orange-100/30">
                <span className="font-semibold">Lan Anh (Flora Bag)</span>
                <span className="text-[10px] font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">Visual cực đỉnh 💎</span>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-400 italic">
              *Hệ thống tự động liên kết định vị xu hướng Douyin thịnh hành hằng ngày để chị Trucdoan dễ bám đuổi phân tích.
            </p>
          </div>

          {/* Admin Security and PIN Management Panel */}
          {isUserAdmin && (
            <div className="bg-white rounded-[32px] border-2 border-orange-100 p-6 shadow-xl shadow-orange-100/10 space-y-4 font-sans" id="sec-pin-panel">
              <div className="flex items-center gap-2 border-b border-orange-100 pb-3">
                <KeyRound className="w-5 h-5 text-orange-500 animate-pulse" />
                <h3 className="text-sm font-black text-slate-850 uppercase tracking-tight">Quản Lý & Sửa Tên Nhân Sự</h3>
              </div>
              
              <p className="text-[10.5px] text-slate-500 font-bold">
                Chị Trucdoan ơi, chị có thể đổi trực tiếp Tên thật, đổi Gmail, sửa mã PIN đăng nhập hoặc phân chia lại Shop quản lý của từng bạn ngay tại đây nhé:
              </p>

              <div className="space-y-3.5 max-h-[3400px] overflow-y-auto pr-1">
                {users.map((u, i) => (
                  <div key={i} className="bg-slate-50 hover:bg-slate-100/70 p-3.5 rounded-2xl border border-slate-200/60 flex flex-col gap-2.5 text-xs font-sans transition-all">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="space-y-0.5">
                        <label className="text-[9px] text-slate-400 font-black uppercase block">Tên Nhân Sự / Kênh:</label>
                        <input
                          type="text"
                          value={u.name}
                          onChange={(e) => {
                            const updated = [...users];
                            updated[i].name = e.target.value;
                            onUpdateUsers?.(updated);
                          }}
                          className="w-full bg-white border border-slate-200 font-extrabold text-slate-800 rounded-lg px-2.5 py-1 text-xs focus:border-orange-400 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[9px] text-slate-400 font-black uppercase block">Gmail Đăng Nhập:</label>
                        <input
                          type="email"
                          value={u.email}
                          onChange={(e) => {
                            const updated = [...users];
                            updated[i].email = e.target.value;
                            onUpdateUsers?.(updated);
                          }}
                          className="w-full bg-white border border-slate-200 font-bold text-slate-600 rounded-lg px-2.5 py-1 text-xs focus:border-orange-400 focus:outline-none"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-2 border-t border-slate-200/40 pt-2 shrink-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="space-y-0.5">
                          <label className="text-[9px] text-slate-400 font-black uppercase block">Mã PIN:</label>
                          <input
                            type="text"
                            value={u.pin}
                            maxLength={6}
                            onChange={(e) => {
                              const updated = [...users];
                              updated[i].pin = e.target.value.replace(/\D/g, "");
                              onUpdateUsers?.(updated);
                            }}
                            className="w-16 bg-white border border-slate-200 text-center font-black text-slate-800 rounded-lg py-1 text-xs focus:border-orange-400 focus:outline-none"
                          />
                        </div>

                        {u.role !== "admin" && (
                          <div className="space-y-0.5">
                            <label className="text-[9px] text-slate-400 font-black uppercase block">Quản lý Shop:</label>
                            <select
                              value={u.storeId || 1}
                              onChange={(e) => {
                                const updated = [...users];
                                updated[i].storeId = parseInt(e.target.value);
                                onUpdateUsers?.(updated);
                              }}
                              className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-700 focus:border-orange-400 focus:outline-none cursor-pointer"
                            >
                              {allStores.map(s => (
                                <option key={s.id} value={s.id}>Shop {s.id}: {s.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 pt-1.5 shrink-0">
                        {u.role === "admin" ? (
                          <span className="text-[8px] bg-orange-100 text-orange-600 font-extrabold px-2 py-1 rounded-md uppercase">QUẢN LÝ / BOSS</span>
                        ) : (
                          <>
                            <span className="text-[8px] bg-sky-100 text-sky-600 font-extrabold px-2 py-1 rounded-md uppercase">MEDIA STAFF</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (u.email === "trucdoanpham1602@gmail.com") return;
                                if (confirm(`Chị Trucdoan chắc chắn muốn xóa hẳn tài khoản của bạn "${u.name}" khỏi app?`)) {
                                  const updated = users.filter((_, idx) => idx !== i);
                                  onUpdateUsers?.(updated);
                                }
                              }}
                              className="text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Xóa tài khoản này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Staff Form */}
              <div className="border-t border-slate-100 pt-3.5 space-y-2 font-sans">
                <p className="text-[10.5px] font-bold text-slate-700 flex items-center gap-1">
                  <UserPlus className="w-3.5 h-3.5 text-orange-500" />
                  Thêm Bạn Staff Mới:
                </p>
                <div className="space-y-2 text-[11px]">
                  <input
                    id="new-user-name"
                    type="text"
                    required
                    placeholder="Tên thật của bạn (Ví dụ: Thảo Vy)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-xs outline-none focus:bg-white focus:border-orange-400"
                  />
                  <input
                    id="new-user-email"
                    type="email"
                    required
                    placeholder="Email đăng nhập (Ví dụ: thaovy@gmail.com)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-xs outline-none focus:bg-white focus:border-orange-400"
                  />
                  <div className="flex gap-2">
                    <select
                      id="new-user-store"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-black text-xs cursor-pointer"
                    >
                      {allStores.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (Shop {s.id})</option>
                      ))}
                    </select>
                    <input
                      id="new-user-pin"
                      type="text"
                      maxLength={4}
                      placeholder="Mã PIN"
                      defaultValue="2026"
                      className="w-16 bg-slate-50 border border-slate-200 text-center rounded-xl p-2.5 font-black text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const nameEl = document.getElementById("new-user-name") as HTMLInputElement;
                      const emailEl = document.getElementById("new-user-email") as HTMLInputElement;
                      const storeEl = document.getElementById("new-user-store") as HTMLSelectElement;
                      const pinEl = document.getElementById("new-user-pin") as HTMLInputElement;

                      if (!nameEl?.value.trim() || !emailEl?.value.trim()) {
                        alert("Chị ơi điền đủ Tên và Gmail nhé!");
                        return;
                      }

                      const emailVal = emailEl.value.trim().toLowerCase();
                      if (users.some(u => u.email === emailVal)) {
                        alert("Gmail này đã tồn tại rồi ạ!");
                        return;
                      }

                      const newUser: UserProfile = {
                        name: nameEl.value.trim(),
                        email: emailVal,
                        role: "staff",
                        pin: pinEl.value.trim() || "2026",
                        storeId: parseInt(storeEl.value) || 1
                      };

                      if (onUpdateUsers) {
                        onUpdateUsers([...users, newUser]);
                      }
                      nameEl.value = "";
                      emailEl.value = "";
                      alert(`Đã thêm cộng tác viên ${newUser.name} vào hệ thống thành công!`);
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer text-center"
                  >
                    Kích hoạt nhân sự
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Ideas and brief post repository */}
        <div className="md:col-span-2 space-y-6">
          {/* Post New Idea Form */}
          {isFounderMode && (
            <div className="bg-white rounded-[32px] border-2 border-orange-50 p-6 shadow-xl shadow-orange-100/10 space-y-4">
              <div className="flex items-center gap-2 border-b border-orange-50 pb-3">
                <Plus className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-black text-slate-850 uppercase tracking-tight">Viết thêm ý tưởng truyền cảm hứng</h3>
              </div>

              <form onSubmit={handleAddIdea} className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block uppercase">1. Tiêu đề / Tình huống phác thảo nhanh:</label>
                  <input
                    type="text"
                    required
                    value={newIdeaTitle}
                    onChange={(e) => setNewIdeaTitle(e.target.value)}
                    placeholder="Ví dụ: POV đứa bạn khoác lác mượn túi kẹp nách sang chảnh đi tị nạnh..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:ring-1 focus:ring-orange-400 focus:outline-none focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block uppercase">2. Thể loại:</label>
                  <select
                    value={newIdeaCategory}
                    onChange={(e) => setNewIdeaCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-orange-400"
                  >
                    <option value="bags">Túi xách Quảng Châu</option>
                    <option value="shoes">Giày dép dạo phố</option>
                    <option value="both">Bộ combo (Túi + Giày)</option>
                  </select>
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[10px] font-black text-slate-400 block uppercase">3. Mô tả chi tiết kịch bản (vibe quay thế nào, làm nổi bật cái gì):</label>
                  <textarea
                    required
                    value={newIdeaDesc}
                    onChange={(e) => setNewIdeaDesc(e.target.value)}
                    placeholder="Kịch bản thô: Bóc phốt bạn mượn giày vải mà dẫm nước dính bùn rưng rưng sợ đền, nhưng hóa ra giày của shop dẻo dai bẻ gập chà sạch siêu hời..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-[20px] p-3 text-xs font-semibold focus:ring-1 focus:ring-orange-400 focus:outline-none focus:bg-white transition-all h-20 resize-none leading-relaxed text-slate-700"
                  />
                </div>

                <div className="sm:col-span-2 space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 block uppercase">4. Tông giọng đề xuất:</label>
                    <input
                      type="text"
                      value={newIdeaStyle}
                      onChange={(e) => setNewIdeaStyle(e.target.value)}
                      placeholder="Ví dụ: POV Hài Hước dã man"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold focus:ring-1 focus:ring-orange-400 focus:outline-none focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-xs py-3 rounded-full flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all"
                  >
                    <Lightbulb className="w-4 h-4 fill-white" />
                    Chia sẻ ý tưởng ý nhị này
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Ideas Repository */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest select-none flex items-center">
                <span className="w-1.5 h-3.5 bg-orange-500 mr-2 rounded-full inline-block"></span>
                KHO Ý TƯỞNG CỦA BOSS HIỆN CÓ ({ideas.length})
              </h3>
              <span className="text-[10px] text-slate-400 font-bold italic">
                *Bạn Media phụ trách shop đang chọn nhấp "Lấy ý tưởng" để viết kịch bản chi tiết
              </span>
            </div>

            <div className="space-y-4">
              {ideas.length === 0 ? (
                <div className="bg-white rounded-[32px] p-12 text-center border-2 border-dashed border-slate-100">
                  <Lightbulb className="w-10 h-10 text-orange-200 mx-auto animate-pulse mb-3" />
                  <p className="text-xs text-slate-500 font-bold">&ldquo;Nồi ý tưởng của chị đang trống rỗng rồi! Boss hãy ghi vài dòng truyền cảm hứng đi ạ.&rdquo;</p>
                </div>
              ) : (
                ideas.map((idea) => {
                  const isClaimed = idea.status === "đã lấy";
                  return (
                    <div
                      key={idea.id}
                      className={`bg-white rounded-[32px] border-2 p-6 shadow-xl transition-all relative overflow-hidden flex flex-col justify-between gap-4 ${
                        isClaimed 
                          ? "border-slate-150 opacity-75" 
                          : "border-orange-50 hover:border-orange-200"
                      }`}
                    >
                      {/* Ribbon Category Tag */}
                      <div className="flex items-start justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            idea.category === "bags"
                              ? "bg-orange-100 text-orange-700"
                              : idea.category === "shoes"
                              ? "bg-pink-100 text-pink-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                            {idea.category === "bags" ? "Túi xách" : idea.category === "shoes" ? "Giày dép" : "Combo túi giày"}
                          </span>

                          <span className="text-[9px] font-black bg-slate-50 text-slate-600 px-2 py-0.5 rounded-full border">
                            🎭 {idea.styleSuggestion}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleUpvote(idea.id, e)}
                            className="text-[10.5px] font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded-full border border-orange-100 flex items-center gap-1 transition-colors"
                          >
                            <ThumbsUp className="w-3 h-3 fill-orange-600" />
                            {idea.likes}
                          </button>

                          {isFounderMode && (
                            <button
                              onClick={() => handleDeleteIdea(idea.id)}
                              className="text-slate-400 hover:text-red-500 rounded-full p-1.5 hover:bg-rose-50 transition-colors"
                              title="Xóa ý tưởng này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-black text-slate-850 leading-tight">
                          💡 {idea.title}
                        </h4>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed font-sans">
                          {idea.description}
                        </p>
                      </div>

                      {/* Claim Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-100 mt-2">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">
                          Đăng ngày: {idea.createdAt}
                        </span>

                        {isClaimed ? (
                          <div className="flex items-center gap-1 text-[10px] bg-green-50 text-green-700 border border-green-200 px-3.5 py-1.5 rounded-full font-bold uppercase select-none">
                            <Check className="w-3.5 h-3.5" />
                            {idea.claimedBy} đã lấy quay dựng
                          </div>
                        ) : (
                          <button
                            onClick={() => handleClaim(idea)}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] px-4 py-2.5 rounded-full uppercase tracking-wider flex items-center gap-1 cursor-pointer shadow-sm active:scale-95 transition-all text-right"
                          >
                            <span>Lấy ý tưởng quay dựng</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
