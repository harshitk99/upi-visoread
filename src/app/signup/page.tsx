"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function Signup() {
    const [mobile, setMobile] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mobile || !name) return;
        setLoading(true);
        try {
            const res = await api.post("/auth/signup", { mobile, username: name });
            localStorage.setItem("mobile", res.data.user.mobile);
            localStorage.setItem("upiId", res.data.user.upiId);
            // Automatically "login"
            await api.post("/auth/login", { mobile });
            router.push("/dashboard");
        } catch (err: any) {
            alert(err.response?.data?.error || "Signup failed. User may already exist.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-sm shrink-0">
                <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>Enter your details to sign up</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
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
                            {loading ? "Creating account..." : "Sign Up"}
                        </Button>
                        <div className="text-center mt-4 text-sm">
                            <button type="button" className="text-blue-600 hover:underline" onClick={() => router.push("/login")}>
                                Already have an account? Sign in
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
