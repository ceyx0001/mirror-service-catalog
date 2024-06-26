import { MouseEvent, ReactElement, useState } from "react";

// tooltip that appears on hover of the parent container
export function Tooltip({
  baseText = "tooltip",
  eventText = "clicked",
  children,
}: {
  baseText?: string;
  eventText?: string;
  children: ReactElement;
}) {
  const [hovered, setHovered] = useState(false);
  const [tooltip, setTooltip] = useState(baseText);

  function handleClick(e: MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    setTooltip(eventText);
    setTimeout(() => {
      setTooltip(baseText);
    }, 2000);
  }

  return (
    <div className="w-min h-min invisible relative">
      <div className="visible">
        <span
          role="tooltip"
          className={`text-text text-[1rem] absolute -top-[170%] left-1/2 -translate-x-1/2 transition-opacity ease-in whitespace-nowrap bg-background p-2 rounded-lg ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {tooltip}
        </span>
        <div
          onMouseLeave={() => {
            setHovered(false);
          }}
          onMouseEnter={() => setHovered(true)}
          onClick={(e) => handleClick(e)}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
