// components/PreloadWrapper.tsx
'use client'

import { ReactNode } from 'react'
import { Preloader } from './Preloader'
import { usePreloadCriticalAssets } from '@/hooks/usePreloadCriticalAssets'

interface PreloadWrapperProps {
	children: ReactNode
}

export default function PreloadWrapper({ children }: PreloadWrapperProps) {
	const { isLoaded } = usePreloadCriticalAssets()

	return (
		<>
			<Preloader />
			{isLoaded && children}
		</>
	)
}
