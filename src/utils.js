import { ethers } from "ethers"

import contractAbi from "./contracts/abi.json"
import contractAddress from "./contracts/contract_address.json"

const getProvider = async (ethereum) => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    await provider.send("eth_requestAccounts", []);
    return provider
}

const getSigner = async (ethereum) => {
    const provider = await getProvider(ethereum)
    return provider.getSigner()
}



const getContract = async (ethereum) => {
    const signer = await getSigner(ethereum)

    const contract = new ethers.Contract(contractAddress.contractAddress, contractAbi.abi, signer)

    return contract
}


export const isStakeholder = async (ethereum, account) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.stakeHolderExists(account)
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}

export const getUserDetails = async(ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.getStakeholderDetails()
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}

export const getUserBalance = async(ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.getBalance()
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}


export const isStudent = async(ethereum, account) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.studentshipCheck(account)
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}


export const isResultAnnounced = async(ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.isResultAnnounced();
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}

export const hasElectionStarted = async(ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.hasElectionStarted();
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}

export const canStartContesting = async(ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.canStillExpressInterest()
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}

export const castVote = async(ethereum, candidate, category) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.placeVote(candidate, category)
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}

export const getCandidates = async(ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.candidates();
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}

