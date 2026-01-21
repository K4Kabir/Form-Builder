import { Spinner } from "../ui/spinner"

const FullPageLoader = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center fixed top-0  z-100">
            <Spinner />
        </div>
    )
}

export default FullPageLoader