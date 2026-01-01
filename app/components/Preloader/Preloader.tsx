// components/Preloader.tsx
'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { usePreloadCriticalAssets } from '@/hooks/usePreloadCriticalAssets'
import styles from './Preloader.module.css'

export function Preloader() {
	const { progress, isLoaded } = usePreloadCriticalAssets()
	const counterRef = useRef<HTMLHeadingElement>(null)
	const overlayRef = useRef<HTMLDivElement>(null)

	// Slower, more elegant count-up + entrance
	useEffect(() => {
		if (!counterRef.current) return

		// Soft reveal
		gsap.to(counterRef.current, {
			opacity: 1,
			scale: 1,
			duration: 1.8,
			ease: 'power3.out',
		})

		// Significantly slower count-up for premium feel
		gsap.to(counterRef.current, {
			innerText: progress,
			duration: 3.2, // Increased from 1.8 → much more deliberate
			ease: 'power2.out',
			snap: { innerText: 1 },
			onUpdate: () => {
				if (counterRef.current) {
					counterRef.current.innerText = Math.round(
						Number(counterRef.current.innerText)
					).toString()
				}
			},
		})
	}, [progress])

	// Longer pause at 100, then cinematic slide-up
	useEffect(() => {
		if (isLoaded && overlayRef.current && counterRef.current) {
			const tl = gsap.timeline()

			// Subtle "breathe" on the final 100 — adds life
			tl.to(counterRef.current, {
				scale: 1.06,
				duration: 1.0,
				ease: 'power2.inOut',
			})

			// Long dramatic hold on "100"
			tl.to({}, { duration: 1.2 }) // 1.2 second pause — pure tension

			// Powerful, smooth slide-up exit
			tl.to(
				overlayRef.current,
				{
					y: '-100%',
					duration: 1.8,
					ease: 'power4.inOut',
				},
				'-=0.8'
			) // Slight overlap for momentum

			tl.eventCallback('onComplete', () => {
				if (overlayRef.current) {
					overlayRef.current.style.display = 'none'
				}
			})
		}
	}, [isLoaded])

	return (
		<div ref={overlayRef} className={styles.overlay}>
			<h1 ref={counterRef} className={styles.counter}>
				0
			</h1>
		</div>
	)
}
