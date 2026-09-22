import Bhutan from "../../assets/images/Bhutan1.jpg"
import Kaziranga from "../../assets/images/Kaziranga1.jpg"
import Shillong from "../../assets/images/RopeBridge1.jpg"
import Tawang from "../../assets/images/Tawang1.jpg"


import { useState, useEffect } from "react"

import { motion } from "framer-motion";


const images = [Bhutan, Kaziranga, Shillong, Tawang]

export const Caraousel = () => {

    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds
    
        return () => clearInterval(interval);
      }, []);
    
      return (

        <div className="absolute top-0 left-0 w-full h-full">
      <motion.div
        key={currentIndex}
        className="relative w-full h-full"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* Background Image */}
        <img
          src={images[currentIndex]}
          alt="Affordable self-drive car rental in Guwahati"
          className="w-full h-full object-cover opacity-80"
        />

        {/* Bottom Fade Effect */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>
      </motion.div>
    </div>
      );
};