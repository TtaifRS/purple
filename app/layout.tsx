// app/layout.tsx
import './globals.css'
import { Figtree, Plus_Jakarta_Sans } from 'next/font/google'
import type { Metadata } from 'next'
import Navbar from './components/Navbar/Navbar'
import SmoothScroll from './components/SmoothScroll'
import PreloadWrapper from './components/Preloader/PreloadWrapper'

const figtree = Figtree({
	subsets: ['latin'],
	weight: ['400', '500', '700'],
	variable: '--font-body',
	display: 'swap',
})

const plus_jakarta_sans = Plus_Jakarta_Sans({
	subsets: ['latin'],
	variable: '--font-heading',
	weight: ['400', '700', '800'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Purple Dice',
	description: 'Digital agency',
	icons: {
		icon: '/logo.ico',
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang="en"
			className={`${figtree.variable} ${plus_jakarta_sans.variable}`}
		>
			<body className="font-body bg-(--background-color) text-(--text-color) overflow-x-hidden">
				<PreloadWrapper>
					<Navbar />
					<SmoothScroll>{children}</SmoothScroll>
				</PreloadWrapper>
			</body>
		</html>
	)
}
