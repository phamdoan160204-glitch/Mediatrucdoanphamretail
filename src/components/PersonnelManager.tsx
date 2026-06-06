import React, { useState } from "react";
import { UserProfile, Store } from "../types";
import { 
  Users, 
  UserPlus, 
  KeyRound, 
  Mail, 
  ShoppingBag, 
  Trash2, 
  Check, 
  AlertCircle, 
  Sparkles,
  ShieldCheck,
  Smartphone,
  Lock,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PersonnelManagerProps {
  users: UserProfile[];
  onUpdateUsers: (updated: UserProfile[]) => void;
  allStores: Store[];
  currentUser: UserProfile | null;
}

export default function PersonnelManager({ users, onUpdateUsers, allStores, currentUser }: PersonnelManagerProps) {
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPin, setNewStaffPin] = useState("");
  const [newStaffStoreId, setNewStaffStoreId] = useState<number>(1);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setActionSuccess("");

    const name = newStaffName.trim();
    const email = newStaffEmail.trim().toLowerCase();
    const pin = newStaffPin.trim().replace(/\D/g, "");

    if (!name || !email || !pin) {
      setActionError("Chị Trucdoan ơi, vui lòng điền đầy đủ cả Tên, Gmail và mã PIN nhé!");
      return;
    }

    if (pin.length < 4 || pin.length > 6) {
      setActionError("Mã PIN bảo mật của các bạn nhân sự nên có từ 4 đến 6 chữ số nha chị.");
      return;
    }

    if (users.some(u => u.email === email)) {
      setActionError(`Email "${email}" đã có người sử dụng. Chị vui lòng nhập Email khác nhé!`);
      return;
    }

    const newStaff: UserProfile = {
      name,
      email,
      role: "staff",
      pin,
      storeId: newStaffStoreId
    };

    onUpdateUsers([...users, newStaff]);
    
    // Reset form states
    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffPin("");
    setActionSuccess(`Đã thêm thành công bạn "${name}". Giờ bạn ấy đã có thể dùng mã PIN "${pin}" để đăng nhập!`);
    
    setTimeout(() => {
      setActionSuccess("");
    }, 4500);
  };

  const handleDeleteUser = (email: string, name: string) => {
    if (email === "trucdoanpham1602@gmail.com") {
      setActionError("Chị không thể tự xóa tài khoản Boss của mình nha!");
      return;
    }

    if (window.confirm(`Chị Trucdoan chắc chắn muốn xóa hẳn tài khoản của bạn "${name}" khỏi hệ thống không? Bạn ấy sẽ không thể đăng nhập nữa.`)) {
      const updated = users.filter((u) => u.email !== email);
      onUpdateUsers(updated);
      setActionSuccess(`Đã xóa tài khoản của bạn "${name}" thành công.`);
      setTimeout(() => setActionSuccess(""), 3000);
    }
  };

  const handleUpdateField = (index: number, key: keyof UserProfile, value: any) => {
    const updatedUsers = [...users];
    
    if (key === "pin") {
      updatedUsers[index] = {
        ...updatedUsers[index],
        pin: String(value).replace(/\D/g, "")
      };
    } else if (key === "email") {
      updatedUsers[index] = {
        ...updatedUsers[index],
        email: String(value).trim().toLowerCase()
      };
    } else {
      updatedUsers[index] = {
        ...updatedUsers[index],
        [key]: value
      };
    }

    onUpdateUsers(updatedUsers);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Welcome Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-850 p-6 md:p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-36 h-36 bg-gradient-to-bl from-orange-400/20 to-pink-500/20 blur-2xl rounded-full pointer-events-none"></div>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-lg text-xs font-bold text-orange-400 uppercase tracking-wider">
            👑 QUYỀN HẠN FOUNDER / BOSS
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight font-sans uppercase">
            HỆ THỐNG QUẢN LÝ NHÂN SỰ & MÃ PIN BẢO MẬT
          </h2>
          <p className="text-slate-300 text-xs font-semibold leading-relaxed max-w-2xl">
            Tại đây, chị Trucdoan có toàn quyền chỉnh sửa trực tiếp Tên thật, đổi Gmail của nhân viên, cấp mã PIN số riêng biệt cho từng người. Khi các bạn Media truy cập, hệ thống bắt buộc phải khớp đúng mã PIN chị thiết lập thì mới mở khoá được không gian làm việc!
          </p>
        </div>
      </div>

      {actionError && (
        <div className="p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl text-xs font-bold text-rose-500 flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {actionSuccess && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl text-xs font-black text-emerald-600 flex items-center gap-2.5"
        >
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Add New Media Staff */}
        <div className="lg:col-span-4 bg-white rounded-[32px] border-2 border-orange-100 p-6 shadow-xl shadow-orange-100/5 space-y-5 h-fit">
          <div className="flex items-center gap-2.5 pb-3 border-b border-orange-50">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase">Cấp Tài Khoản Nhân Sự</h3>
              <p className="text-[10px] text-slate-400 font-bold">Thêm bạn Media mới ngay lập tức</p>
            </div>
          </div>

          <form onSubmit={handleAddStaff} className="space-y-4 font-sans">
            
            {/* Input Name */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-700 uppercase block">
                👤 Tên Thật Bạn Nhân Sự (Media):
              </label>
              <input
                type="text"
                required
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                placeholder="Ví dụ: Quỳnh Quỳnh, Vy Vy, Hoa... "
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-400 rounded-xl p-3 text-xs font-bold outline-none transition-all text-slate-800"
              />
            </div>

            {/* Input Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-700 uppercase block">
                📧 Địa chỉ Gmail (Dùng đăng nhập):
              </label>
              <input
                type="email"
                required
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                placeholder="Ví dụ: quynh@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-400 rounded-xl p-3 text-xs font-bold outline-none transition-all text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Input PIN */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-700 uppercase block">
                  🔑 Cấp PIN số:
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={newStaffPin}
                  onChange={(e) => setNewStaffPin(e.target.value.replace(/\D/g, ""))}
                  placeholder="Ví dụ: 1999"
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-400 rounded-xl p-3 text-center text-xs font-black outline-none tracking-widest transition-all text-slate-800"
                />
              </div>

              {/* Assign Default Store */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-700 uppercase block">
                  🏬 Thuộc Shop:
                </label>
                <select
                  value={newStaffStoreId}
                  onChange={(e) => setNewStaffStoreId(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-orange-400 rounded-xl p-3 text-xs font-bold outline-none transition-all cursor-pointer text-slate-700"
                >
                  {allStores.map(s => (
                    <option key={s.id} value={s.id}>Shop {s.id}: {s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
              *Sau khi thêm, bạn Media có thể bấm vào tên của mình trên màn hình chính và gõ đúng mã PIN này để vào việc ngay.
            </p>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-black py-3 rounded-full text-xs uppercase tracking-wider shadow-md active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Lưu & Cấp Tài Khoản
            </button>
          </form>
        </div>

        {/* Right Column: Listing Personnel, supports Direct Editing IN-PLACE */}
        <div className="lg:col-span-8 bg-white rounded-[32px] border-2 border-orange-100 p-6 shadow-xl shadow-orange-100/5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-orange-50 gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase">Danh Sách Tài Khoản & Sắp Xếp PIN Đăng Nhập</h3>
                <p className="text-[10px] text-slate-400 font-bold">Chỉnh sửa trực tiếp trên từng hàng và lưu tức thì</p>
              </div>
            </div>
            
            <span className="text-[10px] bg-slate-100 text-slate-500 font-black px-2.5 py-1 rounded-md">
              Tổng số tinh hoa nhân vật: {users.length} người
            </span>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {users.map((u, index) => {
              const isAdmin = u.role === "admin";
              return (
                <div 
                  key={u.email}
                  className={`border-2 rounded-[24px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isAdmin 
                      ? "bg-orange-50/20 border-orange-200/80 shadow-md shadow-orange-50/10" 
                      : "bg-slate-50/70 border-slate-150 hover:bg-slate-50 hover:border-orange-100"
                  }`}
                >
                  {/* Left block Info fields */}
                  <div className="space-y-3.5 flex-1 select-none font-sans">
                    
                    {/* Identification block */}
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans font-black ${
                        isAdmin ? "bg-orange-500 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-xs text-slate-850">
                            {isAdmin ? "👑 Chủ sở hữu (Boss):" : "👩 Nhân sự Media:"}
                          </span>
                          
                          {isAdmin ? (
                            <span className="text-[8px] bg-orange-100 text-orange-600 font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0">FOUNDER</span>
                          ) : (
                            <span className="text-[8px] bg-sky-100 text-sky-600 font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider shrink-0">MEDIA STAFF</span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-slate-400 font-semibold truncate mt-0.5">{u.email}</p>
                      </div>
                    </div>

                    {/* Editor Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      
                      {/* Name editing field */}
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 font-black uppercase">Sửa Tên Hiển Thị:</span>
                        <input
                          type="text"
                          value={u.name}
                          onChange={(e) => handleUpdateField(index, "name", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-black text-slate-800 outline-none focus:border-orange-400 focus:bg-white"
                        />
                      </div>

                      {/* Email editing field */}
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 font-black uppercase">Sửa Gmail Đăng Nhập:</span>
                        <input
                          type="email"
                          value={u.email}
                          onChange={(e) => handleUpdateField(index, "email", e.target.value)}
                          disabled={isAdmin} // Protect founder's core login email
                          className={`w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none focus:border-orange-400 ${
                            isAdmin ? "bg-slate-100 cursor-not-allowed opacity-75" : ""
                          }`}
                        />
                      </div>

                      {/* PIN editing field */}
                      <div className="space-y-0.5">
                        <span className="text-[9px] text-slate-400 font-black uppercase flex items-center gap-1">
                          <KeyRound className="w-2.5 h-2.5 text-orange-500" />
                          Sửa PIN Bảo Mật:
                        </span>
                        <input
                          type="text"
                          maxLength={6}
                          value={u.pin}
                          onChange={(e) => handleUpdateField(index, "pin", e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-black text-center text-slate-850 tracking-widest outline-none focus:border-orange-400"
                        />
                      </div>

                    </div>

                    {!isAdmin && (
                      <div className="flex items-center gap-2 text-[10.5px] font-sans">
                        <span className="text-slate-400 font-semibold">Cửa hàng/Kênh video chịu trách nhiệm:</span>
                        <select
                          value={u.storeId || 1}
                          onChange={(e) => handleUpdateField(index, "storeId", parseInt(e.target.value))}
                          className="bg-white border border-slate-200 rounded-md py-0.5 px-2 text-[10.5px] font-black text-slate-700 cursor-pointer focus:border-orange-400 focus:outline-none"
                        >
                          {allStores.map(s => (
                            <option key={s.id} value={s.id}>Shop {s.id}: {s.name} ({s.creator})</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Right side Actions block (such as delete) */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 min-w-[100px]">
                    <div className="text-center select-none hidden md:block">
                      <p className="text-[9px] text-slate-450 font-black uppercase">Đăng nhập</p>
                      <p className="text-[11px] font-black text-orange-500 tracking-wider font-sans">{u.pin}</p>
                    </div>

                    {!isAdmin ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u.email, u.name)}
                        className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        Xóa Nick
                      </button>
                    ) : (
                      <span className="text-[9px] text-slate-400 font-bold leading-none hidden md:block select-none">
                        Tài khoản Bảo vệ
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
}
