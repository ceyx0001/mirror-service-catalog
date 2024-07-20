import useFade from "../../hooks/useFade";
import discordIcon from "../../assets/discord-mark-white.svg";
import emailIcon from "../../assets/communication.png";

// dialog containing contact information
export function Contact() {
  const { visible, faded, handleToggle, hide } = useFade();

  return (
    <div className="relative text-primary" onBlur={hide}>
      <button
        type="button"
        aria-label="Contact"
        onClick={handleToggle}
      >
        <span className="text-primary hover:text-text transition-colors">Contact</span>
      </button>

      <div
        className={`grid grid-flow-row absolute -left-[9rem] top-12 border-secondary border bg-black rounded-lg min-w-max p-4 space-y-3 text-sm ${
          visible ? "animate-fade-in" : "animate-fade-out"
        } ${faded && "hidden"}`}
      >
        <div className="flex items-center space-x-3">
          <img src={discordIcon} className="w-7 h-7" />
          <p>mirror.catalog</p>
        </div>
        <div className="flex items-center space-x-3">
          <img src={emailIcon} className="w-7 h-7" />
          <p>mirror.catalog@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
