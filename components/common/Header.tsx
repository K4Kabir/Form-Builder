"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, LogOut, LayoutDashboard } from "lucide-react"
import { signOut, useSession } from "@/lib/auth-client"
import { useRouter, usePathname } from "next/navigation"

const Header = () => {
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

    const getInitials = (name?: string) => {
        if (!name) return 'U'
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                                <FileText className="w-8 h-8 text-primary relative" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Former
                            </span>
                        </button>

                        {/* Navigation Links - Desktop */}
                        {userSession && (
                            <nav className="hidden md:flex items-center gap-1">
                                <Button
                                    variant={pathName === '/dashboard' ? 'secondary' : 'ghost'}
                                    className="gap-2"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    Dashboard
                                </Button>
                            </nav>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {!userSession ? (
                            <Button
                                onClick={() => router.push('/auth/login')}
                                variant="outline"
                            >
                                Login
                            </Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-10 w-10 rounded-full"
                                    >
                                        <Avatar className="h-10 w-10 border-2 border-primary/10">
                                            <AvatarImage
                                                src={userSession.user?.image || undefined}
                                                alt={userSession.user?.name || 'User'}
                                            />
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                {getInitials(userSession.user?.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {userSession.user?.name}
                                            </p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {userSession.user?.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {pathName !== '/dashboard' && (
                                        <DropdownMenuItem
                                            onClick={() => router.push('/dashboard')}
                                            className="gap-2 cursor-pointer"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            Dashboard
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem
                                        onClick={handleClick}
                                        className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        {pathName === '/dashboard' ? 'Logout' : 'Dashboard'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header