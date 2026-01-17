"use client"

import { Button } from "../ui/button"
import { signOut, useSession } from "@/lib/auth-client"
import { useRouter, usePathname } from "next/navigation"

const Header = function () {
    const { data: userSession } = useSession()
    const router = useRouter()
    const pathName = usePathname()

    const handleClick = async () => {
        if (pathName === '/dashboard') {
            await signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push('/auth/login')
                    }
                }
            })
        } else {
            router.push("/dashboard")
        }
    }

    return (
        <div className="p-5 flex items-center justify-between">
            <div className="text-3xl font-bold">
                Former.
            </div>
            <div>
                {
                    !userSession ? <Button onClick={() => router.push('/auth/login')} variant="outline">Login</Button> : <Button onClick={handleClick} variant="outline">{pathName === '/dashboard' ? "Logout" : "Dashboard"}</Button>
                }

            </div>
        </div>
    )
}

export default Header