'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import styles from './Service.module.css'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export const Service = () => {
	const sectionRef = useRef<HTMLElement>(null)
	const headerRef = useRef<HTMLHeadingElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const cardsRef = useRef<HTMLDivElement[]>([])
	const stRef = useRef<ScrollTrigger | null>(null)

	const setCardRef = (index: number) => (el: HTMLDivElement | null) => {
		if (el) cardsRef.current[index] = el
	}

	useGSAP(
		() => {
			if (stRef.current) {
				stRef.current.kill()
			}

			const mm = gsap.matchMedia()

			let isGapAnimationCompleted = false
			let isFlipAnimationCompleted = false

			mm.add('(max-width: 999px)', () => {
				gsap.killTweensOf([
					containerRef.current,
					headerRef.current,
					...cardsRef.current,
				])

				gsap.set(headerRef.current, {
					y: 40,
					opacity: 0,
				})

				gsap.set(cardsRef.current, {
					y: 80,
					opacity: 0,
					scale: 0.95,
					rotationY: 0,
					clearProps: 'all',
				})

				cardsRef.current.forEach((card, index) => {
					gsap.to(card, {
						rotationY: 180,
						duration: 1.2,
						scrollTrigger: {
							trigger: card,
							start: 'top 80%',
							end: 'top 30%',
							scrub: 1.5,
							once: false,
							toggleActions: 'play reverse play reverse',
						},
						ease: 'power3.inOut',
					})
				})

				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: sectionRef.current,
						start: 'top 85%',
						end: 'top 50%',
						scrub: 1,
						toggleActions: 'play reverse play reverse',
					},
				})

				tl.to(
					headerRef.current,
					{
						y: 0,
						opacity: 1,
						duration: 1,
						ease: 'power3.out',
					},
					0
				)

				tl.to(
					cardsRef.current,
					{
						y: 0,
						opacity: 1,
						scale: 1,
						duration: 1,
						stagger: 0.2,
						ease: 'power3.out',
					},
					0.2
				)

				if (tl.scrollTrigger) {
					stRef.current = tl.scrollTrigger
				}
			})

			mm.add('(min-width: 1000px)', () => {
				const st = ScrollTrigger.create({
					trigger: sectionRef.current,
					start: '20vh top',
					end: `+=${window.innerHeight * 4}`,
					pin: true,
					pinSpacing: true,
					scrub: 1,
					refreshPriority: 1,
					anticipatePin: 1,
					pinnedContainer: sectionRef.current,
					invalidateOnRefresh: true,

					onUpdate: (self) => {
						const progress = self.progress

						if (progress >= 0.1 && progress <= 0.25) {
							const headerProgress = gsap.utils.mapRange(
								0.1,
								0.25,
								0,
								1,
								progress
							)
							gsap.to(headerRef.current, {
								y: gsap.utils.mapRange(0, 1, 40, 0, headerProgress),
								opacity: headerProgress,
								overwrite: true,
							})
						} else if (progress < 0.1) {
							gsap.set(headerRef.current, { y: 40, opacity: 0 })
						} else if (progress > 0.25) {
							gsap.set(headerRef.current, { y: 0, opacity: 1 })
						}

						const width =
							progress <= 0.25
								? gsap.utils.mapRange(0, 0.25, 75, 60, progress)
								: 60
						gsap.set(containerRef.current, { width: `${width}%` })

						if (progress >= 0.35 && !isGapAnimationCompleted) {
							gsap.to(containerRef.current, {
								gap: '20px',
								duration: 0.5,
								ease: 'power3.out',
							})
							gsap.to(cardsRef.current, {
								borderRadius: '20px',
								duration: 0.5,
								ease: 'power3.out',
							})
							isGapAnimationCompleted = true
						} else if (progress < 0.35 && isGapAnimationCompleted) {
							gsap.to(containerRef.current, {
								gap: '0px',
								duration: 0.5,
								ease: 'power3.out',
							})
							gsap.to(cardsRef.current[0], {
								borderRadius: '20px 0 0 20px',
								duration: 0.5,
								ease: 'power3.out',
							})
							gsap.to(cardsRef.current[1], {
								borderRadius: '0',
								duration: 0.5,
								ease: 'power3.out',
							})
							gsap.to(cardsRef.current[2], {
								borderRadius: '0 20px 20px 0',
								duration: 0.5,
								ease: 'power3.out',
							})
							isGapAnimationCompleted = false
						}

						if (progress >= 0.7 && !isFlipAnimationCompleted) {
							gsap.to(cardsRef.current, {
								rotationY: 180,
								duration: 0.75,
								ease: 'power3.inOut',
								stagger: 0.1,
							})
							gsap.to([cardsRef.current[0], cardsRef.current[2]], {
								y: 30,
								rotationZ: (i: number) => (i === 0 ? -15 : 15),
								duration: 0.75,
								ease: 'power3.inOut',
							})
							isFlipAnimationCompleted = true
						} else if (progress < 0.7 && isFlipAnimationCompleted) {
							gsap.to(cardsRef.current, {
								rotationY: 0,
								duration: 0.75,
								ease: 'power3.inOut',
								stagger: -0.1,
							})
							gsap.to([cardsRef.current[0], cardsRef.current[2]], {
								y: 0,
								rotationZ: 0,
								duration: 0.75,
								ease: 'power3.inOut',
							})
							isFlipAnimationCompleted = false
						}
					},
				})
				stRef.current = st

				ScrollTrigger.addEventListener('refreshInit', () => {
					isGapAnimationCompleted = false
					isFlipAnimationCompleted = false
				})
			})

			return () => {
				mm.revert()
				if (stRef.current) stRef.current.kill()
			}
		},
		{ scope: sectionRef }
	)

	useEffect(() => {
		let resizeTimer: NodeJS.Timeout

		const handleResize = () => {
			clearTimeout(resizeTimer)
			resizeTimer = setTimeout(() => {
				ScrollTrigger.refresh()
			}, 250)
		}

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
			clearTimeout(resizeTimer)
		}
	}, [])

	return (
		<section ref={sectionRef} className={styles.section}>
			<div className={styles.stickyHeader}>
				<h2 ref={headerRef} className={styles.heading}>
					Three core strengths, one unified goal
				</h2>
			</div>

			<div ref={containerRef} className={styles.cardContainer}>
				<div ref={setCardRef(0)} className={`${styles.card} ${styles.card1}`}>
					<div className={styles.cardFront}>
						<img
							src="/service/part-1.png"
							alt="Digital Marketing"
							className={styles.cardImage}
						/>
					</div>
					<div className={styles.cardBack}>
						<span className={`${styles.cardNumber} ${styles.grayNumber}`}>
							( 01 )
						</span>
						<h3 className={styles.cardTitle}>Digital Marketing</h3>
						<p className={styles.cardText}>
							Strategic campaigns, Creative Content, and Social Media Management
							that deliver real results and engagement.
						</p>
					</div>
				</div>

				<div ref={setCardRef(1)} className={`${styles.card} ${styles.card2}`}>
					<div className={styles.cardFront}>
						<img
							src="/service/part-2.png"
							alt="IT Solutions"
							className={styles.cardImage}
						/>
					</div>
					<div className={styles.cardBack}>
						<span className={`${styles.cardNumber} ${styles.silverNumber}`}>
							( 02 )
						</span>
						<h3 className={styles.cardTitle}>IT Solutions</h3>
						<p className={styles.cardText}>
							Innovative tech solutions, turning your digital vision into
							reality with seamless web development, dynamic apps, and custom
							software.
						</p>
					</div>
				</div>

				<div ref={setCardRef(2)} className={`${styles.card} ${styles.card3}`}>
					<div className={styles.cardFront}>
						<img
							src="/service/part-3.png"
							alt="Creative Hub"
							className={styles.cardImage}
						/>
					</div>
					<div className={styles.cardBack}>
						<span className={`${styles.cardNumber} ${styles.silverNumber}`}>
							( 03 )
						</span>
						<h3 className={styles.cardTitle}>Creative Hub</h3>
						<p className={styles.cardText}>
							We push boundaries by creating unique products, turning bold ideas
							into interactive digital experiences.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
