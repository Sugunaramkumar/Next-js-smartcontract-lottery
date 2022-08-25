import { useMoralis } from "react-moralis"
import { useEffect } from "react"
export default function Header() {
    const { enableWeb3, account, isWebEnabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()
    useEffect(() => {
        if (isWebEnabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWebEnabled])
    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])
    return (
        <div>
            {account ? (
                <div>
                    Connected to {account.slice(0, 6)}...{account.length - 4}
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()
                        if (typeof window !== "undefined") {
                            window.localStorage.getItem("connected", "inject")
                        }
                    }}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}
