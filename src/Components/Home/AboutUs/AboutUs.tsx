import { AboutCards } from './AbourCards';


const AboutUs = () => {

  return (
    <div className='grid sm:grid-cols-[1fr] md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_2fr] text-black'>
      <div className="text-[#666666] text-[22px] font-medium">(ABOUT US)</div>
      <AboutCards />
    </div>
  )
}

export default AboutUs
