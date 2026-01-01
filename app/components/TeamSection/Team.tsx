'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Team.module.css'

interface TeamMember {
	id: number
	firstName: string
	lastName: string
	role: string
	image: string
	initial: string
	quote: string
}

gsap.registerPlugin(ScrollTrigger)

const teamData: TeamMember[] = [
	{
		id: 1,
		firstName: 'Sakib Mehdi',
		lastName: 'Siddiqui',
		role: 'Director & CEO',
		image: '/team/team1.png',
		initial: 'S',
		quote:
			"At Purple Dice, we don't just adapt to change, we create it. We're here to turn your boldest ideas into dynamic digital realities.",
	},
	{
		id: 2,
		firstName: 'Mubasshir',
		lastName: 'Fahad',
		role: 'Director & COO',
		image: '/team/team2.png',
		initial: 'M',
		quote:
			"With every project, we push boundaries and redefine what's possible. Together, we turn challenges into opportunities and deliver success.",
	},
	{
		id: 3,
		firstName: 'Golam',
		lastName: 'Zakaria',
		role: 'Director of External Affairs',
		image: '/team/team3.png',
		initial: 'G',
		quote:
			'Shaping connections that go beyond business, creating meaningful partnerships that fuel innovation and shared success.',
	},
	{
		id: 4,
		firstName: 'Ahmad',
		lastName: 'Sharif',
		role: 'Head of HR & Admin',
		image: '/team/team4.png',
		initial: 'A',
		quote:
			'Building strong teams and fostering a culture of excellence drives long-term success.',
	},
]

export default function TeamList() {
	const sectionRef = useRef<HTMLElement>(null)
	const membersRef = useRef<HTMLDivElement[]>([])
	const cardsRef = useRef<HTMLDivElement[]>([])
	const initialsRef = useRef<HTMLHeadingElement[]>([])
	const entranceRef = useRef<ScrollTrigger | null>(null)
	const slideInRef = useRef<ScrollTrigger | null>(null)

	useEffect(() => {
		const teamSection = sectionRef.current
		if (!teamSection) return

		const initTeamAnimations = () => {
			// Kill previous
			if (entranceRef.current) entranceRef.current.kill()
			if (slideInRef.current) slideInRef.current.kill()

			// Clear all props
			membersRef.current.forEach((member) => {
				if (member) gsap.set(member, { clearProps: 'all' })
			})
			cardsRef.current.forEach((card) => {
				if (card) gsap.set(card, { clearProps: 'all' })
			})
			initialsRef.current.forEach((initial) => {
				if (initial) gsap.set(initial, { clearProps: 'all' })
			})

			// Mobile / Tablet check
			if (window.innerWidth < 1000) {
				// Simple mobile animation: Cards slide up with a subtle rotation
				membersRef.current.forEach((member, index) => {
					if (!member) return

					// Set initial state for mobile
					gsap.set(member, {
						y: 100,
						opacity: 0,
						rotation: -3,
					})

					// Set initial for cards
					const card = cardsRef.current[index]
					if (card) {
						gsap.set(card, {
							scale: 0.95,
							rotation: index % 2 === 0 ? 2 : -2,
						})
					}

					// Set initial for initial letters
					const initial = initialsRef.current[index]
					if (initial) {
						gsap.set(initial, {
							opacity: 0.8,
							scale: 1.2,
						})
					}

					// Create scroll trigger for each card on mobile
					ScrollTrigger.create({
						trigger: member,
						start: 'top 85%',
						end: 'top 50%',
						scrub: 1,
						onUpdate: (self) => {
							const progress = self.progress

							// Member container animation
							gsap.to(member, {
								y: 100 - progress * 100,
								opacity: progress,
								rotation: -3 + progress * 3,
								duration: 0.1,
							})

							// Card animation
							if (card) {
								gsap.to(card, {
									scale: 0.95 + progress * 0.05,
									rotation:
										index % 2 === 0 ? 2 - progress * 2 : -2 + progress * 2,
									duration: 0.1,
								})
							}

							// Initial letter animation
							if (initial) {
								gsap.to(initial, {
									opacity: 0.8 - progress * 0.8,
									scale: 1.2 - progress * 0.2,
									duration: 0.1,
								})
							}
						},
						onEnter: () => {
							// When element enters viewport
							gsap.to(member, {
								y: 0,
								opacity: 1,
								rotation: 0,
								duration: 1,
								ease: 'power2.out',
							})

							if (card) {
								gsap.to(card, {
									scale: 1,
									rotation: 0,
									duration: 1,
									ease: 'power2.out',
									delay: 0.1,
								})
							}

							if (initial) {
								gsap.to(initial, {
									opacity: 0,
									scale: 1,
									duration: 0.8,
									ease: 'power2.out',
								})
							}
						},
						onLeaveBack: () => {
							// When scrolling back up
							gsap.to(member, {
								y: 100,
								opacity: 0,
								rotation: -3,
								duration: 0.5,
								ease: 'power2.in',
							})
						},
					})
				})
				return
			}

			// Desktop: Original desktop animation (unchanged)
			const teamMembers = membersRef.current
			const teamMemberCards = cardsRef.current
			const entranceDelay = 0.12
			const slideStagger = 0.06

			// 1. Entrance Animation: staggered reveal from bottom
			entranceRef.current = ScrollTrigger.create({
				trigger: teamSection,
				start: 'top bottom',
				end: 'top top',
				scrub: 1,
				onUpdate: (self) => {
					const progress = self.progress
					teamMembers.forEach((member, index) => {
						if (!member) return
						const entranceDuration = 0.6
						const entranceStart = index * entranceDelay
						const entranceEnd = entranceStart + entranceDuration
						if (progress >= entranceStart && progress <= entranceEnd) {
							const memberProgress =
								(progress - entranceStart) / entranceDuration
							const entranceY = 125 - memberProgress * 125
							gsap.set(member, { y: `${entranceY}%` })
							const initial = member.querySelector(
								`.${styles['member-initial']}`
							)
							if (initial) {
								const scaleDelay = 0.4
								const scaleProgress = Math.max(
									0,
									(memberProgress - scaleDelay) / (1 - scaleDelay)
								)
								gsap.set(initial, { scale: scaleProgress })
							}
						} else if (progress > entranceEnd) {
							gsap.set(member, { y: '0%' })
							const initial = member.querySelector(
								`.${styles['member-initial']}`
							)
							if (initial) gsap.set(initial, { scale: 1 })
						}
					})
				},
			})

			// 2. Pinned Slide-In & Scale Animation
			slideInRef.current = ScrollTrigger.create({
				trigger: teamSection,
				start: 'top top',
				end: `+=${window.innerHeight * 3}`,
				pin: true,
				scrub: 1,
				onUpdate: (self) => {
					const progress = self.progress
					teamMemberCards.forEach((card, index) => {
						if (!card) return
						// Slide + Rotation
						const xRotationStart = index * slideStagger
						const xRotationDuration = 0.4
						const xRotationEnd = xRotationStart + xRotationDuration
						if (progress >= xRotationStart && progress <= xRotationEnd) {
							const cardProgress =
								(progress - xRotationStart) / xRotationDuration
							const initialX = 300 - index * 100
							const targetX = -50
							const slideX = initialX + cardProgress * (targetX - initialX)
							const rotation = 20 - cardProgress * 20
							gsap.set(card, { x: `${slideX}%`, rotation })
						} else if (progress > xRotationEnd) {
							gsap.set(card, { x: '-50%', rotation: 0 })
						}
						// Scale
						const scaleStagger = 0.1
						const scaleStart = 0.35 + index * scaleStagger
						const scaleEnd = 1
						if (progress >= scaleStart && progress <= scaleEnd) {
							const scaleProgress =
								(progress - scaleStart) / (scaleEnd - scaleStart)
							const scale = 0.75 + scaleProgress * 0.25
							gsap.set(card, { scale })
						} else if (progress > scaleEnd) {
							gsap.set(card, { scale: 1 })
						}
					})
				},
			})
		}

		initTeamAnimations()

		let resizeTimer: NodeJS.Timeout | null = null
		const handleResize = () => {
			if (resizeTimer) clearTimeout(resizeTimer)
			resizeTimer = setTimeout(() => {
				initTeamAnimations()
				ScrollTrigger.refresh()
			}, 250)
		}

		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
			if (resizeTimer) clearTimeout(resizeTimer)
			if (entranceRef.current) entranceRef.current.kill()
			if (slideInRef.current) slideInRef.current.kill()
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

			membersRef.current.forEach((member) => {
				if (member) gsap.set(member, { clearProps: 'all' })
			})
			cardsRef.current.forEach((card) => {
				if (card) gsap.set(card, { clearProps: 'all' })
			})
			initialsRef.current.forEach((initial) => {
				if (initial) gsap.set(initial, { clearProps: 'all' })
			})
		}
	}, [])

	return (
		<section ref={sectionRef} className={styles.team}>
			{teamData.map(
				({ id, firstName, lastName, role, image, initial, quote }, index) => (
					<div
						key={id}
						className={styles['team-member']}
						ref={(el) => {
							if (el) membersRef.current[index] = el
						}}
					>
						<div className={styles['team-member-name-initial']}>
							<h2
								className={styles['member-initial']}
								ref={(el) => {
									if (el) initialsRef.current[index] = el
								}}
							>
								{initial}
							</h2>
						</div>
						<div
							className={styles['team-member-card']}
							ref={(el) => {
								if (el) cardsRef.current[index] = el
							}}
						>
							<div className={styles['team-member-img']}>
								<img
									src={image}
									alt={`${firstName} ${lastName}`}
									className={styles['member-image']}
								/>
							</div>
							<div className={styles['team-member-info']}>
								<p className={styles['member-role']}>( {role} )</p>
								<h2 className={styles['member-name']}>
									{firstName} <br />
									<span>{lastName}</span>
								</h2>
								<p className={styles['member-quote']}>{quote}</p>
							</div>
						</div>
					</div>
				)
			)}
		</section>
	)
}
