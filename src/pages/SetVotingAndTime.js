import React, {useState, useEffect} from 'react';
import {
  FormLabel,
  Input,
  Box,
  Text,
  Center,
  Button,
  useToast,
  Radio,
  RadioGroup
} from '@chakra-ui/react';

import {ethers} from 'ethers'

import contractAddress from '../contracts/contract_address.json'
import abi from '../contracts/abi.json';
import {startContestTime, startElectionTime} from "../utils"

const SetVotingAndTime = () => {
    const toast = useToast ();
    const [categoryDescription, setCategoryDescription] = useState('')
    const [eligibility, setEligibility] = useState('');
    const [interestTime, setInterestTime] = useState('');
    const [electionTime, setElectionTime] = useState('');
    const [submitted, setSubmitted] = useState ('');
    const [isCategorySet, setIsCategorySet] = useState (false);
    const [currentCategory, setCurrentCategory] = useState({
      category: "",
      role:""
    });

    const showErrorToast = message => {
      toast ({
        title: 'Unsuccessful',
        description: message,
        status: 'error',
        duration: '5000',
        isClosable: true,
      });
    };

    const handleTime = (e) => {
      const time = e.target.value;
      setInterestTime(time);
      //console.log("tymeee", time)
    }

    const handleElectionTime = (e) => {
      const time = e.target.value;
      setElectionTime(time);
      //console.log("tymeee", time)
    }


    const sendCategory = async (category, role) => {
      try {
        const {ethereum} = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider (ethereum);
          const signer = provider.getSigner ();
          const sendCategory = new ethers.Contract (
            contractAddress.contractAddress,
            abi.abi,
            signer
          );
          const setCategoryTxn = await sendCategory.setVotingCategory (
            category, role
          );
          await setCategoryTxn.wait ();
          setSubmitted ('successful!');
          setIsCategorySet(false);
         // setAddDelegateAddress ('');
  
          setTimeout (() => {
            setSubmitted ('');
            toast ({
              title: 'Successfull',
              description: `Category set`,
              status: 'success',
              duration: '5000',
              isClosable: true,
            });
          }, 1000);
        } else {
          setIsCategorySet (false);
          setSubmitted ('');
          showErrorToast ('Please ensure you are connected to metamask');
          console.log ('ethereum object does not exist!');
        }
      } catch (error) {
        // onClose();
        // setIsSubmitted(false);
        // setSubmitted('');
        showErrorToast('An unexpected error occured');
        console.log (error);
      }
    }

    const handleCategory = e => {
      e.preventDefault();
      sendCategory(categoryDescription,eligibility )
      setIsCategorySet(true)
    }

    const [eligibleRole, setEligibleRole] = useState("")
    const getCurrentCategory = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress.contractAddress, abi.abi, signer);
      const category = await contract.getCurrentCategory();
      const getRole = String(category[1]);

      if (getRole === "0") {
        setEligibleRole("Board Member");
      } else if (getRole === "1") {
        setEligibleRole("Teacher")
      } else if (getRole === "2") {
        setEligibleRole("Student")
      }

      setCurrentCategory({
        category : category[0],
        role : eligibleRole
      })
      console.log(category);
      console.log("category",category[0]);
      console.log("role",String(category[1]))
    }

    const setContestTime = (e) => {
      e.preventDefault();
      startContestTime(Number(interestTime), window.ethereum).then(()=> {
        setInterestTime("")
        toast ({
              title: 'Successfull',
              description: `Contest time is set`,
              status: 'success',
              duration: '5000',
              isClosable: true,
            });
      }).catch(r => {
            setInterestTime("")
            let x = r.toString().split("}")[0].split("{")[1].replace(',"data":', "")
            x = JSON.parse(`{${x}}`)
            toast({
                title:"Sorry",
                description:x.message,
                status:"error",
                duration: 5000,
                isClosable:true
            });
        })

    }

    const setVotingDuration = (e) => {
      e.preventDefault();
      startElectionTime(Number(electionTime), window.ethereum).then(()=> {
        setElectionTime("")
        toast ({
              title: 'Successfull',
              description: `Election time is set`,
              status: 'success',
              duration: '5000',
              isClosable: true,
            });
      }).catch(r => {
            setElectionTime("")
            let x = r.toString().split("}")[0].split("{")[1].replace(',"data":', "")
            x = JSON.parse(`{${x}}`)
            toast({
                title:"Sorry",
                description:x.message,
                status:"error",
                duration: 5000,
                isClosable:true
            });
        })

    }

    useEffect(() => {
      getCurrentCategory()
      console.log("Category",currentCategory )
    }, [])
    return (
      <Box>
        <Text>Set voting and eligibility</Text>

        <form action="" onSubmit={handleCategory} >
          <FormLabel htmlFor="address">Enter category description</FormLabel>
          <Input
            id=""
            placeholder="Enter description here"
            required
            value={categoryDescription}
            onChange = {e => setCategoryDescription(e.target.value)}
            mb='4'
          />

          <RadioGroup required >
            <Radio value='0' mr='2' onChange={e => setEligibility(e.target.value)}>
              Board Member
            </Radio>
            <Radio value='1' mr='2' onChange={e => setEligibility(e.target.value)}>
              Teacher
            </Radio>
            <Radio value='2' onChange={e => setEligibility(e.target.value)}>
              Student
            </Radio>
          </RadioGroup>


          {isCategorySet === false
              ? <Button colorScheme="blue" mr={3} type="submit">
                  Set Category & Roles eligible
                </Button>
              : <Button
                  colorScheme="blue"
                  mr={3}
                  type="submit"
                  isLoading
                  loadingText="setting category and roles"
                >
                  Set Category & Roles eligible
                </Button>
            }
        </form>


          <form action="" onSubmit={setContestTime}>
            <FormLabel> Set Time for contestsants to show interest (in seconds)</FormLabel>
            <Input type="number" 
              onChange={handleTime} 
              min="0"
            />
            <Button colorScheme="blue"
                  mr={3}
                  type="submit">Set time</Button>
          </form>

          <form action="" onSubmit={setVotingDuration}>
            <FormLabel> Set Time for everyone to vote(in seconds)</FormLabel>
            <Input type="number" 
              onChange={handleElectionTime} 
              min="0"
            />
            <Button colorScheme="blue"
                  mr={3}
                  type="submit">Set time</Button>
          </form>


          <div>
            <p> <strong>Category:</strong> {currentCategory.category[0]}</p>
            <p> <strong>Role Eligible to Contest : </strong> {currentCategory.role}</p>
          <div>
            <strong></strong>
            </div>
           
          </div>
      </Box>
    )
}

export default SetVotingAndTime