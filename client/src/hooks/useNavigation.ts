import { useState, useEffect } from "react";

export const useNavigate = () => {
  const [currentPath, setCurrentPath] = useState(
    () => window.location.pathname,
  );

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigateTo = (path: string): void => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  return { currentPath, navigateTo };
};
