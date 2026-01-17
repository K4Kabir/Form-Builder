

const AuthLayout = function ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="p-8 h-screen flex justify-center items-center">
            {children}
        </div>
    );
}

export default AuthLayout
