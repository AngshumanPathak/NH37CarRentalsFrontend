import Airplane from "../../assets/icons/airplane.svg"
import Clock from "../../assets/icons/clock.svg"
import Deposit from "../../assets/icons/deposit.svg"
import Driver from "../../assets/icons/driver.svg"
import Tickets from "../../assets/icons/tickets1.svg"
import Hotels from "../../assets/icons/hotel.svg"
import Permit from "../../assets/icons/location.svg"
import Guide from "../../assets/icons/guide.svg"



export const Services = () => {
  return (
    <div className="items-center justify-center flex flex-col mt-10 mb-10">
        
    <div className="flex-col grid grid-cols-2 sm:grid-cols-4 gap-x-16 gap-y-6 mt-10">
  <div className="flex sm:items-center gap-3">
    <img src={Deposit} alt="" className="w-10 h-10" />
    <p className="text-white">No security deposit</p>
  </div>
  <div className="flex sm:items-center gap-3">
    <img src={Driver} alt="" className="w-10 h-10" />
    <p className="text-white">Car with driver</p>
  </div>
  <div className="flex sm:items-center gap-3">
    <img src={Clock} alt="" className="w-10 h-10" />
    <p className="text-white">24x7 pickup and drop</p>
  </div>
  <div className="flex sm:items-center gap-3">
    <img src={Airplane} alt="" className="w-10 h-10" />
    <p className="text-white">Airport pickup and drop</p>
  </div><div className="flex sm:items-center gap-3">
    <img src={Guide} alt="" className="w-10 h-10" />
    <p className="text-white">Tour Guide</p>
  </div>
  <div className="flex sm:items-center gap-3">
    <img src={Tickets} alt="" className="w-10 h-10" />
    <p className="text-white">Ticket Booking</p>
  </div>
  <div className="flex sm:items-center gap-3">
    <img src={Hotels} alt="" className="w-10 h-10" />
    <p className="text-white">Hotel Bookings</p>
  </div>
  <div className="flex sm:items-center gap-3">
    <img src={Permit} alt="" className="w-10 h-10" />
    <p className="text-white">Inner Line Permit</p>
  </div>
  
</div>

    </div>
  
    )}