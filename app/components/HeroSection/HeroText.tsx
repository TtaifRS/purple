'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

import styles from './HeroText.module.css'

if (typeof window !== 'undefined') {
	gsap.registerPlugin(SplitText)
}

interface HeroTextProps {
	isShaderReady?: boolean
	isPreloaderAnimationComplete?: boolean
}

const HeroText = ({
	isShaderReady = false,
	isPreloaderAnimationComplete = false,
}: HeroTextProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
	const splitTextInstances = useRef<SplitText[]>([])
	const timelineRef = useRef<gsap.core.Timeline | null>(null)

	useEffect(() => {
		if (!isShaderReady || !isPreloaderAnimationComplete) {
			return
		}

		const words = wordRefs.current.filter(Boolean) as HTMLSpanElement[]
		if (words.length === 0) return

		words.forEach((word) => {
			word.style.visibility = 'visible'
		})

		splitTextInstances.current.forEach((instance) => instance.revert?.())
		splitTextInstances.current = []

		words.forEach((word, index) => {
			const split = new SplitText(word, {
				type: 'chars',
				charsClass: `char-${index}`,
			})
			splitTextInstances.current.push(split)

			gsap.set(split.chars, {
				autoAlpha: 0,
				x: -20,
				scale: 1.1,
				rotationY: 90,
				transformOrigin: '0% 50%',
			})
		})

		const tl = gsap.timeline()
		timelineRef.current = tl

		splitTextInstances.current.forEach((split, wordIndex) => {
			const startTime = wordIndex === 0 ? 0 : 0.5 * wordIndex

			tl.to(
				split.chars,
				{
					autoAlpha: 1,
					x: 0,
					scale: 1,
					rotationY: 0,
					stagger: { each: 0.04, from: 'start' },
					duration: 0.7,
					ease: 'power3.out',
				},
				startTime
			)
		})

		return () => {
			tl.kill()
			splitTextInstances.current.forEach((instance) => instance.revert?.())
			splitTextInstances.current = []
		}
	}, [isShaderReady, isPreloaderAnimationComplete])

	const setWordRef = (index: number) => (el: HTMLSpanElement | null) => {
		wordRefs.current[index] = el
	}

	return (
		<div ref={containerRef} className={styles.container}>
			<h1 className={styles.heroHeading}>
				<span ref={setWordRef(0)} className={styles.word}>
					creativity,
				</span>

				<span ref={setWordRef(1)} className={styles.word}>
					precision,
				</span>

				<span ref={setWordRef(2)} className={styles.word}>
					results
				</span>
			</h1>
		</div>
	)
}

export default HeroText
