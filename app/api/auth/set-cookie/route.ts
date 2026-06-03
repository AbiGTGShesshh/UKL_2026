    import { NextResponse } from "next/server"

    export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { token } = body || {}

        if (!token) {
        return NextResponse.json({ message: "token is required" }, { status: 400 })
        }

        const res = NextResponse.json({ message: "cookie set" })

        // set httpOnly cookie
        res.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        return res
    } catch (err) {
        return NextResponse.json({ message: "invalid request" }, { status: 400 })
    }
    }
