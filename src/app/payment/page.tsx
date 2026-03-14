"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, ArrowLeft, ScanFace } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export default function PaymentPage() {
    const router = useRouter();
    const [status, setStatus] = useState<"processing" | "success" | "auth">("auth");
    const [paymentData, setPaymentData] = useState<any>(null);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const mobile = localStorage.getItem("mobile");
        if (!mobile) {
            router.push("/login");
            return;
        }

        const pending = localStorage.getItem("pendingPayment");
        if (pending) {
            setPaymentData(JSON.parse(pending));
        } else {
            router.push("/dashboard");
        }
    }, [router]);

    const processPayment = async () => {
        if (!paymentData) return;
        setStatus("processing");
        const sender = localStorage.getItem("upiId");
        try {
            const res = await api.post("/payment", {
                sender: sender,
                receiver: paymentData.receiver,
                amount: paymentData.amount
            });
            setResult(res.data);
            setStatus("success");
            localStorage.removeItem("pendingPayment");
        } catch (err: any) {
            alert(err.response?.data?.error || "Payment processing failed.");
            router.push("/dashboard");
        }
    };

    if (status === "auth") {
        return (
            <div className="min-h-screen bg-orange-950 flex flex-col items-center justify-center p-6 text-white text-center">
                <h2 className="text-xl mb-4 font-medium opacity-80">Authenticate to pay</h2>
                <h1 className="text-4xl font-bold mb-8">₹{paymentData?.amount || "..."}</h1>
                <p className="text-sm opacity-60 mb-12">to {paymentData?.receiver || "..."}</p>
                <button
                    onClick={processPayment}
                    className="bg-blue-500 w-24 h-24 rounded-full flex items-center justify-center hover:bg-blue-600 transition"
                >
                    <ScanFace strokeWidth={1.5} size={48} />
                </button>
                <p className="mt-8 opacity-60 text-sm max-w-xs">Simulated Face ID/Touch ID to initiate transaction</p>
            </div>
        );
    }

    if (status === "processing") {
        return (
            <div className="min-h-screen bg-orange-900 flex flex-col items-center justify-center p-4">
                {/* Processing View mimicking the screenshot */}
                <div className="animate-pulse flex flex-col items-center justify-center space-y-4">
                    <div className="flex flex-col gap-1 items-center opacity-80 mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black transform -scale-x-100">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-black transform scale-x-100 rotate-180 -mt-8">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                        </svg>
                    </div>
                    <div className="bg-orange-800/80 px-4 py-2 rounded-lg text-white font-medium">
                        Processing payment...
                    </div>
                </div>
            </div>
        );
    }

    // Success state matching Image 1
    return (
        <div className="min-h-screen bg-white">
            {/* Top Header */}
            <div className="flex bg-black text-white px-4 py-3 items-center justify-center relative">
                <span className="text-sm font-medium">11:30</span>
            </div>

            <div className="p-4 pt-12 max-w-md mx-auto relative">
                <Card className="rounded-3xl border border-gray-200 shadow-xl overflow-hidden mb-8">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center text-sm font-medium text-gray-800 mb-2">
                            <div className="flex gap-2 text-[15px]">
                                <span>{result?.sender?.upiId || localStorage.getItem("upiId")}</span>
                                <span className="text-gray-400">→</span>
                                <span>{result?.receiver?.upiId || paymentData?.receiver}</span>
                            </div>
                            <span className="text-lg font-bold">₹{paymentData?.amount}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                            success • {new Date().toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Re-use bottom nav just so it looks like the screenshot */}
            <BottomNav />
        </div>
    );
}
