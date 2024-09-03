"use client";
import { useState } from "react";
import Script from "next/script";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import useCartStore from "@/store/cart";
import { BuyNow } from "@/actions/customer.action";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface VerificationData {
  orderCreationId: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

const CheckoutWithRazorpayAndAdmin: React.FC = () => {
  const { cartItems, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const createOrderId = async (amount: number): Promise<string> => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount * 100 }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Razorpay order ID");
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("Error creating order ID:", error);
      toast.error("Failed to initiate checkout. Please try again.");
      throw error;
    }
  };

  const verifyPayment = async (data: VerificationData): Promise<boolean> => {
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Payment verification failed");
      }

      const result = await response.json();
      return result.isOk;
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error("Payment verification failed. Please contact support.");
      return false;
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    const amount = cartItems.reduce((acc, curr) => acc + curr.price, 0);

    try {
      const orderId = await createOrderId(amount);

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Your Company Name",
        description: "Product Purchase",
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          const verificationData: VerificationData = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const isVerified = await verifyPayment(verificationData);

          if (isVerified) {
            toast.success("Payment successful!");
            await BuyNow(cartItems);
            clearCart();
          } else {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
        },
        theme: {
          color: "#FAFAF1",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", (response: any) => {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Button className="w-full" onClick={handlePayment} disabled={loading}>
        Checkout {loading && <LoaderCircle className="ml-2 animate-spin" />}
      </Button>
    </>
  );
};

export default CheckoutWithRazorpayAndAdmin;