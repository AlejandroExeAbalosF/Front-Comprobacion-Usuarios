import { useState, useEffect } from "react";

const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detectar si el dispositivo es táctil
    const checkTouchDevice = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };

    checkTouchDevice(); // Verificar al cargar el componente
    window.addEventListener("pointerdown", checkTouchDevice); // Verificar en cada interacción

    return () => {
      window.removeEventListener("pointerdown", checkTouchDevice);
    };
  }, []);

  return isTouchDevice;
};

export default useIsTouchDevice; // Exporta el hook
