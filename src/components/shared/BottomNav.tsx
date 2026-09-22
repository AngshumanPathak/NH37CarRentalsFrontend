import { Button } from "../ui/button"

import home from "../../assets/icons/home.svg"
import about from "../../assets/icons/about.svg"
import services from "../../assets/icons/car.svg"
import contact from "../../assets/icons/contacts.svg"
import { useCallback } from "react"


export const BottomNav = () => {  
    
    
  const handleScroll = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      console.warn(`Element with id '${id}' not found`);
    }
  }, []);

 

    return (

        <div className="sm:hidden fixed bottom-2 left-52 transform -translate-x-1/2 flex space-x-4 bg-transparent text-white p-1 shadow-lg z-50 w-100">
                <Button className="bg-yellow-500 hover:bg-yellow-600 rounded-full px-4 py-2"><img src={home} alt="" className="w-10 p-2" onClick={() => handleScroll('home')}/></Button>
                <Button className="bg-yellow-500 hover:bg-yellow-600 rounded-full px-4 py-2"><img src={about} alt="" className="w-10 p-2"onClick={() => handleScroll('about')}/></Button>
                <Button className="bg-yellow-500 hover:bg-yellow-600 rounded-full px-4 py-2"><img src={services} alt="" className="w-10 p-2"onClick={() => handleScroll('search')}/></Button>
                <Button className="bg-yellow-500 hover:bg-yellow-600 rounded-full px-4 py-2"><img src={contact} alt="" className="w-10 p-2"onClick={() => handleScroll('contacts')}/></Button>
                
                </div>
    )
}