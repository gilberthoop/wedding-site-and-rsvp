import { useState, useEffect } from 'react';

interface CountdownValues {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const WEDDING_DATE = new Date('2027-05-08T12:00:00');

export const useCountdown = (): CountdownValues => {
  const calculate = (): CountdownValues => {
    const diff = WEDDING_DATE.getTime() - Date.now();
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
    }
    const totalSeconds = Math.floor(diff / 1000);
    return {
      days:     Math.floor(totalSeconds / 86400),
      hours:    Math.floor((totalSeconds % 86400) / 3600),
      minutes:  Math.floor((totalSeconds % 3600) / 60),
      seconds:  totalSeconds % 60,
      isExpired: false,
    };
  };

  const [values, setValues] = useState<CountdownValues>(calculate);

  useEffect(() => {
    const id = setInterval(() => setValues(calculate()), 1000);
    return () => clearInterval(id);
  }, []);

  return values;
}
