"use client"

import { useEffect, useState } from "react";

const formatted = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "INR",
});

interface CurrencyProps {
  value?: string | number;
}

const Currency: React.FC<CurrencyProps> = ({ value }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if(!isMounted){
        return null;
    }

  return <div className="font-semibold">{formatted.format(Number(value))}</div>;
};

export default Currency;
