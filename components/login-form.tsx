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
import { signIn } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import SignInOauth from "./sign-in-OAuth"


interface loginInterface {
  email: string
  password: string
}


const formdata = [
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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {



  const [data, setData] = useState<loginInterface>({ email: "", password: "" })
  const router = useRouter()

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await signIn.email({ ...data },
      {
        onRequest: () => { },
        onResponse: () => { },
        onError: (ctx) => { toast(ctx.error.message) },
        onSuccess: () => {
          // Your route after login
          router.push('/dashboard')
        }
      }

    )
  }


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
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
                  Login
                </Button>

              </div>
            </div>
          </form>
          <div className="mt-3">
            <SignInOauth />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
