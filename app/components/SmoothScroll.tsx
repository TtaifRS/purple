'use client'

import { useEffect, useRef, ReactNode } from 'react'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

interface SmoothScrollProps {
	children: ReactNode
}

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: SmoothScrollProps) {
	const lenisRef = useRef<Lenis | null>(null)

	useEffect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			touchMultiplier: 2,
			smoothWheel: true,
		})

		lenisRef.current = lenis

		// Sync scroll events
		lenis.on('scroll', () => ScrollTrigger.update())

		// Sync RAF (critical for smooth pinning)
		const raf = (time: number) => {
			lenis.raf(time * 1000)
		}
		gsap.ticker.add(raf)
		gsap.ticker.lagSmoothing(0)

		// scrollerProxy – target 'body' (most reliable with Lenis in Next.js)
		ScrollTrigger.scrollerProxy('body', {
			scrollTop(value) {
				if (arguments.length) {
					lenis.scrollTo(value as number, { immediate: true })
				}
				return lenis.scroll // virtual scroll position
			},
			getBoundingClientRect() {
				return {
					top: 0,
					left: 0,
					width: window.innerWidth,
					height: window.innerHeight,
				}
			},
			pinType: 'transform', // Lenis uses transform
			fixedMarkers: false, // helps avoid marker glitches
		})

		// Force multiple refreshes for safety in Next.js
		ScrollTrigger.refresh()
		setTimeout(() => ScrollTrigger.refresh(), 100)

		// Optional: refresh on resize/orientation change
		const handleResize = () => ScrollTrigger.refresh()
		window.addEventListener('resize', handleResize)
		window.addEventListener('orientationchange', handleResize)

		return () => {
			gsap.ticker.remove(raf)
			lenis.destroy()
			window.removeEventListener('resize', handleResize)
			window.removeEventListener('orientationchange', handleResize)
		}
	}, [])

	return <>{children}</>
}
