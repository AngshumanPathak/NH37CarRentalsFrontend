import { Map } from "./Map"

const Contacts = () => {
  return (
    <div className="text-white p-10">
      <h1 className="text-4xl font-bold mb-10">Contact Us</h1>
      <hr className='text-yellow-300 mb-5'/>
      <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-transparent sm:bg-gradient-to-r from-yellow-500 to-neutral-950 rounded-2xl shadow-lg">
  {/* Contact Information */}
  <div className="flex flex-col sm:w-1/2 text-white sm:h-125">
    <h1 className="flex justify-center text-3xl font-bold mb-6 text-center sm:text-left">Reach Out at</h1>
    
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-80 sm:w-full sm:h-100">
      
      
      <div className="space-y-4">
        <p className="flex items-center gap-3 mt-10">
          📞 <span className="font-small sm:font-medium">Phone:</span>  
          <a href="tel:+917002272388" className="text-yellow-400 hover:underline">7002272388</a>  
          <a href="tel:+917002567003" className="text-yellow-400 hover:underline">7002567003</a>
        </p>

        <p className="flex items-center gap-3">
          📧 <span className="font-medium">Email:</span>  
          <a href="mailto:bishalboro268@gmail.com" className="text-yellow-400 hover:underline">bishalboro268@gmail.com</a>
        </p>

        <p className="flex items-start gap-3">
          📍 <span className="font-medium">Address:</span>
          <span>
            House No.-39, By lane 5,<br />
            Near Manasha Mandir,<br />
            New Colony, Bakrapara,<br />
            Basistha Chariali, Guwahati,<br />
            <strong>PIN: 781029</strong>
          </span>
        </p>
      </div>
    </div>
  </div>

  {/* Map Section */}
  <div className="w-full sm:w-1/2 h-full flex flex-col items-center">
    <h1 className="text-3xl font-bold mb-6 text-center text-white">Our Location</h1>
    <div className='w-80 sm:w-full bg-transparent rounded-2xl'>
      <Map/>
    </div>
  </div>
</div>

    </div>
  )
}

export default Contacts
