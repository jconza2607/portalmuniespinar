"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function ColorPlate() {
  const colors = [
    "#1A76D1",
    "#2196F3",
    "#32B87D",
    "#FE754A",
    "#F82F56",
    "#01B2B7",
    "#6C5CE7",
    "#85BA46",
    "#273C75",
    "#FD7272",
    "#BADC58",
    "#44CE6F",
  ];

  const [primaryColor, setPrimaryColor] = useState(colors[0]);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", primaryColor);

    // Convertir HEX a RGB
    const hexToRgb = (hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const { r, g, b } = hexToRgb(primaryColor);

    // Definir variables derivadas
    document.documentElement.style.setProperty("--primary-color-soft", `rgba(${r}, ${g}, ${b}, 0.08)`);
    document.documentElement.style.setProperty("--primary-color-text", `rgb(${Math.max(r - 40, 0)}, ${Math.max(g - 40, 0)}, ${Math.max(b - 40, 0)})`);
    document.documentElement.style.setProperty("--primary-color-bg-hover", `rgba(${r}, ${g}, ${b}, 0.12)`);
    document.documentElement.style.setProperty("--primary-color-bg-icon", `rgba(${r}, ${g}, ${b}, 0.15)`);
    document.documentElement.style.setProperty("--primary-color-bg-hover-admin", `rgba(${r}, ${g}, ${b}, 0.1)`);
  }, [primaryColor]);

  const handleColorClick = (color) => {
    setPrimaryColor(color);
  };

  const [optionsOpen, setOptionsOpen] = useState(false);

  const toggleOptions = () => {
    setOptionsOpen(!optionsOpen);
  };

  return (
    <>
      <div className={`color-plate ${optionsOpen ? "active" : ""}`}>
        <div className="color-plate-icon" onClick={toggleOptions}>
          <i className="fa fa-cog fa-spin"></i>
        </div>
        <h4>Medikit</h4>
        <p>Here is some awesome color&apos;s available on Medikit Template.</p>
        {colors.map((color, index) => (
          <ColorOption key={index} color={color} onClick={handleColorClick} />
        ))}
      </div>
    </>
  );
}

const ColorOption = ({ color, onClick }) => {
  return (
    <div
      className="color-option"
      style={{
        backgroundColor: color,
      }}
      onClick={() => onClick(color)}
    ></div>
  );
};
