import React, { useState, useEffect } from "react";
import { Store, ScheduleItem, UserProfile } from "./types";
import {
  Sparkles,
  Languages,
  Calendar as CalendarIcon,
  ShoppingBag,
  Flame,
  Settings,
  Users,
  Check,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  FileText,
  Award,
  LogOut,
  KeyRound,
  ShieldAlert,
  User,
  ShieldCheck,
  Unlock,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import DailyIdeas from "./components/DailyIdeas";
import ScriptGenerator from "./components/ScriptGenerator";
import ChineseTranslator from "./components/ChineseTranslator";
import HookTuner from "./components/HookTuner";
import ContentCalendar from "./components/ContentCalendar";
import FounderWorkspace from "./components/FounderWorkspace";
import VideoAudits from "./components/VideoAudits";
import PersonnelManager from "./components/PersonnelManager";

// Pre-configured staff and admin accounts for secure PIN login authentication
const DEFAULT_USERS: UserProfile[] = [
  {
    name: "Founder Trucdoan",
    email: "trucdoanpham1602@gmail.com",
    role: "admin",
    pin: "1602",
    storeId: 1
  },
  {
    name: "Media Mi Mi",
    email: "mimi.mini.trend@gmail.com",
    role: "staff",
    pin: "2026",
    storeId: 1
  },
  {
    name: "Media Vy Vy",
    email: "vyvy.shoebox@gmail.com",
    role: "staff",
    pin: "2026",
    storeId: 2
  },
  {
    name: "Media Lan Anh",
    email: "lananh.flora.bag@gmail.com",
    role: "staff",
    pin: "2026",
    storeId: 3
  },
  {
    name: "Media Hoàng Oanh",
    email: "hoangoanh.urban@gmail.com",
    role: "staff",
    pin: "2026",
    storeId: 4
  },
  {
    name: "Media Phương Linh",
    email: "phuonglinh.glamour@gmail.com",
    role: "staff",
    pin: "2026",
    storeId: 5
  }
];

// Curriculum initial setup of 5 stores targeting Guangzhou under-200k bags and shoes
const DEFAULT_STORES: Store[] = [
  {
    id: 1,
    name: "Mini Trend",
    creator: "Mi Mi",
    style: "Túi xách dạo phố, kẹp nách hottrend cá tính, phong cách ulzzang Douyin rực rỡ học sinh sinh viên",
    targetAudience: "Nữ thanh xuân đại học 18-22 tuổi, yêu thích thời trang nhanh rẻ, giá dưới 150k",
    category: "bags"
  },
  {
    id: 2,
    name: "ShoeBox GenZ",
    creator: "Vy Vy",
    style: "Giày sneaker thể thao vải Canvas bệt, dép bánh mì chunky tăng chiều cao bắt trend TikTok",
    targetAudience: "Học sinh sinh viên chuộng đi học phối đồ nhẹ nhàng, ưa vận động, giá mộc dưới 190k",
    category: "shoes"
  },
  {
    id: 3,
    name: "Flora Bag",
    creator: "Lan Anh",
    style: "Túi nơ bướm mềm mại, túi xách đi cưới lấp lánh tiểu thư ngọt ngào kẹo ngọt sang chảnh",
    targetAudience: "Các nàng thơ bánh bèo 19-24 tuổi, sắm đồ đi hẹn hò cafe chụp hình sống ảo thả thính",
    category: "bags"
  },
  {
    id: 4,
    name: "Urban Walk",
    creator: "Hoàng Oanh",
    style: "Sandal quai chéo mảnh đi học, dép lê đính đá & giày giày cao gót vuông 3-5cm hack dáng nhẹ nhàng",
    targetAudience: "Sinh viên và học sinh đi làm thêm đi thực tập, cần sản phẩm tối giản dễ đi, tầm giá 120k đến 180k",
    category: "shoes"
  },
  {
    id: 5,
    name: "Glamour Club",
    creator: "Phương Linh",
    style: "Set quà tặng túi xộp vuông + kẹp nách giả da hottrend và giày xăng đan combo dạo phố đi tiệc thời thượng giá shock",
    targetAudience: "Hội chị em mê lướt livestream dạo sắm đồ đẹp giá mềm như ly trà sữa dưới 200k",
    category: "both"
  }
];

// Instructive pre-populated schedule entries representing high quality visual flow
const DEFAULT_SCHEDULE: ScheduleItem[] = [
  {
    id: "s1",
    storeId: 1,
    date: "Mon",
    timeSlot: "Tối (19:30)",
    title: "POV: Đứa bạn thân mượn túi kẹp nách xước nhẹ mà cứ khóc sướt mướt tưởng tiền triệu",
    concept: "POV Hài Hước",
    status: "nháp"
  },
  {
    id: "s2",
    storeId: 2,
    date: "Tue",
    timeSlot: "Chiều (15:00)",
    title: "Thử thách gập bẻ đôi giày vải Converse học sinh dẻo dai chống mòn chất chơi",
    concept: "Thử Thách",
    status: "duyệt"
  },
  {
    id: "s3",
    storeId: 1,
    date: "Thu",
    timeSlot: "Sáng (09:00)",
    title: "Review túi phao mini nhét vừa 10 cây son của Phương Linh",
    concept: "Review Đập Hộp",
    status: "nháp"
  },
  {
    id: "s4",
    storeId: 3,
    date: "Wed",
    timeSlot: "Tối (19:30)",
    title: "Khui hộp mẫu túi kẹo satin nơ lụa chuẩn bị đi du hè cùng crush",
    concept: "Khoe Hàng Mới",
    status: "đã đăng"
  },
  {
    id: "s5",
    storeId: 4,
    date: "Fri",
    timeSlot: "Chiều (15:00)",
    title: "Outfit Biến Hình dạo cafe bệt cùng xăng đan quai chéo 130k",
    concept: "Biến Hình Mix Đồ",
    status: "duyệt"
  },
  {
    id: "s6",
    storeId: 5,
    date: "Sat",
    timeSlot: "Tối (19:30)",
    title: "Khoe đơn hàng khủng bill 2 triệu chất đầy túi giày bạt ngàn",
    concept: "POV Hài Hước",
    status: "nháp"
  }
];

export default function App() {
  const [stores, setStores] = useState<Store[]>(() => {
    const saved = localStorage.getItem("fashion_stores");
    return saved ? JSON.parse(saved) : DEFAULT_STORES;
  });

  // Security staff access states
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem("fashion_users");
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("fashion_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [selectedUserForPin, setSelectedUserForPin] = useState<UserProfile | null>(null);
  const targetPinLength = selectedUserForPin ? selectedUserForPin.pin.length : 4;
  const [enteredPin, setEnteredPin] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [customPin, setCustomPin] = useState("");
  const [showCustomLogin, setShowCustomLogin] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [activeStoreId, setActiveStoreId] = useState<number>(1);
  const [scheduleList, setScheduleList] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem("fashion_schedule");
    return saved ? JSON.parse(saved) : DEFAULT_SCHEDULE;
  });

  const [activeTab, setActiveTab] = useState<"daily" | "generator" | "translator" | "hook" | "calendar" | "founder" | "reviews" | "personnel">("daily");
  
  // Custom generator select integration bridge
  const [selectedIdeaPrompt, setSelectedIdeaPrompt] = useState<string | null>(null);

  // Store profile editor drawer panel
  const [showEditor, setShowEditor] = useState(false);
  const [editingStoreId, setEditingStoreId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editCreator, setEditCreator] = useState("");
  const [editStyle, setEditStyle] = useState("");
  const [editAudience, setEditAudience] = useState("");
  const [editCategory, setEditCategory] = useState<"bags" | "shoes" | "both">("both");

  // Save changes securely
  useEffect(() => {
    localStorage.setItem("fashion_stores", JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem("fashion_schedule", JSON.stringify(scheduleList));
  }, [scheduleList]);

  // Synchronize users updates
  useEffect(() => {
    localStorage.setItem("fashion_users", JSON.stringify(users));
  }, [users]);

  // Handle current user persistence and auto-linking activeStore configuration
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("fashion_current_user", JSON.stringify(currentUser));
      if (currentUser.role === "staff" && currentUser.storeId) {
        setActiveStoreId(currentUser.storeId);
      }
    } else {
      localStorage.removeItem("fashion_current_user");
    }
  }, [currentUser]);

  const activeStore = stores.find((s) => s.id === activeStoreId) || stores[0];

  const handleSelectIdeaToGenerator = (promptText: string, category: "bags" | "shoes" | "both") => {
    setSelectedIdeaPrompt(promptText);
    setActiveTab("generator");
  };

  const handleAddSchedule = (newItem: Omit<ScheduleItem, "id">) => {
    const fresh: ScheduleItem = {
      ...newItem,
      id: "sc-" + Date.now()
    };
    setScheduleList((prev) => [fresh, ...prev]);
  };

  const handleDeleteSchedule = (id: string) => {
    setScheduleList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateScheduleStatus = (id: string, newStatus: ScheduleItem["status"]) => {
    setScheduleList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleStartEdit = (store: Store) => {
    setEditingStoreId(store.id);
    setEditName(store.name);
    setEditCreator(store.creator);
    setEditStyle(store.style);
    setEditAudience(store.targetAudience);
    setEditCategory(store.category);
    setShowEditor(true);
  };

  const handleSaveStoreChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStoreId) return;

    setStores((prev) =>
      prev.map((s) =>
        s.id === editingStoreId
          ? {
              ...s,
              name: editName,
              creator: editCreator,
              style: editStyle,
              targetAudience: editAudience,
              category: editCategory
            }
          : s
      )
    );

    setShowEditor(false);
    setEditingStoreId(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-orange-50 via-slate-50 to-pink-50 flex items-center justify-center p-4 font-sans select-none relative overflow-hidden" id="auth-panel-gate">
        {/* Abstract background graphics decoration */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-tr from-orange-300/10 to-pink-300/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-tr from-pink-300/10 to-orange-300/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-lg bg-white rounded-[32px] border-2 border-orange-100 shadow-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-pink-500"></div>
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight uppercase mt-4">
              Trucdoanpham Retail Fashion
            </h1>
            <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
              Vui lòng chọn tài khoản hoặc đăng nhập bằng Gmail của bạn để truy cập AI Studio Workspace bảo mật.
            </p>
          </div>

          {loginError && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-rose-50 border border-rose-100/80 text-rose-600 rounded-2xl p-3 text-xs font-bold text-center flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {loginError}
            </motion.div>
          )}

          {/* Conditional Steps inside login card */}
          <AnimatePresence mode="wait">
            {!selectedUserForPin && !showCustomLogin ? (
              /* Step 1: Select Profile Card list */
              <motion.div
                key="select-profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between border-b border-orange-50 pb-2">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
                    👉 Chọn tên tài khoản của bạn:
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {users.map((u) => {
                    const isAdmin = u.role === "admin";
                    return (
                      <button
                        key={u.email}
                        onClick={() => {
                          setSelectedUserForPin(u);
                          setEnteredPin("");
                          setLoginError("");
                        }}
                        className={`text-left p-3.5 rounded-2xl border-2 border-slate-50 hover:border-orange-200 bg-slate-50/50 hover:bg-white transition-all cursor-pointer group flex flex-col justify-between h-24 ${
                          isAdmin ? "hover:shadow-md hover:shadow-orange-50" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`w-2 h-2 rounded-full ${isAdmin ? "bg-orange-500 animate-pulse" : "bg-slate-300"}`}></span>
                          {isAdmin ? (
                            <span className="text-[8px] bg-amber-100 text-amber-700 font-extrabold px-1.5 py-0.5 rounded-md uppercase">Boss</span>
                          ) : (
                            <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-md">Media</span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 line-clamp-1 group-hover:text-orange-500 transition-colors">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium truncate">
                            {u.email}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      setShowCustomLogin(true);
                      setLoginError("");
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5" />
                    Đăng nhập bằng Gmail khác
                  </button>
                </div>
              </motion.div>
            ) : selectedUserForPin ? (
              /* Step 2: PIN passcode Numeric entry pad */
              <motion.div
                key="enter-pin"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="bg-gradient-to-br from-orange-400 to-pink-500 text-white p-2.5 rounded-xl shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">{selectedUserForPin.name}</p>
                    <p className="text-[10.5px] text-slate-400 font-medium">{selectedUserForPin.email}</p>
                  </div>
                </div>

                <div className="text-center space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-orange-500 tracking-wider">
                    🔒 Nhập Mã PIN bảo mật:
                  </label>
                  
                  {/* Pin Dot Indicators */}
                  <div className="flex justify-center gap-3 py-3">
                    {Array.from({ length: targetPinLength }).map((_, idx) => {
                      const dotIndex = idx + 1;
                      return (
                        <span
                          key={dotIndex}
                          className={`w-3.5 h-3.5 rounded-full transition-all duration-150 border ${
                            enteredPin.length >= dotIndex
                              ? "bg-gradient-to-r from-orange-500 to-pink-500 border-transparent scale-110"
                              : "bg-slate-100 border-slate-200"
                          }`}
                        ></span>
                      );
                    })}
                  </div>

                  <input
                    type="password"
                    maxLength={targetPinLength}
                    readOnly
                    value={enteredPin}
                    className="sr-only"
                  />
                </div>

                {/* Keypad */}
                <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        if (enteredPin.length < targetPinLength) {
                          const newPin = enteredPin + num;
                          setEnteredPin(newPin);
                          if (newPin.length === targetPinLength) {
                            if (newPin === selectedUserForPin.pin) {
                              setCurrentUser(selectedUserForPin);
                              setSelectedUserForPin(null);
                              setEnteredPin("");
                              setLoginError("");
                            } else {
                              setLoginError("Mã PIN bảo mật không chính xác!");
                              setEnteredPin("");
                            }
                          }
                        }
                      }}
                      className="w-16 h-12 md:w-20 md:h-14 font-black text-slate-700 bg-slate-50 border border-slate-200/50 hover:bg-slate-100 hover:border-orange-300 rounded-2xl flex items-center justify-center cursor-pointer text-base active:scale-95 transition-all mx-auto shadow-sm"
                    >
                      {num}
                    </button>
                  ))}
                  
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUserForPin(null);
                      setEnteredPin("");
                      setLoginError("");
                    }}
                    className="w-16 h-12 md:w-20 md:h-14 font-bold text-slate-400 hover:text-slate-600 rounded-2xl flex items-center justify-center cursor-pointer text-[11px] transition-colors mx-auto uppercase tracking-tighter"
                  >
                    Hủy
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (enteredPin.length < targetPinLength) {
                        const num = 0;
                        const newPin = enteredPin + num;
                        setEnteredPin(newPin);
                        if (newPin.length === targetPinLength) {
                          if (newPin === selectedUserForPin.pin) {
                            setCurrentUser(selectedUserForPin);
                            setSelectedUserForPin(null);
                            setEnteredPin("");
                            setLoginError("");
                          } else {
                            setLoginError("Mã PIN bảo mật không chính xác!");
                            setEnteredPin("");
                          }
                        }
                      }
                    }}
                    className="w-16 h-12 md:w-20 md:h-14 font-black text-slate-700 bg-slate-50 border border-slate-200/50 hover:bg-slate-100 rounded-2xl flex items-center justify-center cursor-pointer text-base active:scale-95 transition-all mx-auto shadow-sm"
                  >
                    0
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (enteredPin.length > 0) {
                        setEnteredPin(enteredPin.slice(0, -1));
                      }
                    }}
                    className="w-16 h-12 md:w-20 md:h-14 font-black text-slate-400 hover:text-rose-500 rounded-2xl flex items-center justify-center cursor-pointer text-sm transition-colors mx-auto"
                  >
                    ⌫
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Step 3: Custom Gmail Login */
              <motion.div
                key="custom-login"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                <div className="space-y-3 font-sans">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 block font-sans">
                      Địa chỉ Gmail:
                    </label>
                    <input
                      type="email"
                      required
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="quynh@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-bold outline-none focus:bg-white focus:border-orange-400 transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 block font-sans">
                      Mã PIN Đăng nhập (Mã PIN gốc):
                    </label>
                    <input
                      type="password"
                      maxLength={6}
                      required
                      value={customPin}
                      onChange={(e) => setCustomPin(e.target.value.replace(/\D/g, ""))}
                      placeholder="Nhập mã PIN"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-sm font-black outline-none focus:bg-white focus:border-orange-400 tracking-widest font-sans"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const lEmail = customEmail.trim().toLowerCase();
                    if (!lEmail || !customPin) {
                      setLoginError("Vui lòng điền đủ địa chỉ email và mã PIN!");
                      return;
                    }

                    const foundUser = users.find((u) => u.email === lEmail);
                    if (foundUser) {
                      if (foundUser.pin === customPin) {
                        setCurrentUser(foundUser);
                        setCustomEmail("");
                        setCustomPin("");
                        setLoginError("");
                        setShowCustomLogin(false);
                      } else {
                        setLoginError("Mã PIN bảo mật không chính xác!");
                      }
                    } else {
                      // Allow custom registration using either generic staff PIN "2026" or admin pin "1602"
                      const isStaffPin = customPin === "2026";
                      const isAdminPin = customPin === "1602";
                      if (isStaffPin || isAdminPin) {
                        const newProfile: UserProfile = {
                          name: lEmail.split("@")[0].toUpperCase(),
                          email: lEmail,
                          role: isAdminPin ? "admin" : "staff",
                          pin: customPin,
                          storeId: isStaffPin ? 1 : undefined
                        };
                        setUsers((prev) => [...prev, newProfile]);
                        setCurrentUser(newProfile);
                        setCustomEmail("");
                        setCustomPin("");
                        setLoginError("");
                        setShowCustomLogin(false);
                      } else {
                        setLoginError("Mã PIN không chính xác và Gmail này chưa được cấp tài khoản!");
                      }
                    }
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-black py-3 rounded-full text-xs uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-orange-100 transition-all cursor-pointer font-sans text-center"
                >
                  Kiểm tra & Vào Workspace
                </button>

                <div className="pt-1 text-center font-sans">
                  <button
                    onClick={() => {
                      setShowCustomLogin(false);
                      setLoginError("");
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors cursor-pointer"
                  >
                    ← Quay lại chọn danh sách
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedUserForPin(null);
    setEnteredPin("");
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0]/30 flex flex-col font-sans" id="applet-primary-layout">
      {/* Upper Main navigation and branding title bar area */}
      <header className="bg-white border-b border-orange-100 sticky top-0 z-40 shadow-sm shadow-orange-100/10">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-400 to-pink-500 text-white p-2.5 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5 font-sans uppercase">
                Trucdoanpham Retail Fashion
                <span className="text-[10px] bg-orange-50 border border-orange-200 text-orange-600 px-2 py-0.5 rounded-full font-mono font-bold tracking-wider">
                  Guangzhou Trend v1.2
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Hệ thống đồng hành cùng 5 shop sáng tạo kịch bản, đề xuất POV & captions cực cháy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Active user session profile capsule badge */}
            <div className="bg-slate-100/85 border border-slate-200/60 px-4 py-2 rounded-full flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${currentUser?.role === 'admin' ? 'bg-orange-500 animate-pulse' : 'bg-pink-500'}`}></div>
              <span className="font-extrabold text-slate-850 font-sans">
                {currentUser?.role === 'admin' ? '👑 Boss:' : '👩 Media:'} <span className="text-orange-600">{currentUser?.name}</span>
              </span>
            </div>

            {/* Boss only editing settings */}
            {currentUser?.role === "admin" && (
              <button
                onClick={() => {
                  handleStartEdit(activeStore);
                }}
                className="bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold px-4 py-2.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Settings className="w-3.5 h-3.5" />
                Sửa phân vai/Shop
              </button>
            )}

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold px-4 py-2.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              title="Đăng xuất khỏi phiên làm việc"
            >
              <LogOut className="w-3.5 h-3.5" />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Body container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
        
        {/* Founder Context Warning & App Purpose Overview */}
        <div className="bg-white rounded-[32px] border-2 border-orange-50 p-6 shadow-xl shadow-orange-100/20 flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-400/10 blur-3xl rounded-full pointer-events-none"></div>
          <div className="flex items-start gap-4 max-w-3xl relative z-10">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shrink-0 mt-0.5 shadow-sm shadow-orange-200">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-800 font-sans uppercase flex items-center gap-2">
                <span className="w-2 h-5 bg-orange-400 mr-1 rounded-full inline-block"></span>
                Chào chủ shop! Quản lý 5 bạn Media sáng tạo nội dung túi xách Quảng Châu cực cháy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Tệp khách hàng của bạn tập trung từ <strong>18 đến 25 tuổi</strong> thích hàng <strong>hottrend Quảng Châu giá rẻ dưới 200k</strong>.
                Hệ thống AI Workspace được thiết kế dành riêng cho bạn và đồng đội làm nội dung, từ đề xuất content hằng ngày chống nản chí, viết kịch bản dạng POV thu hút, tối ưu hook kích thích, Việt hóa Douyin và tạo calendar đồng bộ.
              </p>
            </div>
          </div>
          
          <div className="flex bg-orange-50/50 border border-orange-100/60 p-3 rounded-2xl gap-5 shrink-0 divide-x divide-orange-100 self-stretch md:self-center justify-around relative z-10">
            <div className="text-center px-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Cửa hàng</span>
              <span className="text-lg font-black text-orange-500 font-mono">5 Shop</span>
            </div>
            <div className="text-center px-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Media Staff</span>
              <span className="text-lg font-black text-pink-500 font-mono">5 Bạn</span>
            </div>
            <div className="text-center px-4">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider font-sans">Giá sỉ</span>
              <span className="text-lg font-black text-emerald-500 font-mono">&lt; 200k</span>
            </div>
          </div>
        </div>

        {/* Store Navigator Swithes block */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase font-black text-orange-500 block tracking-widest font-sans select-none flex items-center">
            <span className="w-1.5 h-3.5 bg-orange-400 mr-2 rounded-full inline-block"></span>
            📍 CHỌN SHOP ĐANG LÀM MẪU (BỐI CẢNH & TRUYỀN THÔNG AI SẼ TỰ ĐIỀU CHỈNH):
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            {stores.map((store) => {
              const isActive = store.id === activeStoreId;
              const isBags = store.category === "bags";
              const isShoes = store.category === "shoes";
              return (
                <button
                  key={store.id}
                  onClick={() => {
                    setActiveStoreId(store.id);
                    setSelectedIdeaPrompt(null);
                  }}
                  className={`text-left p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group select-none flex flex-col justify-between h-24 ${
                    isActive
                      ? "bg-slate-900 border-orange-400 text-white shadow-lg shadow-orange-100/30 scale-102"
                      : "bg-white border-orange-50 hover:border-orange-200 text-slate-700 shadow-sm"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-orange-500 text-white"
                          : isBags
                          ? "bg-orange-100 text-orange-700"
                          : isShoes
                          ? "bg-pink-100 text-pink-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}>
                        {store.category === "bags" ? "Túi xách" : store.category === "shoes" ? "Giày dép" : "Combo"}
                      </span>
                      <span className={`text-[10px] font-semibold ${isActive ? "text-orange-400" : "text-slate-400 font-mono"}`}>
                        #{store.id}
                      </span>
                    </div>
                    <h3 className="text-xs font-black font-sans mt-2 line-clamp-1 group-hover:text-orange-500 transition-colors">
                      {store.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-200/10 mt-1">
                    <span className={`text-[9px] font-mono font-bold ${isActive ? "text-pink-300" : "text-slate-500"}`}>
                      Media: {store.creator}
                    </span>
                    <span className="text-[8px] font-bold opacity-70">{"<"}200k</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Store Style Summary display */}
        <div className="bg-slate-900 text-white p-4.5 rounded-[20px] border-2 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-pink-500/20 to-orange-400/20 blur-2xl rounded-full pointer-events-none"></div>
          <div className="flex items-center gap-2.5 relative z-10">
            <span className="px-2.5 py-1 bg-gradient-to-r from-orange-400 to-pink-500 text-slate-950 font-black rounded-lg uppercase tracking-wider text-[9px]">STYLE Hướng</span>
            <p className="font-bold text-slate-100 leading-snug">
              {activeStore.style} (Khách: {activeStore.targetAudience})
            </p>
          </div>
          <span className="text-slate-300 font-sans tracking-wide text-[11px] relative z-10">
            Nhân viên phụ trách phục quay dựng: <strong className="text-orange-400">{activeStore.creator}</strong>
          </span>
        </div>

        {/* Tab System section */}
        <div className="flex flex-wrap items-center justify-start bg-white/80 p-1.5 rounded-[24px] border border-orange-100/80 gap-1.5 shadow-sm">
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "daily"
                ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-200/40"
                : "text-slate-600 hover:bg-orange-50/50 hover:text-orange-500"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Đề Xuất Content Hôm Nay
          </button>

          <button
            onClick={() => setActiveTab("generator")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "generator"
                ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-200/40"
                : "text-slate-600 hover:bg-orange-50/50 hover:text-orange-500"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Viết Kịch Bản POV
          </button>

          <button
            onClick={() => setActiveTab("translator")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "translator"
                ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-200/40"
                : "text-slate-600 hover:bg-orange-50/50 hover:text-orange-500"
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            Việt Hóa Video Trung
          </button>

          <button
            onClick={() => setActiveTab("hook")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "hook"
                ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-200/40"
                : "text-slate-600 hover:bg-orange-50/50 hover:text-orange-500"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Sửa Hook & Kịch Bản Nhạt
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "calendar"
                ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-200/40"
                : "text-slate-600 hover:bg-orange-50/50 hover:text-orange-500"
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            Content Planner & Caption Shop
          </button>

          <button
            onClick={() => setActiveTab("founder")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "founder"
                ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-200/40 animate-pulse"
                : "text-slate-600 hover:bg-orange-50/50 hover:text-orange-500"
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            Góc Founder Trucdoan
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "reviews"
                ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-200/40"
                : "text-slate-600 hover:bg-orange-50/50 hover:text-orange-500"
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Video Đã Đăng & AI Audit
          </button>

          {currentUser?.role === "admin" && (
            <button
              onClick={() => setActiveTab("personnel")}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "personnel"
                  ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md shadow-orange-200/40"
                  : "text-slate-600 hover:bg-orange-50/50 hover:text-orange-500"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Quản lý Nhân sự & PIN
            </button>
          )}
        </div>

        {/* Rendering Content area based on active tab state */}
        <div className="space-y-6">
          {activeTab === "daily" && (
            <DailyIdeas
              activeStore={activeStore}
              onSelectIdea={handleSelectIdeaToGenerator}
            />
          )}

          {activeTab === "generator" && (
            <ScriptGenerator
              activeStore={activeStore}
              onAddToPlanner={(vTitle, vConcept, vHook) => {
                handleAddSchedule({
                  storeId: activeStore.id,
                  date: "Mon",
                  timeSlot: "Tối (19:30)",
                  title: vTitle,
                  concept: vConcept,
                  status: "nháp",
                  caption: `Kịch bản: ${vTitle}\n\nHook 3 giây đầu: "${vHook}"`
                });
                alert("Đã thêm ý tưởng kịch bản nháp này vào lịch đăng Thứ 2, khung giờ Tối!");
              }}
            />
          )}

          {activeTab === "translator" && (
            <ChineseTranslator
              activeStore={activeStore}
              onAddToPlanner={(vTitle, vConcept) => {
                handleAddSchedule({
                  storeId: activeStore.id,
                  date: "Wed",
                  timeSlot: "Chiều (15:00)",
                  title: "Dịch Việt Hóa: " + vTitle,
                  concept: vConcept,
                  status: "nháp"
                });
                alert("Đã thêm kịch bản Douyin việt hóa vào Lịch đăng Thứ 4, khung giờ Chiều!");
              }}
            />
          )}

          {activeTab === "hook" && (
            <HookTuner activeStore={activeStore} />
          )}

          {activeTab === "calendar" && (
            <ContentCalendar
              activeStore={activeStore}
              allStores={stores}
              scheduleList={scheduleList}
              onAddSchedule={handleAddSchedule}
              onDeleteSchedule={handleDeleteSchedule}
              onUpdateStatus={handleUpdateScheduleStatus}
            />
          )}

          {activeTab === "founder" && (
            <FounderWorkspace
              activeStore={activeStore}
              allStores={stores}
              currentUser={currentUser}
              users={users}
              onUpdateUsers={(updated) => setUsers(updated)}
              onClaimIdea={(title, category, description) => {
                setSelectedIdeaPrompt(`Lên kịch bản chi tiết dựa trên ý chỉ đạo của Founder Trucdoan:\nÝ tưởng: ${title}\nMô tả bối cảnh & nội dung: ${description}`);
                setActiveTab("generator");
              }}
            />
          )}

          {activeTab === "reviews" && (
            <VideoAudits
              activeStore={activeStore}
              allStores={stores}
              currentUser={currentUser}
              users={users}
            />
          )}

          {activeTab === "personnel" && (
            <PersonnelManager
              users={users}
              onUpdateUsers={(updated) => setUsers(updated)}
              allStores={stores}
              currentUser={currentUser}
            />
          )}
        </div>
      </main>

      {/* Footer credits and information */}
      <footer className="bg-slate-900 border-t-2 border-orange-500/10 text-slate-400 py-6 text-xs text-center mt-auto">
        <p className="font-sans">© 2026 AI Fashion Content Studio Workspace. Được tối ưu hóa cho ngành hàng bán sỉ/lẻ Túi xách & Giày dép Quảng Châu giá sỉ.</p>
        <p className="text-[10px] text-orange-400 font-semibold mt-1">
          Hỗ trợ vận hành mượt mà cho 5 bạn Media: Mi Mi • Vy Vy • Lan Anh • Hoàng Oanh • Phương Linh.
        </p>
      </footer>

      {/* Settings Dialog Overlay */}
      {showEditor && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-2xl border border-orange-100 space-y-4 font-sans relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-400 to-pink-500"></div>
            <div className="flex items-center justify-between pb-3 border-b border-orange-50">
              <h3 className="font-black text-slate-800 text-base flex items-center gap-2 uppercase tracking-tight">
                <span className="w-1.5 h-3.5 bg-orange-500 rounded-full inline-block"></span>
                Cấu hình thông tin Shop #{editingStoreId}
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-orange-500 text-lg cursor-pointer transition-colors"
                onClick={() => setShowEditor(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStoreChanges} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-600 font-bold block select-none">Tên cửa hàng thời trang:</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block select-none">Bạn Media phụ trách shop:</label>
                <input
                  type="text"
                  required
                  value={editCreator}
                  onChange={(e) => setEditCreator(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block select-none">Sản phẩm chính của shop:</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 cursor-pointer text-slate-800 font-semibold"
                >
                  <option value="bags">Túi xách Quảng Châu</option>
                  <option value="shoes">Giày dép dạo phố</option>
                  <option value="both">Bộ combo Cả giày & túi xách</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block select-none">Phong cách của shop:</label>
                <input
                  type="text"
                  required
                  value={editStyle}
                  onChange={(e) => setEditStyle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 font-bold block select-none">Tệp khách hàng đặc trưng:</label>
                <textarea
                  required
                  value={editAudience}
                  onChange={(e) => setEditAudience(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:bg-white focus:border-orange-400 focus:ring-1 focus:ring-orange-400 transition-all h-20 resize-none font-medium text-slate-700"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="px-4.5 py-2.5 border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 cursor-pointer font-bold transition-all text-xs"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-full hover:shadow-md cursor-pointer transition-all text-xs"
                >
                  Cập nhật thay đổi
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
