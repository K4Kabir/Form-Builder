import React from 'react'
import { Button } from './ui/button'
import { signIn } from '@/lib/auth-client'

const SignInOauth = () => {


    const handleLoginWithGoogle = async function () {
        await signIn.social({
            provider: "google",
            callbackURL: "/profile",

        })
    }

    return (
        <div>
            <Button onClick={handleLoginWithGoogle}>Sign-in with Google</Button>
        </div>
    )
}

export default SignInOauth
