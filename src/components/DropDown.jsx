"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const Dropdown = ({ options = [], trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setIsOpen(false);
    if (option.to) router.push(option.to);
    if (option.onClick) option.onClick();
  };

  const clonedTrigger =
    trigger && trigger({ onClick: () => setIsOpen((prev) => !prev) });

  return (
    <div className="dropdown-wrapper" ref={dropdownRef}>
      {clonedTrigger}
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li
              key={option.label}
              className="dropdown-item"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;

