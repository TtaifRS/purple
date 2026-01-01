'use client'

import Image from 'next/image'
import * as THREE from 'three'
import { vertexShader, fragmentShader } from '@/Shaders/heroShaders'
import styles from './hero.module.css'
import { useEffect, useRef, useState } from 'react'
import HeroText from './HeroText'
import { usePreloadCriticalAssets } from '@/hooks/usePreloadCriticalAssets'

const config = {
	parallaxStrength: 0.1,
	distortionMultiplier: 10,
	glassStrength: 2.0,
	glassSmoothness: 0.0001,
	stripesFrequency: 50,
	edgePadding: 0.1,
	animationSpeed: 1.0,
}

const Hero = () => {
	const containerRef = useRef<HTMLDivElement>(null)
	const imageRef = useRef<HTMLImageElement>(null)
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
	const animationRef = useRef<number>(0)
	const materialRef = useRef<THREE.ShaderMaterial | null>(null)
	const startTimeRef = useRef<number>(0)
	const progressRef = useRef<number>(0)

	const [isShaderReady, setIsShaderReady] = useState(false)

	const { isLoaded } = usePreloadCriticalAssets()

	const [isPreloaderAnimationComplete, setIsPreloaderAnimationComplete] =
		useState(false)

	useEffect(() => {
		if (isLoaded) {
			const timer = setTimeout(() => {
				setIsPreloaderAnimationComplete(true)
			}, 1500)

			return () => clearTimeout(timer)
		}
	}, [isLoaded])

	useEffect(() => {
		if (!containerRef.current) return

		const scene = new THREE.Scene()
		const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

		const container = containerRef.current
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		})
		rendererRef.current = renderer

		const { width, height } = container.getBoundingClientRect()
		renderer.setSize(width, height)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		container.appendChild(renderer.domElement)

		const textureSize = { x: 1, y: 1 }

		startTimeRef.current = performance.now() / 1000
		progressRef.current = 0

		const material = new THREE.ShaderMaterial({
			uniforms: {
				uTexture: { value: null },
				uResolution: { value: new THREE.Vector2(width, height) },
				uTextureSize: {
					value: new THREE.Vector2(textureSize.x, textureSize.y),
				},
				uTime: { value: 0.0 },
				uProgress: { value: 0.0 },
				uParallaxStrength: { value: config.parallaxStrength },
				uDistortionMultiplier: { value: config.distortionMultiplier },
				uGlassStrength: { value: config.glassStrength },
				ustripesFrequency: { value: config.stripesFrequency },
				uglassSmoothness: { value: config.glassSmoothness },
				uEdgePadding: { value: config.edgePadding },
				uAnimationSpeed: { value: config.animationSpeed },
			},
			vertexShader,
			fragmentShader,
			transparent: true,
		})
		materialRef.current = material

		const geometry = new THREE.PlaneGeometry(2, 2)
		const mesh = new THREE.Mesh(geometry, material)
		scene.add(mesh)

		function loadImage() {
			if (!imageRef.current) return

			if (!imageRef.current.complete || imageRef.current.naturalWidth === 0) {
				if (imageRef.current) {
					imageRef.current.onload = loadImage
				}
				return
			}

			const texture = new THREE.Texture(imageRef.current)
			textureSize.x = imageRef.current.naturalWidth || imageRef.current.width
			textureSize.y = imageRef.current.naturalHeight || imageRef.current.height

			texture.minFilter = THREE.LinearFilter
			texture.magFilter = THREE.LinearFilter
			texture.generateMipmaps = false
			texture.needsUpdate = true

			material.uniforms.uTexture.value = texture
			material.uniforms.uTextureSize.value.set(textureSize.x, textureSize.y)

			renderer.render(scene, camera)

			setIsShaderReady(true)
		}

		setTimeout(loadImage, 100)

		if (imageRef.current) {
			imageRef.current.onload = loadImage
		}

		const handleResize = () => {
			if (!containerRef.current || !rendererRef.current) return

			const container = containerRef.current
			const { width, height } = container.getBoundingClientRect()

			rendererRef.current.setSize(width, height)

			if (materialRef.current) {
				materialRef.current.uniforms.uResolution.value.set(width, height)
			}
		}

		window.addEventListener('resize', handleResize)

		let lastTime = 0
		function animate(timestamp: number) {
			animationRef.current = requestAnimationFrame(animate)

			const currentTime = timestamp / 1000
			if (lastTime === 0) lastTime = currentTime
			const deltaTime = Math.min(currentTime - lastTime, 0.1)
			lastTime = currentTime

			progressRef.current += deltaTime * config.animationSpeed

			const waveValue = Math.sin(progressRef.current * 0.5) * 0.5 + 0.5

			if (materialRef.current) {
				materialRef.current.uniforms.uTime.value =
					currentTime - startTimeRef.current
				materialRef.current.uniforms.uProgress.value = waveValue
			}

			renderer.render(scene, camera)
		}

		animationRef.current = requestAnimationFrame(animate)

		return () => {
			window.removeEventListener('resize', handleResize)
			cancelAnimationFrame(animationRef.current)

			if (containerRef.current && rendererRef.current?.domElement) {
				try {
					containerRef.current.removeChild(rendererRef.current.domElement)
				} catch (e) {}
			}

			renderer.dispose()
			geometry.dispose()
			material.dispose()
		}
	}, [])

	return (
		<section className={styles.hero} ref={containerRef}>
			<img
				ref={imageRef}
				src="/hero.png"
				alt="hero background"
				style={{
					display: 'none',
					position: 'absolute',
				}}
				crossOrigin="anonymous"
			/>

			<div className={styles.overlay}></div>

			<div className={styles.heroTextWrapper}>
				<HeroText
					isShaderReady={isShaderReady}
					isPreloaderAnimationComplete={isPreloaderAnimationComplete}
				/>
			</div>
		</section>
	)
}

export default Hero
