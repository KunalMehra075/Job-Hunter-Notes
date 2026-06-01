import useReveal from "./useReveal";
import { cn } from "../../lib/utils";

// Wraps children in a scroll-triggered fade-up.
const Reveal = ({ as: Tag = "div", className, style, children, ...props }) => {
  const [ref, inView] = useReveal();
  return (
    <Tag
      ref={ref}
      style={style}
      className={cn("rn-reveal", inView && "rn-in", className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
