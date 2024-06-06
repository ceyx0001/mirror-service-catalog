import { useState } from "react";

// Custom hook for handling fade in and out
function useFade(initialVisible = false, initialFaded = true, timeout = 140) {
  const [visible, setVisible] = useState(initialVisible);
  const [faded, setFaded] = useState(initialFaded);

  function hide() {
    setTimeout(() => {
      setFaded(true);
    }, timeout);
    setVisible(false);
  }

  function handleToggle() {
    if (visible) {
      hide();
    } else {
      setVisible(true);
      setFaded(false);
    }
  }

  return { visible, faded, handleToggle, hide };
}

export default useFade;
