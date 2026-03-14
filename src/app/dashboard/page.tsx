"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { BottomNav } from "@/components/BottomNav";
import { QrCode, ArrowRightLeft } from "lucide-react";

export default function Dashboard() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        const mobile = localStorage.getItem("mobile");
        if (!mobile) {
            router.push("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const userRes = await api.get(`/auth/status/${mobile}`);
                setData(userRes.data);
                const balRes = await api.get(`/auth/balance/${mobile}`);
                setBalance(balRes.data.balance);
            } catch (err: any) {
                if (err.response?.status === 403) {
                    router.push("/login");
                } else {
                    console.error(err);
                }
            }
        };

        fetchData();
    }, [router]);

    return (
        <div className="min-h-screen bg-white pb-24 font-sans text-black">
            <div className="p-4 space-y-4 max-w-md mx-auto relative pt-8">
                <div className="bg-white/80 backdrop-blur-md rounded-xl p-3 shadow-sm border mb-4 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs">✔</div>
                    <span className="text-sm font-medium">Login successful</span>
                </div>

                <Card className="rounded-3xl border border-gray-100 shadow-sm bg-gray-50/50">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-gray-500 font-medium">Current Balance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-semibold">₹{balance !== null ? balance : "..."}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Available</p>
                    </CardContent>
                </Card>

                <Card className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base font-semibold">Receive Payments</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center pb-8 pt-4">
                        <div className="w-56 h-56 bg-white border rounded-2xl p-4 shadow-sm flex items-center justify-center mb-4">
                            {data?.qrCodeUrl ? (
                                <img src={data.qrCodeUrl} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                            ) : (
                                <QrCode className="w-16 h-16 text-gray-300" />
                            )}
                        </div>
                        <p className="text-sm font-medium text-gray-600">{data?.upiId || "Loading..."}</p>
                    </CardContent>
                </Card>

                <div className="flex gap-3 pt-2">
                    <Button
                        className="flex-1 rounded-2xl h-14 bg-black text-white hover:bg-black/90 text-sm font-medium"
                        onClick={() => router.push("/scan")}
                    >
                        Scan QR
                    </Button>
                    <Button
                        className="flex-1 rounded-2xl h-14 bg-black text-white hover:bg-black/90 text-sm font-medium"
                        onClick={() => router.push("/history")}
                    >
                        Transactions
                    </Button>
                </div>
            </div>
            <BottomNav />
        </div>
    );
}
