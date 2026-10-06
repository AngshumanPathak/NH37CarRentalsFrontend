
import Airplane from "../../assets/icons/airplane.svg";
import Clock from "../../assets/icons/clock.svg";
import Deposit from "../../assets/icons/deposit.svg";
import Driver from "../../assets/icons/driver.svg";
import Tickets from "../../assets/icons/tickets1.svg";
import Hotels from "../../assets/icons/hotel.svg";
import Permit from "../../assets/icons/location.svg";
import Guide from "../../assets/icons/guide.svg";

export const Services = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-10 mb-10 px-4 sm:px-0">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 sm:gap-x-16 gap-y-8 sm:gap-y-6 mt-10 w-full max-w-5xl">
        
        <div className="flex items-center gap-3 min-w-0">
          <img src={Deposit} alt="" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
          <p className="text-white text-sm sm:text-base leading-tight">
            No security deposit
          </p>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <img src={Driver} alt="" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
          <p className="text-white text-sm sm:text-base leading-tight">
            Car with driver
          </p>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <img src={Clock} alt="" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
          <p className="text-white text-sm sm:text-base leading-tight">
            24x7 pickup and drop
          </p>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <img src={Airplane} alt="" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
          <p className="text-white text-sm sm:text-base leading-tight">
            Airport pickup and drop
          </p>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <img src={Guide} alt="" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
          <p className="text-white text-sm sm:text-base leading-tight">
            Tour Guide
          </p>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <img src={Tickets} alt="" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
          <p className="text-white text-sm sm:text-base leading-tight">
            Ticket Booking
          </p>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <img src={Hotels} alt="" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
          <p className="text-white text-sm sm:text-base leading-tight">
            Hotel Bookings
          </p>
        </div>

        <div className="flex items-center gap-3 min-w-0">
          <img src={Permit} alt="" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0" />
          <p className="text-white text-sm sm:text-base leading-tight">
            Inner Line Permit
          </p>
        </div>

      </div>
    </div>
  );
};

