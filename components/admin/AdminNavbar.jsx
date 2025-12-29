'use client'
import { useUser ,UserButton} from "@clerk/nextjs"
import Link from "next/link"

const AdminNavbar = () => {

const {user}=useUser();

    return (
        <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
            <Link href="/" className="relative text-4xl font-semibold text-slate-700">
                <span style={{
                        background: "linear-gradient(135deg, #C9A24D, #F2D98D)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}>shop</span>ora<span style={{
                        background: "linear-gradient(135deg, #C9A24D, #F2D98D)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }} className="text-5xl leading-0">.</span>
                   <p
                    className="absolute text-xs font-bold -top-1 -right-13 px-3 py-0.5 rounded-full flex items-center gap-2 bg-slate-700"
                    style={{
                        backgroundImage: "linear-gradient(135deg, #C9A24D, #F2D98D)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                    >
                    Admin
                    </p>
            </Link>
            <div className="flex items-center gap-3">
                <p>Hi,{user?.firstName}</p>
                <UserButton />
            </div>
        </div>
    )
}

export default AdminNavbar