"use client";

import { useEffect, useState } from "react";
import { User, Shield, Calendar, ArrowLeft, Edit2, Check, X, AtSign, ShoppingBag, Receipt, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface ProfileData {
  id: number;
  name: string;
  username: string;
  role: string;
  createdAt: string;
}

interface OrderHistory {
  id: number;
  username: string;
  userId: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface OrderDetailItem {
  id: number;
  orderId: number;
  menuId: number;
  quantity: number;
  price: number;
  menu: {
    id: number;
    name: string;
    category: string;
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [orders, setOrders] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: "", username: "" });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailItem[]>([]);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }

      const [profileRes, ordersRes] = await Promise.all([
        fetch("https://ukael-sama-abebeye-production.up.railway.app/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }),
        fetch("https://ukael-sama-abebeye-production.up.railway.app/order", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })
      ]);

      const profileData = await profileRes.json();
      const ordersData = await ordersRes.json();

      if (profileRes.ok && profileData.statusCode === 200) {
        setProfile(profileData.data);
        setFormData({ name: profileData.data.name, username: profileData.data.username });
      } else {
        toast.error(profileData.message || "Gagal mengambil data profil.");
      }

      if (ordersRes.ok) {
        const actualOrders = Array.isArray(ordersData) ? ordersData : ordersData.data || [];
        setOrders(actualOrders);
      } else {
        toast.error("Gagal memuat riwayat pesanan.");
      }

    } catch (err) {
      console.error(err);
      toast.error("Terjadi kesalahan jaringan atau server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDetail = async (order: OrderHistory) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setLoadingDetail(true);
    setOrderDetails([]);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`https://ukael-sama-abebeye-production.up.railway.app/order-detail/${order.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const resData = await response.json();

      if (response.ok) {
        const actualDetails = Array.isArray(resData) ? resData : resData.data || [];
        setOrderDetails(actualDetails);
      } else {
        toast.error(resData.message || "Gagal mengambil detail pesanan.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghubungi server untuk memuat detail.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading("Sedang menyimpan perubahan profil...");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://ukael-sama-abebeye-production.up.railway.app/user/profile/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
        }),
      });

      const resData = await response.json();

      if (response.ok && resData.statusCode === 200) {
        setProfile(resData.data); 
        setIsEditing(false); 
        toast.success("Profil Anda berhasil diperbarui!", { id: toastId });
      } else {
        toast.error(resData.message || "Gagal memperbarui profil.", { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghubungi server.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(number);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4 px-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-blue-900 rounded-full animate-spin" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-500 text-center animate-pulse">
          Memuat data profil & transaksi...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-16 space-y-6 sm:space-y-8">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Navigasi Back */}
      <div>
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Dashboard
        </button>
      </div>

      {/* Card Wrapper Utama (Profil) */}
      <form 
        onSubmit={handleSaveChanges} 
        className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden"
      >
        <div className="h-28 sm:h-40 bg-gradient-to-r from-[#001B54] via-[#0b2b6e] to-blue-900 relative" />

        <div className="px-4 sm:px-12 pb-8 sm:pb-12 relative">
          {/* Avatar adjustment for mobile */}
          <div className="absolute -top-12 sm:auto sm:-top-16 left-4 sm:left-12">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-200 text-slate-900 border-4 border-white flex items-center justify-center text-2xl sm:text-4xl font-extrabold shadow-md sm:shadow-xl select-none">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          <div className="pt-12 sm:pt-20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight break-words">{profile?.name}</h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5 flex items-center gap-0.5">
                <AtSign size={14} className="text-slate-400 shrink-0" />
                <span className="break-all">{profile?.username}</span>
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-md transition-all duration-200 active:scale-95"
                >
                  <Edit2 size={14} />
                  Edit Profil
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ name: profile?.name || "", username: profile?.username || "" });
                    }}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl border border-slate-200/60 transition-all"
                  >
                    <X size={15} />
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-md transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check size={15} />
                    )}
                    {isSaving ? "Simpan..." : "Simpan"}
                  </button>
                </div>
              )}

              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-extrabold tracking-wider uppercase border ${
                profile?.role === "ADMIN" 
                  ? "bg-amber-50 text-amber-700 border-amber-200/50" 
                  : "bg-blue-50 text-blue-700 border-blue-200/50"
              }`}>
                <Shield size={12} className="stroke-[2.5]" />
                {profile?.role}
              </span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-slate-100 my-6 sm:my-10" />

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex flex-col gap-1.5 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50/60 border border-slate-100">
              <label className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <User size={14} className="text-slate-400" /> Nama Lengkap
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs sm:text-sm font-semibold bg-white text-slate-800 border border-slate-200 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              ) : (
                <p className="text-xs sm:text-sm font-bold text-slate-800 px-1 py-1">{profile?.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50/60 border border-slate-100">
              <label className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <AtSign size={14} className="text-slate-400" /> Username Akun
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full text-xs sm:text-sm font-semibold bg-white text-slate-800 border border-slate-200 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              ) : (
                <p className="text-xs sm:text-sm font-bold text-slate-800 px-1 py-1 break-all">@{profile?.username}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-100/40 border border-slate-100/80 opacity-80 select-none">
              <label className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <Shield size={14} className="text-slate-400" /> Hak Akses / Role
              </label>
              <p className="text-xs sm:text-sm font-bold text-slate-600 px-1 py-1">{profile?.role}</p>
            </div>

            <div className="flex flex-col gap-1.5 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-100/40 border border-slate-100/80 opacity-80 select-none">
              <label className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" /> Bergabung Sejak
              </label>
              <p className="text-xs sm:text-sm font-bold text-slate-600 px-1 py-1">
                {profile?.createdAt ? formatDate(profile.createdAt).split(" pukul")[0] : "-"}
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* SECTION: HISTORY PESANAN */}
      <div className="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-200/60 p-4 sm:p-10 space-y-4 sm:space-y-6">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-900 rounded-xl shrink-0">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Riwayat Pemesanan</h2>
            <p className="text-xs font-medium text-slate-400">Klik baris pesanan atau tombol aksi untuk melihat detail item</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
            <Receipt className="mx-auto text-slate-300 mb-3 animate-pulse" size={40} />
            <p className="text-sm font-bold text-slate-500">Belum Ada Riwayat Pemesanan</p>
            <p className="text-xs text-slate-400 mt-1">Pesanan Anda akan muncul di sini setelah bertransaksi.</p>
          </div>
        ) : (
          <>
            {/* TAMPILAN DESKTOP (TABLE MODE) */}
            <div className="hidden md:block overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                    <th className="py-4 px-6">ID Pesanan</th>
                    <th className="py-4 px-6">Tanggal Transaksi</th>
                    <th className="py-4 px-6 text-right">Total Harga</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
                  {orders.map((order) => (
                    <tr 
                      key={order.id} 
                      onClick={() => handleOpenDetail(order)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      <td className="py-4 px-6 font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                        #{order.id}
                      </td>
                      <td className="py-4 px-6 text-slate-500 text-xs">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-6 text-right font-extrabold text-blue-950">
                        {formatRupiah(order.totalPrice)}
                      </td>
                      <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(order)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
                        >
                          <Eye size={14} className="text-blue-600" />
                          Cek Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* TAMPILAN MOBILE (CARD LIST MODE) */}
            <div className="block md:hidden space-y-3">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  onClick={() => handleOpenDetail(order)}
                  className="bg-slate-50/50 border border-slate-100 p-4 rounded-xl space-y-3 active:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-black text-slate-900">#{order.id}</span>
                    <span className="text-sm font-extrabold text-blue-950">{formatRupiah(order.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] text-slate-400 font-medium">{formatDate(order.createdAt)}</span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg"
                    >
                      <Eye size={12} />
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- POP-UP MODAL: DETAIL RIWAYAT ITEM MENU --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-slate-100 w-full max-w-xl shadow-2xl p-5 sm:p-8 space-y-4 sm:space-y-6 overflow-hidden max-h-[85vh] sm:max-h-[90vh] flex flex-col">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">Detail Pesanan #{selectedOrder?.id}</h3>
                <p className="text-[11px] sm:text-xs font-medium text-slate-400 mt-0.5">
                  {selectedOrder?.createdAt ? formatDate(selectedOrder.createdAt) : ""}
                </p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Konten Utama Detail Item */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-3 my-1">
              {loadingDetail ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-8 h-8 border-4 border-slate-100 border-t-blue-900 rounded-full animate-spin" />
                  <p className="text-xs font-bold text-slate-400">Mengambil daftar menu...</p>
                </div>
              ) : orderDetails.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-medium">
                  Tidak ada item menu ditemukan atau Anda tidak memiliki hak akses detail.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50/40">
                  {orderDetails.map((item) => (
                    <div key={item.id} className="p-3 sm:p-4 flex items-center justify-between bg-white gap-4">
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.menu?.name || "Menu Terhapus"}</p>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="text-[9px] sm:text-xxs font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wide shrink-0">
                            {item.menu?.category || "UMUM"}
                          </span>
                          <p className="text-[11px] sm:text-xs text-slate-400">
                            {formatRupiah(item.price)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm font-black text-slate-800 shrink-0">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Modal Ringkasan Harga */}
            <div className="border-t border-slate-100 pt-3 sm:pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-500">Total Pembayaran</span>
                <span className="text-lg sm:text-xl font-black text-blue-950">
                  {selectedOrder ? formatRupiah(selectedOrder.totalPrice) : "Rp0"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2.5 sm:py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-xl sm:rounded-2xl shadow-md transition-all"
              >
                Tutup Detail
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}