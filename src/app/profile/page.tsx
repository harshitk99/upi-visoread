"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const mobile = localStorage.getItem("mobile");
        if (!mobile) {
            router.push("/login");
            return;
        }

        api.get(`/auth/status/${mobile}`).then((res) => {
            setData(res.data);
        }).catch(() => {
            router.push("/login");
        });
    }, [router]);

    const handleLogout = async () => {
        try {
            if (data?.mobile) {
                await api.post("/auth/logout", { mobile: data.mobile });
            }
        } catch (e) { }
        localStorage.clear();
        router.push("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-12 text-black">
            <div className="flex-1 px-6 pt-12">
                <h1 className="text-3xl font-bold mb-8">Profile</h1>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Name</p>
                            <p className="font-semibold text-lg">{data?.username || "..."}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Mobile Number</p>
                            <p className="font-semibold text-lg">{data?.mobile || "..."}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">UPI ID</p>
                            <p className="font-semibold text-lg">{data?.upiId || "..."}</p>
                        </div>
                    </div>
                </div>

                <Button
                    variant="destructive"
                    className="w-full rounded-xl py-6 hover:bg-red-600 transition"
                    onClick={handleLogout}
                >
                    Sign Out
                </Button>
            </div>

            <BottomNav />
        </div>
    );
}
