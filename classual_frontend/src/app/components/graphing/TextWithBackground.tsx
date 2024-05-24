import React, { useEffect, useRef, useState } from "react";

interface TextWithBackgroundProps {
  x?: number;
  y?: number;
  className: string;
  children?: React.ReactNode;
}

const VERTICAL_OFFSET_FACTOR = 0.3;

function TextWithBackground({
  x = 0,
  y = 0,
  className,
  children,
}: TextWithBackgroundProps) {
  const textRef = useRef<SVGTextElement | null>(null);
  const [textWidth, setTextWidth] = useState(0);
  const [textHeight, setTextHeight] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#0000");
  const [borderRadius, setBorderRadius] = useState(0);
  const [verticalPadding, setVerticalPadding] = useState(0);
  const [horizontalPadding, setHorizontalPadding] = useState(0);

  useEffect(() => {
    if (textRef.current) {
      const textBounds = textRef.current.getBBox();
      const computedStyle = getComputedStyle(textRef.current);
      setTextWidth(textBounds.width);
      setTextHeight(textBounds.height);
      setBackgroundColor(computedStyle.backgroundColor || "#0000");
      setBorderRadius(parseInt(computedStyle.borderRadius || "0", 10));
      setVerticalPadding(parseInt(computedStyle.paddingTop || "0", 10));
      setHorizontalPadding(parseInt(computedStyle.paddingLeft || "0", 10));
    }
  }, [children, className]);

  const textVerticalOffset = textHeight * VERTICAL_OFFSET_FACTOR;

  return (
    <>
      {textWidth > 0 && (
        <rect
          x={x}
          y={y - textHeight / 2 - verticalPadding}
          width={textWidth + horizontalPadding * 2}
          height={textHeight + verticalPadding * 2}
          fill={backgroundColor}
          rx={borderRadius}
          ry={borderRadius}
        />
      )}
      <text
        ref={textRef}
        x={x + horizontalPadding}
        y={y + textVerticalOffset}
        className={className}
      >
        {children}
      </text>
    </>
  );
}

export default TextWithBackground;
