"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";

export default function HistoryPage() {
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [upiId, setUpiId] = useState("");

    useEffect(() => {
        const mobile = localStorage.getItem("mobile");
        const upi = localStorage.getItem("upiId");
        if (!mobile || !upi) {
            router.push("/login");
            return;
        }
        setUpiId(upi);

        api.get(`/payment/history/${encodeURIComponent(upi)}`)
            .then((res) => {
                setData(res.data.transactions || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 pb-24 text-black">
            <div className="bg-white px-4 py-8 shadow-sm">
                <h1 className="text-xl font-bold">Transaction History</h1>
            </div>

            <div className="p-4 space-y-3">
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : data.length === 0 ? (
                    <p className="text-gray-500">No transactions found.</p>
                ) : (
                    data.map((txn, i) => {
                        const isSent = txn.sender === upiId;
                        return (
                            <Card key={i} className={`rounded-xl border ${txn.status === "success" ? "border-gray-100" : "border-red-100 bg-red-50/20"}`}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between mb-2">
                                        <div>
                                            <h3 className="font-semibold text-sm">
                                                {isSent ? `Paid to ${txn.receiver}` : `Received from ${txn.sender}`}
                                            </h3>
                                            <p className="text-xs text-gray-500">{new Date(txn.createdAt).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-bold ${isSent ? "text-gray-900" : "text-green-600"}`}>
                                                {isSent ? "-" : "+"}₹{txn.amount}
                                            </span>
                                            {txn.status !== "success" && (
                                                <p className="text-xs text-red-500 font-medium">Failed</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>

            <BottomNav />
        </div>
    );
}
