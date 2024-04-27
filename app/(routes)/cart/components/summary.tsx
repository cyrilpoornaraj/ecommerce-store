"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    address: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Payment completed.');
      removeAll();
    }

    if (searchParams.get('canceled')) {
      toast.error('Something went wrong.');
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price)
  }, 0);

  const onCheckout = () => {
    // Set the constant price here (in paise)
    const amount = 99900; // Example: 999 INR

    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!, // Replace with your Razorpay Key ID
      amount: amount,
      currency: "INR",
      name: "Your Company Name",
      description: "Order Payment",
      handler: async (response) => {
        // Handle successful payment
        console.log(response);
        // You can send the response data to your server for further processing
        toast.success('Payment completed successfully.');
        removeAll();
      },
      prefill: {
        name: "John Doe", // Replace with customer's name or retrieve from user data
        email: "john@example.com", // Replace with customer's email or retrieve from user data
        contact: "9999999999" // Replace with customer's phone number or retrieve from user data
      },
      notes: {
        address: "Your Company Address" // Replace with your company's address
      },
      theme: {
        color: "#3399cc" // Set the theme color
      }
    };

    const razorpayCheckout = new window.Razorpay(options);
    razorpayCheckout.open();
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
      </div>
      <Button disabled={items.length === 0} onClick={onCheckout} className="w-full mt-6 text-white">
        Checkout
      </Button>
    </div>
  );
};

export default Summary;