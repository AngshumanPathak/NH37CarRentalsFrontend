import LinkedIn from "../../assets/icons/linkedInLogo.svg"
import Facebook from "../../assets/icons/facebookLogo.svg"
import Instagram from "../../assets/icons/instagramLogo.svg"
import Website from "../../assets/icons/websiteLogo.svg"
import Github from "../../assets/icons/githubLogo.svg"


export const Footer = () => {
    return (
        <footer className="bg-gradient-to-t from-yellow-500 to-black text-white py-6 mt-10">
        <div className="container mx-auto p-4 text-center md:text-left mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 md:ml-50 gap-8">
            
            
            
  
            {/* Social Links of site owner */}
            <div>
              <h2 className="text-lg font-semibold">Follow Us</h2>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                <a href="https://www.facebook.com/share/1G2DCUkLbt/" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer" ><img src={Facebook} alt="" className="w-8 h-8" />Facebook</a>
                <a href="https://www.instagram.com/nh37carrental/" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer" ><img src={Instagram} alt="" className="w-8 h-8" />Instagram</a>
                
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold">Developed by Angshuman Pathak</h2>
              <div className="flex justify-center md:justify-start gap-4 mt-2">
                <a href="https://www.linkedin.com/in/angshuman-pathak/" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer" ><img src={LinkedIn} alt="" className="w-10 h-10" />LinkedIn</a>
                <a href="https://github.com/AngshumanPathak" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer" ><img src={Github} alt="" className = "w-10 h-10" />Github</a>
                <a href="https://portfolio-gj3nutg6t-angshumanpathaks-projects.vercel.app/" className="text-gray-400 hover:text-white" target="_blank" rel="noopener noreferrer" ><img src={Website} alt="" className="w-10 h-10" />Website</a>
              </div>
            </div>
          </div>
  
          {/* Bottom */}
          <div className="mt-6 text-gray-500 text-sm text-center">
            &copy; {new Date().getFullYear()} Your Car Rental Service. All Rights Reserved.
          </div>
        </div>
      </footer>
    )
}