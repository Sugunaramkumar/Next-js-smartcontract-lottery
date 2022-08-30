import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { Moralis, chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const dispatch = useNotification()

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddresses: raffleAddress, //specify the networkId,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddresses: raffleAddress, //specify the networkId,
        functionName: "getEntranceFee",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            //try to read the raffle entrance fee
            async function updateUI() {
                // const entranceFeeFromCall = (await getEntranceFee()).toString()
                // setEntranceFee(entranceFeeFromCall)
                const options = { abi, contractAddress: raffleAddress }
                const fee = await Moralis.executeFunction({
                    functionName: "getEntranceFee",
                    ...options,
                })
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (transaction) {
        await transaction
        updateUI()
    }

    return (
        <div>
            Hello from LotteryEntrance!
            {raffleAddress ? (
                <div>
                    <button
                        onClick={async function () {
                            await enterRaffle({
                                onComplete: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Enter Raffle
                    </button>
                    Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                </div>
            ) : (
                <div>No Raffle Address Detected</div>
            )}
        </div>
    )
}
