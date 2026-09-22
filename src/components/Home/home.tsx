
import { NavBar } from "../shared/navBar"

import About from "../shared/About"

import Contacts from "../shared/Contacts"
import { Helmet } from "react-helmet-async"
import { Services } from "../shared/Services"
import SelfDrive from "../../assets/icons/SelfDrive (1).png"
import WithDriver from "../../assets/icons/WithDriver.png"
import { useNavigate } from "react-router-dom"
import { UniversalNavBar } from "../shared/UniversalNav"



const Home = () => {

  const navigate = useNavigate(); 



  return (
    <>
      <Helmet>
  <title>Self Drive/Rentals Car Service in Guwahati | NH37 Car Rentals</title>

  <meta
    name="description"
    content="NH37 Car Rentals offers affordable car rentals in Guwahati with hatchbacks, sedans and SUVs. Easy booking for local and outstation trips in Assam."
  />

  
</Helmet>
        
          <div id="home">
            
            <UniversalNavBar/>
          <NavBar/>
           
          
        </div>    
        
        <Services/>

           <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:py-16 lg:px-8 ">
            <h1 className="text-2xl md:text-4xl font-bold text-white drop-shadow-lg leading-tight ">
    One Destination - <span className="text-yellow-300">Two ways to get there</span></h1>
          </div>
        <div className="flex flex-wrap justify-center gap-6">
          
  {/* Self Drive Card */}
  <div
    className="
      group relative flex h-[320px] w-full max-w-[300px]
      cursor-pointer flex-col items-center justify-center
      overflow-hidden rounded-3xl
      border border-yellow-300/30
      bg-gradient-to-br from-zinc-950 via-black to-zinc-900
      p-8 text-center
      transition-all duration-300
      hover:-translate-y-2
      hover:border-yellow-300
      hover:shadow-2xl
      hover:shadow-yellow-300/20
      sm:w-[280px]
    "
    onClick={() => navigate("/self-drive")}
  >
    {/* Glow */}
    <div
      className="
        absolute -top-10 -right-10 h-40 w-40
        rounded-full bg-yellow-300/10
        blur-3xl transition-all duration-300
        group-hover:bg-yellow-300/20
      "
    />

    {/* Icon/Image */}
    <div
      className="
        relative mb-6 flex h-24 w-24
        items-center justify-center
        rounded-3xl
        border border-yellow-300/30
        bg-yellow-300/10
        transition-all duration-300
        group-hover:scale-110
        group-hover:bg-yellow-300/20
      "
    >
      <img
        src={SelfDrive}
        alt="Self Drive"
        className="h-28 w-28 object-contain"
      />
    </div>

    {/* Content */}
    <div className="relative">
      <h3
        className="
          text-2xl font-bold text-white
          transition-colors duration-300
          group-hover:text-yellow-300
        "
      >
        Self Drive
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        Take control of your journey and explore at your own pace.
      </p>

      <div
        className="
          mt-6 inline-flex items-center gap-2
          text-sm font-semibold text-yellow-300
        "
      >
        Explore Cars

        <span className="transition-transform duration-300 group-hover:translate-x-2">
          →
        </span>
      </div>
    </div>
  </div>

  {/* With Driver Card */}
  <div
    className="
      group relative flex h-[320px] w-full max-w-[300px]
      cursor-pointer flex-col items-center justify-center
      overflow-hidden rounded-3xl
      bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400
      p-8 text-center
      transition-all duration-300
      hover:-translate-y-2
      hover:shadow-2xl
      hover:shadow-yellow-300/40
      sm:w-[280px]
    "
    onClick={() => navigate("/with-driver")}
  >
    {/* Glow */}
    <div
      className="
        absolute -bottom-10 -left-10 h-40 w-40
        rounded-full bg-black/10
        blur-3xl
      "
    />

    {/* Icon/Image */}
    <div
      className="
        relative mb-6 flex h-24 w-24
        items-center justify-center
        rounded-3xl
        bg-black/10
        transition-all duration-300
        group-hover:scale-110
        group-hover:bg-black/15
      "
    >
      <img
        src={WithDriver}
        alt="With Driver"
        className="h-28 w-28 object-contain"
      />
    </div>

    {/* Content */}
    <div className="relative">
      <h3 className="text-2xl font-bold text-black">
        With a Driver
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-black/70">
        Sit back, relax and let our professional driver handle the journey.
      </p>

      <div
        className="
          mt-6 inline-flex items-center gap-2
          text-sm font-semibold text-black
        "
      >
        Book Your Ride

        <span className="transition-transform duration-300 group-hover:translate-x-2">
          →
        </span>
      </div>
    </div>
  </div>
</div>
        
          <>
        <div id="about" className="text-white">
          <About/>                    
        </div>  

        <div id="contacts">
          <Contacts/>
        </div> 
        
          
         
        </>
       
        
      
       
       
           
    </>
    

  )
}

export default Home
