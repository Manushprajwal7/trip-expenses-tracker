"use client"

import React from 'react'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export const WavyBackground = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const drawWave = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, 'rgba(96, 165, 250, 0.5)')  // Light blue
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.5)')  // Darker blue

      ctx.fillStyle = gradient

      const wave = (x: number, time: number) => {
        return Math.sin(x * 0.01 + time * 0.002) * 50
      }

      ctx.beginPath()
      ctx.moveTo(0, canvas.height)

      for (let x = 0; x < canvas.width; x++) {
        ctx.lineTo(x, canvas.height - wave(x, time) - 50)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.closePath()
      ctx.fill()

      animationFrameId = requestAnimationFrame(() => drawWave(time + 1))
    }

    resizeCanvas()
    drawWave(0)

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
    </motion.div>
  )
}

