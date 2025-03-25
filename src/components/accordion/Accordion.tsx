import { ChevronDown, ChevronUp } from "react-feather";
import "./acordeonStyle.css";
interface AccordionProps {
  children?: React.ReactNode;
  title: string;
  icon?: React.ReactNode;
  activeAccordion: string;
  setActiveAccordion: (t: string) => void;
}
const Accordion: React.FC<AccordionProps> = ({ children, title, icon, activeAccordion, setActiveAccordion }) => {
  const handleAction = (t: string) => {
    if (t === activeAccordion) setActiveAccordion("");
    else setActiveAccordion(t);
  };
  return (
    // <div className="acordeon">
    //   <div className={`acor_item `}>
    //     <div className="acor_header">
    //       <h3>{title}</h3>
    //       <ChevronDown />
    //     </div>
    //     <div className="acor_content">{children}</div>
    //   </div>
    // </div>
    <div className="accordion">
      <div className="accordion_heading">
        <div onClick={() => handleAction(title)} className="container bg-[#f0f8ff]">
          <span className="mr-1">{icon}</span>
          <p className="text-[18px]">{title}</p>
          <span className="flex-[1] flex justify-end">{activeAccordion === title ? <ChevronDown /> : <ChevronUp />}</span>
        </div>
      </div>

      <div className={`accordion_content ${activeAccordion === title ? "open" : "close"} `}>
        <div className="content_container transition-all duration-[2s]">{children}</div>
      </div>
    </div>
  );
};
export default Accordion;
