"use client"

import { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Close } from "./Icons"

type BottomSheetProps = {
 isOpen: boolean
 onClose: () => void
 children: ReactNode
}

export default function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
 return (
  <AnimatePresence>
   {isOpen && (
    <motion.div
     initial={{ y: "100%" }}
     animate={{ y: 0 }}
     exit={{ y: "100%" }}
     transition={{ type: "spring", stiffness: 300, damping: 30 }}
     className="fixed bottom-0 left-0 right-0 bg-white p-4 h-full z-50"
    >
     <div className="flex items-center justify-end">
      <button
       onClick={onClose}
       aria-label="Close"
       className="text-slate-800 p-2 rounded-full cursor-pointer transition hover:bg-slate-100"
      >
       <Close />
      </button>
     </div>
     {children}
    </motion.div>
   )}
  </AnimatePresence>
 )
}