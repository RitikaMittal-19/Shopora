'use client'

import { useEffect, useState } from "react"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"
import axios from "axios"
import { useUser } from "@clerk/nextjs"

export default function AdminCoupons() {
  const { isLoaded, user } = useUser()

  const [coupons, setCoupons] = useState([])
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    description: "",
    discount: "",
    forNewUser: false,
    forMember: false,
    isPublic: false,
    expiresAt: format(new Date(), "yyyy-MM-dd"),
  })

  /* ================= FETCH ================= */
  const fetchCoupons = async () => {
    const { data } = await axios.get("/api/admin/coupon")
    setCoupons(data.coupons)
  }

  useEffect(() => {
    if (isLoaded && user) fetchCoupons()
  }, [isLoaded, user])

  /* ================= ADD ================= */
  const handleAddCoupon = async () => {
    const payload = {
      ...newCoupon,
      code: newCoupon.code.toUpperCase(),
      discount: Number(newCoupon.discount),
      expiresAt: new Date(newCoupon.expiresAt),
    }

    await axios.post("/api/admin/coupon", { coupon: payload })

    setNewCoupon({
      code: "",
      description: "",
      discount: "",
      forNewUser: false,
      forMember: false,
      isPublic: false,
      expiresAt: format(new Date(), "yyyy-MM-dd"),
    })

    await fetchCoupons()
  }

  /* ================= DELETE ================= */
  const deleteCoupon = async (code) => {
    if (!confirm("Delete this coupon?")) return
    await axios.delete(`/api/admin/coupon?code=${code}`)
    await fetchCoupons()
  }

  /* ================= UI ================= */
  return (
    <div className="text-slate-500 mb-40">

      {/* ADD */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          toast.promise(handleAddCoupon(), {
            loading: "Adding coupon...",
            success: "Coupon added successfully",
            error: "Failed to add coupon",
          })
        }}
        className="max-w-sm"
      >
        <h2 className="text-2xl">
          Add <span className="text-slate-800 font-medium">Coupons</span>
        </h2>

        <input
          value={newCoupon.code}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, code: e.target.value })
          }
          placeholder="Coupon Code"
          className="w-full mt-3 p-2 border rounded"
          required
        />

        <input
          type="number"
          min={1}
          max={100}
          value={newCoupon.discount}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, discount: e.target.value })
          }
          placeholder="Discount %"
          className="w-full mt-2 p-2 border rounded"
          required
        />

        <input
          value={newCoupon.description}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, description: e.target.value })
          }
          placeholder="Description"
          className="w-full mt-2 p-2 border rounded"
          required
        />

        <input
          type="date"
          value={newCoupon.expiresAt}
          onChange={(e) =>
            setNewCoupon({ ...newCoupon, expiresAt: e.target.value })
          }
          className="w-full mt-2 p-2 border rounded"
        />

      <div className="mt-5">
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" className="sr-only peer"
                                name="forNewUser" checked={newCoupon.forNewUser}
                                onChange={(e) => setNewCoupon({ ...newCoupon, forNewUser: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-slate-700 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>For New User</p>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                            <input type="checkbox" className="sr-only peer"
                                name="forMember" checked={newCoupon.forMember}
                                onChange={(e) => setNewCoupon({ ...newCoupon, forMember: e.target.checked })}
                            />
                            <div className="w-11 h-6 bg-slate-300 rounded-full peer peer-checked:bg-slate-700 transition-colors duration-200"></div>
                            <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                        <p>For Member</p>
                    </div>
                </div>


        <button className="mt-4 px-6 py-2 bg-slate-700 text-white rounded">
          Add Coupon
        </button>
      </form>

     {/* LIST */}
<div className="mt-14 max-w-5xl">
  <h2 className="text-2xl font-semibold text-slate-800 mb-4">
    Coupons
  </h2>

  <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
    <table className="w-full text-sm">
      <thead className="bg-slate-50 border-b">
        <tr className="text-slate-600">
          <th className="px-6 py-3 text-left font-medium">Code</th>
          <th className="px-6 py-3 text-center font-medium">Discount</th>
          <th className="px-6 py-3 text-center font-medium">Expires</th>
          <th className="py-3 px-4 text-left font-semibold text-slate-600">New User</th>
          <th className="py-3 px-4 text-left font-semibold text-slate-600">For Member</th>
          <th className="px-6 py-3 text-center font-medium">Action</th>
        </tr>
      </thead>

      <tbody>
        {coupons.length === 0 && (
          <tr>
            <td
              colSpan={4}
              className="px-6 py-10 text-center text-slate-400"
            >
              No coupons created yet
            </td>
          </tr>
        )}

        {coupons.map((c, index) => (
          <tr
            key={c.code}
            className={`border-b last:border-none ${
              index % 2 === 0 ? "bg-white" : "bg-slate-50"
            } hover:bg-slate-100 transition`}
          >
            <td className="px-6 py-4 font-semibold text-slate-800">
              {c.code}
            </td>

            <td className="px-6 py-4 text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-10 font-medium bg-[#C9A24D]/10" style={{ color: "#C9A24D" }}>
                {c.discount}%
              </span>
            </td>

            <td className="px-6 py-4 text-center text-slate-600">
              {format(new Date(c.expiresAt), "dd MMM yyyy")}
            </td>
            <td className="py-3 px-4 text-slate-800">{c.forNewUser ? 'Yes' : 'No'}</td>

            <td className="py-3 px-4 text-slate-800">{c.forMember ? 'Yes' : 'No'}</td>

            <td className="px-6 py-4 text-center">
              <button
                onClick={() =>
                  toast.promise(deleteCoupon(c.code), {
                    loading: "Deleting...",
                    success: "Coupon deleted",
                    error: "Delete failed",
                  })
                }
                className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-red-100 transition"
              >
                
                <Trash2 className="w-4 h-4 "style={{ color: "#C9A24D" }} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    </div>
  )
}