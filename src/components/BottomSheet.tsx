"use client"

import { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "./ui/button"
import { CloseIcon } from "./Icons"

type BottomSheetProps = {
 isOpen: boolean
 onClose: () => void
 children: ReactNode
}

export function BottomSheet({
 isOpen,
 onClose,
 children
}: BottomSheetProps) {
 return (
  <AnimatePresence>
   {isOpen && (
    <motion.div
     initial={{ y: "100%" }}
     animate={{ y: 0 }}
     exit={{ y: "100%" }}
     transition={{ type: "spring", stiffness: 300, damping: 30 }}
     className="fixed bottom-0 left-0 right-0 h-full w-full bg-background p-4 z-50"
    >
     <div className="flex items-center justify-end">
      <Button
       type="button"
       variant="ghost"
       size="icon"
       aria-label="Close sheet"
       onClick={onClose}
       className="rounded-full"
      >
       <CloseIcon className="size-6" />
      </Button>
     </div>
     {children}
    </motion.div>
   )}
  </AnimatePresence>
 )
}