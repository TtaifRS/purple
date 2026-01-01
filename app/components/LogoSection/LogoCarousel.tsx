'use client'

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import styles from './LogoCarousel.module.css'

export interface Logo {
	src: string
	alt: string
}

interface LogoCarouselProps {
	logos: Logo[]
	title?: string
	targetsShown?: number
	duration?: number
	pause?: number
	factor?: number
	gap?: number
	className?: string
	autoPlay?: boolean
}

const LogoCarousel: React.FC<LogoCarouselProps> = ({
	logos,
	title = 'Trusted by companies',
	targetsShown: propTargetsShown = 5,
	duration = 1,
	pause = 0.75,
	factor = 12,
	gap = 1.5,
	className = '',
	autoPlay = true,
}) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const carouselRef = useRef<HTMLDivElement>(null)
	const animationRef = useRef<gsap.core.Timeline | null>(null)

	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth <= 768)
		checkMobile()
		window.addEventListener('resize', checkMobile)
		return () => window.removeEventListener('resize', checkMobile)
	}, [])

	const adjustedFactor = isMobile ? 20 : factor
	const targetsShown = isMobile ? 3 : propTargetsShown

	useEffect(() => {
		if (!carouselRef.current || !autoPlay || logos.length === 0) return

		const targets = gsap.utils.toArray<HTMLDivElement>(
			carouselRef.current.querySelectorAll(`.${styles.logoItem}`)
		)

		const totalItemWidth = adjustedFactor + gap
		const containerWidth = totalItemWidth * targetsShown

		const repeatDelay =
			(logos.length - targetsShown) * (pause + duration) - duration

		gsap.set(targets, {
			right: -adjustedFactor + 'vw',
			scale: 0,
			width: adjustedFactor + 'vw',
			height: adjustedFactor * 0.6 + 'vw',
			xPercent: 0,
		})

		gsap.set(carouselRef.current, {
			width: containerWidth + 'vw',
			height: adjustedFactor * 0.6 + 'vw',
		})

		const parentTimeline = gsap.timeline()

		targets.forEach((logo, i) => {
			const tl = gsap.timeline({
				delay: i * (duration + pause),
				defaults: { duration, ease: 'power3.inOut' },
				repeat: -1,
				repeatDelay,
			})

			tl.to(logo, {
				opacity: 1,
				scale: 1,
				transformOrigin: 'left center',
				xPercent: -100 * ((adjustedFactor + gap) / adjustedFactor),
			})

			for (let j = 1; j < targetsShown; j++) {
				tl.to(
					logo,
					{ xPercent: `-=${100 * ((adjustedFactor + gap) / adjustedFactor)}` },
					`+=${pause}`
				)
			}

			tl.to(
				logo,
				{
					opacity: 0,
					scale: 0,
					transformOrigin: 'right center',
					xPercent: `-=${100 * ((adjustedFactor + gap) / adjustedFactor)}`,
				},
				`+=${pause}`
			)

			parentTimeline.add(tl, 0)
		})

		const prepTime = targetsShown * (duration + pause) - pause
		parentTimeline.time(prepTime)

		animationRef.current = parentTimeline

		return () => {
			parentTimeline.kill()
		}
	}, [logos, targetsShown, duration, pause, adjustedFactor, gap, autoPlay])

	const handleMouseEnter = () => animationRef.current?.pause()
	const handleMouseLeave = () => autoPlay && animationRef.current?.play()

	return (
		<div
			ref={containerRef}
			className={`${styles.container} ${className}`}
			style={
				{
					'--logo-width': `${adjustedFactor}vw`,
					'--logo-height': `${adjustedFactor * 0.6}vw`,
					'--gap-vw': `${gap}vw`,
					'--fade-width': `${adjustedFactor * 0.4}vw`,
					'--targets-shown': targetsShown,
					'--bg-color': '#0e0519',
				} as React.CSSProperties
			}
		>
			<div className={styles.innerWrapper}>
				<div className={styles.contentRow}>
					{title && <div className={styles.title}>{title}</div>}

					<div className={styles.carouselContainer}>
						<div className={styles.leftFade} />
						<div
							ref={carouselRef}
							className={styles.carouselWrapper}
							onMouseEnter={handleMouseEnter}
							onMouseLeave={handleMouseLeave}
						>
							{logos.map((logo, index) => (
								<div key={index} className={styles.logoItem}>
									<div className={styles.logoInner}>
										<img
											src={logo.src}
											alt={logo.alt}
											className={styles.logoImage}
										/>
									</div>
								</div>
							))}
						</div>
						<div className={styles.rightFade} />
					</div>
				</div>
			</div>
		</div>
	)
}

export default LogoCarousel
