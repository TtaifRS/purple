'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './Navbar.module.css'

gsap.registerPlugin(ScrollTrigger)

export default function Navbar() {
	const wrapperRef = useRef<HTMLDivElement>(null)
	const navbarRef = useRef<HTMLElement>(null)
	const logoRef = useRef<HTMLImageElement>(null)
	const linksRef = useRef<HTMLDivElement>(null)
	const contactBtnRef = useRef<HTMLAnchorElement>(null)

	// Store our own ScrollTrigger instances for cleanup
	const scrollTriggersRef = useRef<ScrollTrigger[]>([])

	useEffect(() => {
		const wrapper = wrapperRef.current
		const navbar = navbarRef.current
		const logo = logoRef.current
		const links = linksRef.current
		const contactBtn = contactBtnRef.current

		if (!wrapper || !navbar || !links || !contactBtn) return

		scrollTriggersRef.current.forEach((trigger) => trigger.kill())
		scrollTriggersRef.current = []

		const mm = gsap.matchMedia()

		mm.add('(min-width: 768px)', () => {
			gsap.set([navbar, logo, links, contactBtn], {
				willChange: 'transform, opacity',
			})

			gsap.set(navbar, {
				width: '60%',
				scale: 1,
				backgroundColor: 'rgba(14, 5, 25, 0.2)',
				borderColor: 'rgba(125, 77, 255, 0.2)',
				boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
			})

			gsap.set(wrapper, {
				minHeight: '80px',
			})

			gsap.set(logo, {
				scale: 1,
				transformOrigin: 'left center',
			})

			gsap.set(links, {
				gap: '40px',
			})

			gsap.set(contactBtn, {
				fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
				padding: '8px 28px',
			})

			gsap.set(`.${styles.link}`, {
				fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
			})

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: document.documentElement,
					start: '100px top',
					end: '400px top',
					scrub: 0.8,
					invalidateOnRefresh: true,
					anticipatePin: 1,
					fastScrollEnd: true,
					markers: false,
				},
				defaults: {
					ease: 'power2.out',
				},
			})

			if (tl.scrollTrigger) {
				scrollTriggersRef.current.push(tl.scrollTrigger)
			}

			tl.to(
				navbar,
				{
					width: '50%',
					scale: 0.95,
					backgroundColor: 'rgba(14, 5, 25, 0.75)',
					borderColor: 'rgba(125, 77, 255, 0.5)',
					boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)',
					duration: 1,
				},
				0
			)

			tl.to(
				wrapper,
				{
					minHeight: '70px',
					duration: 1,
				},
				0
			)

			tl.to(
				logo,
				{
					scale: 0.9,
					duration: 1,
				},
				0
			)

			tl.to(
				links,
				{
					gap: '24px',
					duration: 1,
				},
				0
			)

			tl.to(
				contactBtn,
				{
					fontSize: 'clamp(0.9rem, 1.3vw, 1.125rem)',
					padding: '6px 24px',
					duration: 1,
				},
				0
			)

			tl.to(
				`.${styles.link}`,
				{
					fontSize: 'clamp(0.9rem, 1.3vw, 1.125rem)',
					duration: 1,
				},
				0
			)

			const buttonShine = gsap.to(contactBtn, {
				backgroundPositionX: '200%',
				duration: 2,
				repeat: -1,
				ease: 'none',
				backgroundImage:
					'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
				backgroundSize: '200% 100%',
			})

			return () => {
				if (tl.scrollTrigger) {
					tl.scrollTrigger.kill()
				}
				buttonShine.kill()
			}
		})

		mm.add('(max-width: 767px)', () => {
			gsap.set(navbar, {
				width: '95%',
				scale: 1,
				backgroundColor: 'rgba(14, 5, 25, 0.2)',
				borderColor: 'rgba(125, 77, 255, 0.2)',
				boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
			})

			gsap.set(wrapper, {
				minHeight: '60px',
			})

			gsap.set(logo, {
				scale: 1,
				transformOrigin: 'left center',
			})

			gsap.set(links, {
				display: 'none',
			})

			gsap.set(contactBtn, {
				fontSize: '0.875rem',
				padding: '6px 20px',
			})

			const buttonShine = gsap.to(contactBtn, {
				backgroundPositionX: '200%',
				duration: 2,
				repeat: -1,
				ease: 'none',
				backgroundImage:
					'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
				backgroundSize: '200% 100%',
			})

			return () => {
				buttonShine.kill()
			}
		})

		const handleResize = () => {
			ScrollTrigger.refresh()
		}

		window.addEventListener('resize', handleResize)

		return () => {
			scrollTriggersRef.current.forEach((trigger) => trigger.kill())
			window.removeEventListener('resize', handleResize)
			mm.revert()
		}
	}, [])

	return (
		<div className={styles.container}>
			<div ref={wrapperRef} className={styles.wrapper}>
				<nav ref={navbarRef} className={styles.navbar}>
					<Link href="/" className={styles.logoLink}>
						<Image
							ref={logoRef}
							src="/logo.webp"
							alt="Logo"
							width={80}
							height={35}
							className={styles.logo}
							priority
						/>
					</Link>

					<div ref={linksRef} className={styles.links}>
						{['Home', 'Service', 'Team', 'Contact'].map((item) => (
							<Link key={item} href="/" className={styles.link}>
								{item}
							</Link>
						))}
					</div>

					<Link
						ref={contactBtnRef}
						href="/contact"
						className={styles.contactBtn}
					>
						<span className={styles.btnText}>Get in Touch</span>
						<span className={styles.btnTextShort}>Contact</span>
					</Link>
				</nav>
			</div>
		</div>
	)
}
