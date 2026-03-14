"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function Login() {
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mobile) return;
        setLoading(true);
        try {
            const res = await api.post("/auth/login", { mobile });
            localStorage.setItem("mobile", mobile);
            localStorage.setItem("upiId", res.data.upiId);
            router.push("/dashboard");
        } catch (err: any) {
            alert(err.response?.data?.error || "Login failed. Check if user exists.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-sm shrink-0">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Enter your mobile number to sign in</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="mobile">Mobile Number</Label>
                            <Input
                                id="mobile"
                                type="tel"
                                placeholder="9876543210"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                        <div className="text-center mt-4 text-sm">
                            <button type="button" className="text-blue-600 hover:underline" onClick={() => router.push("/signup")}>
                                Don't have an account? Sign up
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
