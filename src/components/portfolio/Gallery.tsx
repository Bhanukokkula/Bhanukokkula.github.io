'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface GalleryImage {
  src: string
  width: number
  height: number
}

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (images.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setOpenIndex(i)}
            className="relative rounded-lg overflow-hidden border border-cream-200 dark:border-neutral-800 aspect-[4/3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            aria-label={`Open image ${i + 1} of ${images.length}`}
          >
            <Image
              src={img.src}
              alt=""
              fill
              sizes="(max-width: 640px) 50vw, 240px"
              className="object-cover hover:opacity-80 transition-opacity"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
            onClick={() => setOpenIndex(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              onClick={() => setOpenIndex(null)}
              aria-label="Close image"
              className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
            >
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[85vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[openIndex].src}
                alt=""
                width={images[openIndex].width}
                height={images[openIndex].height}
                sizes="90vw"
                style={{ width: '100%', height: 'auto', maxHeight: '85vh', objectFit: 'contain' }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
