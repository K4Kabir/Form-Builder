
'use client'
import { useSession } from '@/lib/auth-client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'


const page = () => {

    const { data } = useSession()
    const router = useRouter()

    return (
        <div className='bg-[#f9fafb]'>
            <div>
                Create your form
            </div>
            <div>
                <Button onClick={() => router.push('/create')}>Create <Plus /></Button>
            </div>
        </div>
    )
}

export default page
