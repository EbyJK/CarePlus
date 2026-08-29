import * as React from "react"
import { cn } from "@/lib/utils"

const Dialog = ({ open, onClose, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  )
}

export { Dialog }
