'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './TextSection.module.css'

gsap.registerPlugin(SplitText, ScrollTrigger)

export const TextSection = () => {
	const sectionRef = useRef<HTMLElement>(null)
	const paragraphRef = useRef<HTMLParagraphElement>(null)

	useEffect(() => {
		const ctx = gsap.context(() => {
			if (!paragraphRef.current) return

			const split = new SplitText(paragraphRef.current, {
				type: 'chars,words,lines',
				charsClass: 'split-char',
				wordsClass: 'split-word',
				linesClass: 'split-line',
			})

			gsap.set(split.words, { display: 'inline-block' })
			gsap.set(split.lines, { overflow: 'hidden' })
			gsap.set(split.chars, { color: '#3c245e', force3D: true })

			gsap
				.timeline({
					scrollTrigger: {
						trigger: sectionRef.current,
						start: 'top top',
						end: '+=250vh',
						pin: true,

						scrub: 1.2,
						anticipatePin: 1,
						invalidateOnRefresh: true,
					},
				})
				.to(split.chars, {
					color: '#f5efff',
					stagger: 0.1,
					ease: 'none',
				})
		})

		const handleResize = () => ScrollTrigger.refresh()
		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			ctx.revert()
		}
	}, [])

	return (
		<section ref={sectionRef} className={styles.textSection}>
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<p ref={paragraphRef}>
						We specialize in delivering holistic solutions from strategic
						content planning and captivating design to cutting edge development
						and dynamic marketing to ensure every aspect of your business is
						built for success.
					</p>
				</div>
			</div>
		</section>
	)
}
