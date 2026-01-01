'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import styles from './TeamHeading.module.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function TeamHeading() {
	const sectionRef = useRef<HTMLElement>(null)
	const headingRef = useRef<HTMLHeadingElement>(null)
	const triggerRef = useRef<ScrollTrigger | null>(null)
	const splitTextRef = useRef<SplitText | null>(null)

	useEffect(() => {
		if (!headingRef.current || !sectionRef.current) return

		// Cleanup previous
		if (triggerRef.current) triggerRef.current.kill()
		if (splitTextRef.current) splitTextRef.current.revert()

		// Same split as original
		splitTextRef.current = new SplitText(headingRef.current, {
			type: 'words,chars',
			wordsClass: styles.word,
			charsClass: styles.char,
		})

		const chars = splitTextRef.current.chars

		// Initial hidden state (same as original)
		gsap.set(chars, { y: 100, opacity: 0 })

		// Timeline
		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: sectionRef.current,
				start: 'top top',
				end: '+=1000', // Same as original
				scrub: 1.5, // Same as original
				pin: true,
				anticipatePin: 1,
				markers: false,
				invalidateOnRefresh: true,
			},
		})

		// 1. EXACT same entrance animation as original
		tl.to(chars, {
			y: 0,
			opacity: 1,
			duration: 1,
			stagger: 0.03,
			ease: 'power3.out',
		})

		// Brief hold after full reveal
		tl.to({}, { duration: 0.5 })

		// 2. REVERSE exit: characters go back down in reverse order
		tl.to(chars, {
			y: 100, // Back to original hidden position (down)
			opacity: 0,
			duration: 1.5, // Same duration
			stagger: {
				from: 'end', // Reverse order (last char first)
				amount: 0.03 * (chars.length - 1), // Matches original stagger timing
			},
			ease: 'power3.in', // Natural reverse of power3.out
		})

		triggerRef.current = tl.scrollTrigger!

		// Resize handler
		const handleResize = () => {
			setTimeout(() => ScrollTrigger.refresh(), 250)
		}
		window.addEventListener('resize', handleResize)

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize)
			if (triggerRef.current) triggerRef.current.kill()
			if (splitTextRef.current) splitTextRef.current.revert()
			ScrollTrigger.getAll().forEach((t) => t.kill())
		}
	}, [])

	return (
		<section ref={sectionRef} className={styles.section}>
			<h2 ref={headingRef} className={styles.heading}>
				Meet Our Creative Minds
			</h2>
		</section>
	)
}
