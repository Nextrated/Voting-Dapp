import { ethers } from "ethers";
import abi from "./contracts/abi.json"
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

export const getContract = async (ethereum) => {
    const signer = await getSigner(ethereum)

    const contract = new ethers.Contract(contractAddress, abi, signer)

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

export const isVoteCordinator = async (ethereum, account) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.isVoteCordinator(account)
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

export const getUserBalance = async(ethereum,acc) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.balanceOf(acc)
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
        const txnResult = contract.isElectionOn();
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

export const castVote = async(ethereum, candidates, categories, categoryId) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.placeVote(candidates, categories, categoryId)
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}

export const getCandidates = async(ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = await contract.getContestantDetails();
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}

export const getElectionCategory = async(ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.getCurrentCategory();
        return txnResult;
    } catch(error) {
        console.log("Error: ", error)
    }
}

export const showInterest = async(contestantName,category,ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const id = await contract.getCategoryId(category);
        const txnResult = contract.expressInterest(contestantName,category,id);
        return txnResult;
    } catch(error) {
        console.log(error.message)
    }
}

export const startContestTime = async(time,ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.startShowInterest(time)
        return txnResult;
    } catch(error) {
        console.log(error.message)
    }
}

export const startElectionTime = async(time,ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.startElection(time)
        return txnResult;
    } catch(error) {
        console.log(error.message)
    }
}

export const compileResults = async(ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const txnResult = contract.compileVotes()
        return txnResult;
    } catch(error) {
        console.log(error.message)
    }
}


export const seePublicResults = async(ethereum) => {
    try {
        const contract = await getContract(ethereum)
        const result = await contract.getPublicResults();
        return result;
    } catch(error) {
        console.log(error.message)
    }
}




