import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { signUp } from "@/lib/auth-client"
import { toast } from "sonner"
import Link from "next/link"


interface registerInterface {
    name: string
    email: string
    password: string
}


const formdata = [
    {
        name: "name",
        title: "Name",
        required: true,
        type: 'text'
    },
    {
        name: "email",
        title: "Email",
        required: true,
        type: 'email'
    },
    {
        name: "password",
        title: "Password",
        required: true,
        type: 'password'
    },

]

export function SignUpForm({
    className,
    ...props
}: React.ComponentProps<"div">) {



    const [data, setData] = useState<registerInterface>({ name: "", email: "", password: "" })

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await signUp.email({ ...data },
            {
                onRequest: () => { },
                onResponse: () => { },
                onError: (ctx) => { toast(ctx.error.message) },
            }

        )
    }


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Register to your account</CardTitle>
                    <CardDescription>
                        Enter your details to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => handleSubmit(e)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                {
                                    formdata?.map((f, index) => {
                                        return (
                                            <div key={index}>
                                                <Label>{f?.title}</Label>
                                                <Input
                                                    onChange={(e) => handleInput(e)}
                                                    id={f?.name}
                                                    type={f?.type}
                                                    placeholder={f?.title}
                                                    required={f?.required}
                                                    name={f?.name}
                                                />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button type="submit" className="w-full">
                                    Register
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Login with Google
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Login with Email and Password{" "}
                            <Link href="/auth/login" className="underline underline-offset-4">
                                Login
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
