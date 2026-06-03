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

// Interface baru untuk detail item pesanan sesuai dengan image_483d69.png
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

  // State untuk fitur Edit Profile
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: "", username: "" });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // State Baru untuk Fitur Modal Detail Pesanan
  const [selectedOrder, setSelectedOrder] = useState<OrderHistory | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailItem[]>([]);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // 1. Fetch Profile & List Order
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

  // 2. Fetch Detail Pesanan Saat Baris/Tombol Diklik (GET /order-detail/{orderId})
  const handleOpenDetail = async (order: OrderHistory) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setLoadingDetail(true);
    setOrderDetails([]); // Reset detail sebelumnya

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
        // Menyesuaikan struktur array langsung atau objek bersarang .data
        const actualDetails = Array.isArray(resData) ? resData : resData.data || [];
        setOrderDetails(actualDetails);
      } else {
        toast.error(resData.message || "Gagal mengambil detail pesanan. Pastikan akun Anda memiliki hak akses.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghubungi server untuk memuat detail.");
    } finally {
      setLoadingDetail(false);
    }
  };

  // 3. Simpan Perubahan Profil
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
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-blue-900 rounded-full animate-spin" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-500 animate-pulse">
          Memuat data profil & transaksi...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-16 space-y-8">
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
        className="bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200/60 overflow-hidden"
      >
        <div className="h-40 bg-gradient-to-r from-[#001B54] via-[#0b2b6e] to-blue-900 relative" />

        <div className="px-6 sm:px-12 pb-12 relative">
          <div className="absolute -top-16 left-6 sm:left-12">
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-200 text-slate-900 border-4 border-white flex items-center justify-center text-4xl font-extrabold shadow-xl select-none">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          <div className="pt-16 sm:pt-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{profile?.name}</h1>
              <p className="text-sm font-medium text-slate-500 mt-0.5 flex items-center gap-0.5">
                <AtSign size={14} className="text-slate-400" />
                {profile?.username}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-2xl shadow-md transition-all duration-200 active:scale-95"
                >
                  <Edit2 size={14} />
                  Edit Profil
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ name: profile?.name || "", username: profile?.username || "" });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold rounded-2xl border border-slate-200/60 transition-all"
                  >
                    <X size={15} />
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-2xl shadow-md shadow-emerald-600/10 transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check size={15} />
                    )}
                    {isSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              )}

              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-extrabold tracking-wider uppercase border ${
                profile?.role === "ADMIN" 
                  ? "bg-amber-50 text-amber-700 border-amber-200/50" 
                  : "bg-blue-50 text-blue-700 border-blue-200/50"
              }`}>
                <Shield size={12} className="stroke-[2.5]" />
                {profile?.role}
              </span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-slate-100 my-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-50/60 border border-slate-100">
              <label className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <User size={14} className="text-slate-400" /> Nama Lengkap
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm font-semibold bg-white text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              ) : (
                <p className="text-sm font-bold text-slate-800 px-1 py-1.5">{profile?.name}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-50/60 border border-slate-100">
              <label className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <AtSign size={14} className="text-slate-400" /> Username Akun
              </label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full text-sm font-semibold bg-white text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              ) : (
                <p className="text-sm font-bold text-slate-800 px-1 py-1.5">@{profile?.username}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-100/40 border border-slate-100/80 opacity-80 select-none">
              <label className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <Shield size={14} className="text-slate-400" /> Hak Akses / Role
              </label>
              <p className="text-sm font-bold text-slate-600 px-1 py-1.5">{profile?.role}</p>
            </div>

            <div className="flex flex-col gap-2 p-5 rounded-2xl bg-slate-100/40 border border-slate-100/80 opacity-80 select-none">
              <label className="text-xs font-bold text-slate-400 tracking-widest uppercase flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" /> Bergabung Sejak
              </label>
              <p className="text-sm font-bold text-slate-600 px-1 py-1.5">
                {profile?.createdAt ? formatDate(profile.createdAt).split(" pukul")[0] : "-"}
              </p>
            </div>
          </div>
        </div>
      </form>

      {/* SECTION: HISTORY PESANAN */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200/60 p-6 sm:p-10 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-900 rounded-xl">
            <ShoppingBag size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Riwayat Pemesanan</h2>
            <p className="text-xs font-medium text-slate-400">Klik baris pesanan atau tombol aksi untuk melihat detail item yang dibeli</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
            <Receipt className="mx-auto text-slate-300 mb-3 animate-pulse" size={40} />
            <p className="text-sm font-bold text-slate-500">Belum Ada Riwayat Pemesanan</p>
            <p className="text-xs text-slate-400 mt-1">Pesanan Anda akan muncul di sini setelah bertransaksi.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
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
                    {/* Menghentikan bubbling klik row agar trigger modal dari tombol terisolasi dengan baik */}
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
        )}
      </div>

      {/* --- POP-UP MODAL: DETAIL RIWAYAT ITEM MENU --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-100 w-full max-w-xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Detail Pesanan #{selectedOrder?.id}</h3>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
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
            <div className="overflow-y-auto flex-1 pr-1 space-y-4 my-2">
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
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/40">
                  {orderDetails.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between bg-white">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-900">{item.menu?.name || "Menu Terhapus"}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xxs font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-wide">
                            {item.menu?.category || "UMUM"}
                          </span>
                          <p className="text-xs text-slate-400">
                            {formatRupiah(item.price)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-black text-slate-800">
                        {formatRupiah(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Modal Ringkasan Harga */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-slate-500">Total Pembayaran</span>
                <span className="text-xl font-black text-blue-950">
                  {selectedOrder ? formatRupiah(selectedOrder.totalPrice) : "Rp0"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-2xl shadow-md transition-all active:scale-[0.98]"
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