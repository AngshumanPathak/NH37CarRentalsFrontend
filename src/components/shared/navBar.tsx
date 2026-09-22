


import { Caraousel } from "./Caraousel"
import { BottomNav } from "./BottomNav";



export const NavBar = () => {





 

 


 


  

    console.log("navBar is rendered")


    
    return (
        <div>
          <div>
          <div className="relative h-100 w-vw flex flex-col items-center">
          <Caraousel/>
          
            <div className="flex flex-col text-center px-4 mt-40 sm:mt-40 z-10">
  <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg leading-tight ">
    Make Trips<span className="text-yellow-300"> Make Memories</span>
    <span className="inline-flex">
      <span className="animate-pulse opacity-100 delay-0">.</span>
      <span className="animate-pulse opacity-75 delay-150">.</span>
      <span className="animate-pulse opacity-50 delay-300">.</span>
    </span>
  </h1>

  {/* SEO line below logo/heading */}
  <h1 className="mt-4 inline-block px-5 py-2
                text-lg sm:text-xl md:text-2xl 
               text-yellow-300 font-semibold 
               ">
  Our Ride Your Rules: Self-Drive & Chauffeur Rentals in Guwahati.
</h1>
</div>
            
        </div>
          </div>
          <div className="z-20">
          <BottomNav/>
          </div>
        </div>
    )
}