import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';
import { themeChange } from 'theme-change';
/**
 * A custom hook for handling dark mode toggle in a React component.
 * It stores the dark mode toggle state in the local storage, so that the
 * toggle state persists across page reloads.
 *
 * @returns {Array} An array containing the current dark mode toggle state
 * and a function to update it.
 */

const useDarkMode = () => {
  const [enabled, setEnabled] = useLocalStorage('dark-theme');
  const isEnabled = typeof enabledState === 'undefined' && enabled;

  useEffect(() => {
    
    const className = 'dark'
    const bodyClass = window.document.body.classList
    const html = document.getElementsByTagName("html")[0]
    
    if (isEnabled) {
      bodyClass.remove(className)
      html.setAttribute("data-theme", "light") 
    } else {
      bodyClass.add(className)
      html.setAttribute("data-theme", className) 
    }

  }, [enabled, isEnabled]);

  return [enabled, setEnabled];
}

export default useDarkMode