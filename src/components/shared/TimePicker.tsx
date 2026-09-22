import { useState } from "react";


const TIME_OPTIONS = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? 0 : 30;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
});

const formatTimeForDisplay = (time: string) => {
  if (!time) return "";

  const [hours, minutes] = time.split(":").map(Number);

  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${displayHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  disabled = false,
  isTimeDisabled,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isTimeDisabled?: (time: string) => boolean;
}) {
  const [open, setOpen] = useState(false);

  const selectedIndex = TIME_OPTIONS.indexOf(value);

  const handleSelect = (time: string) => {
    if (isTimeDisabled?.(time)) return;

    onChange(time);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-700 bg-neutral-950 px-3 text-left text-sm text-white ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:border-yellow-300"
        }`}
      >
        <span className={value ? "text-white" : "text-gray-400"}>
          {value ? formatTimeForDisplay(value) : placeholder}
        </span>

        <span className="text-gray-400">▾</span>
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-md border border-gray-700 bg-neutral-950 shadow-xl">
          <div className="h-[240px] overflow-y-auto">
            {TIME_OPTIONS.map((time, index) => {
              const timeDisabled = isTimeDisabled?.(time) ?? false;
              const selected = time === value;

              return (
                <button
                  key={time}
                  ref={(element) => {
                    if (
                      selected &&
                      element &&
                      selectedIndex === index
                    ) {
                      element.scrollIntoView({
                        block: "center",
                      });
                    }
                  }}
                  type="button"
                  disabled={timeDisabled}
                  onClick={() => handleSelect(time)}
                  className={`flex h-10 w-full items-center px-4 text-sm transition ${
                    selected
                      ? "bg-yellow-300 text-black font-semibold"
                      : timeDisabled
                      ? "cursor-not-allowed text-gray-600"
                      : "text-white hover:bg-neutral-800"
                  }`}
                >
                  {formatTimeForDisplay(time)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default TimePicker;