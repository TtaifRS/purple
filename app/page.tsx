import Hero from './components/HeroSection/Hero'
import LogoCarousel from './components/LogoSection/LogoCarousel'
import { Service } from './components/ServiceSection/Service'
import TeamList from './components/TeamSection/Team'
import TeamHeading from './components/TeamSection/TeamHeader'
import { TextSection } from './components/TextSection/TextSection'

const companyLogos = [
	{ src: '/logo-1.webp', alt: 'Company 1' },
	{ src: '/logo-2.webp', alt: 'Company 2' },
	{ src: '/logo-3.webp', alt: 'Company 3' },
	{ src: '/logo-4.webp', alt: 'Company 4' },
	{ src: '/logo-5.webp', alt: 'Company 5' },
	{ src: '/logo-6.webp', alt: 'Company 6' },
	{ src: '/logo-7.webp', alt: 'Company 7' },
]

export default function Home() {
	return (
		<>
			<Hero />
			<LogoCarousel logos={companyLogos} />
			<TextSection />
			<Service />
			<TeamHeading />
			<TeamList />
		</>
	)
}
