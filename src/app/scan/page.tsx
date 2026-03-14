"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { Scanner } from '@yudiel/react-qr-scanner';

export default function ScanPage() {
    const router = useRouter();
    const [showManual, setShowManual] = useState(false);
    const [upiId, setUpiId] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [scanned, setScanned] = useState(false);

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!upiId || !amount) return;
        setLoading(true);
        try {
            await api.get(`/auth/user/by-upi/${encodeURIComponent(upiId)}`);
            const senderMobile = localStorage.getItem("mobile");
            if (!senderMobile) {
                router.push("/login");
                return;
            }
            localStorage.setItem("pendingPayment", JSON.stringify({
                receiver: upiId,
                amount: Number(amount)
            }));
            router.push("/payment");
        } catch (err) {
            alert("Invalid UPI ID or User not found.");
            setLoading(false);
        }
    };

    const handleScan = (text: string) => {
        if (scanned) return;
        try {
            if (text.startsWith("upi://pay")) {
                const url = new URL(text);
                const pa = url.searchParams.get("pa");
                if (pa) {
                    setScanned(true);
                    setUpiId(pa);
                    setShowManual(true);
                }
            } else if (text.includes("@upi")) {
                setScanned(true);
                setUpiId(text.trim());
                setShowManual(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-black relative flex flex-col pt-12 overflow-hidden">
            <div className="absolute top-12 left-0 right-0 p-4 z-20">
                <div className="flex justify-between items-center text-white">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="text-white hover:bg-white/20 rounded-full h-10 w-10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                    </Button>
                    <div className="bg-black/50 backdrop-blur px-4 py-1.5 rounded-full text-xs mx-auto border border-white/10 mt-2">
                        Point camera at QR code
                    </div>
                </div>
            </div>

            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <div className="w-[150%] h-[150%] opacity-80">
                    <Scanner
                        onScan={(detectedCodes) => {
                            if (detectedCodes && detectedCodes.length > 0) {
                                handleScan(detectedCodes[0].rawValue);
                            }
                        }}
                        onError={(error) => console.log((error as Error)?.message)}
                        scanDelay={1000}
                    />
                </div>
            </div>

            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none px-8">
                <div className="w-full aspect-square max-w-sm rounded-[40px] border-4 border-dashed border-red-500/80 relative bg-transparent">
                    <svg className="absolute -bottom-10 right-2 w-8 h-8 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M11 21v-7H7l8-11v7h4l-8 11z" />
                    </svg>
                </div>
            </div>

            <div className="absolute bottom-12 left-0 right-0 px-6 flex justify-center z-20">
                <Button
                    className="w-full max-w-sm h-14 bg-black border border-white/20 text-white rounded-2xl text-base font-medium shadow-2xl hover:bg-black/90 pointer-events-auto"
                    onClick={() => {
                        setScanned(true);
                        setShowManual(true);
                    }}
                >
                    Enter UPI ID manually
                </Button>
            </div>

            <Dialog
                open={showManual}
                onOpenChange={(open) => {
                    setShowManual(open);
                    if (!open) {
                        setScanned(false);
                        setUpiId("");
                    }
                }}
            >
                <DialogContent className="w-[90%] max-w-md rounded-2xl pb-8 z-50">
                    <DialogHeader>
                        <DialogTitle>Make Payment</DialogTitle>
                        <DialogDescription>Enter UPI ID and amount to pay.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePay} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="upi">Receiver UPI ID</Label>
                            <Input
                                id="upi"
                                type="text"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                placeholder="name@upi"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (₹)</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                required
                                min="1"
                            />
                        </div>
                        <Button type="submit" className="w-full rounded-xl" disabled={loading}>
                            {loading ? "Verifying..." : "Continue"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
