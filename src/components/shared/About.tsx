import { useState, useEffect } from "react"
import Reviews from "./Reviews"

import Image2 from "../../assets/images/Image2.jpg"
import Image3 from "../../assets/images/Image3.jpg"
import Image4 from "../../assets/images/Image4.jpg"
import Image5 from "../../assets/images/Image5.jpg"
import Image6 from "../../assets/images/Image6.jpg"
import Image7 from "../../assets/images/Image7.jpg"
import {motion} from "framer-motion"

const About = () => {

const images = [Image2, Image3, Image4, Image5, Image6, Image7]

const [index, setIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, 3000); // Change every 3 seconds
  return () => clearInterval(interval);
}, []);
    
  return (
    <>
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-10">About Us</h1>
      <hr className="border-yellow-300 mb-5" />
    
      {/* About Section Wrapper */}
      <div className="relative flex flex-col sm:flex-row">
      <div className="relative flex flex-col sm:flex-row p-5 bg-transparent sm:bg-gradient-to-r from-yellow-500 to-neutral-950 rounded-2xl">
        
        {/* Background Image Carousel - Only Under Text */}
        <div className="absolute inset-0 w-full sm:w-full h-full rounded-2xl overflow-hidden">
          {images.map((img, i) => (
            <motion.img
              key={i}
              src={img}
              alt={`Car ${i + 1}`}
              className="absolute w-full h-full object-cover opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Text Content - Overlayed on Background */}
        <div className="relative z-10 w-auto sm:w-150 mt-6 text-white sm:text-white font-medium p-5 bg-black/40 rounded-xl">
          <p>
             Welcome to NH37 Car Rentals, a trusted self drive car rental service in Guwahati, Assam.
  Whether you're looking for a rugged SUV for an adventure, a sleek sedan for business travel,
  or a compact hatchback for city drives, we have the perfect ride for you.
          </p>

          <p>
            Our diverse fleet is well-maintained and equipped to ensure a seamless driving experience. We prioritize customer satisfaction, offering flexible rental plans, competitive pricing, and hassle-free booking.
          </p>

          <p>
            Explore Guwahati and beyond on your own terms—book your car with us today and drive with confidence!
          </p>
        </div>
      </div>

      {/* Reviews Section - Kept Outside Background */}
      <div className="mt-6 w-full sm:w-150 bg-transparent rounded-2xl">
        <Reviews />
      </div>
      </div>
      
    </div>
    
    </>
    
  )
}

export default About
