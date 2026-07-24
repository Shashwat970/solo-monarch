import { forwardRef } from "react";

const GlitchButton = forwardRef(function GlitchButton(
  { as: Tag = "button", variant = "primary", children, arrow = false, className = "", ...rest },
  ref
) {
  const text = typeof children === "string" ? children : rest["data-text"] || "";
  const cls = `gbtn ${variant} ${className}`.trim();

  return (
    <Tag ref={ref} className={cls} data-text={text} {...rest}>
      <span className="sweep" />
      <span className="label">{children}</span>
      {arrow && <span className="arrow" />}
    </Tag>
  );
});

export default GlitchButton;