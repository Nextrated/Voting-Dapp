import React, {useState, useRef} from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Box,
  Text,
  Center,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import {Link} from 'react-router-dom';

import {ethers} from 'ethers';

import contractAddress from '../contracts/contract_address.json';
import abi from '../contracts/abi.json';

const Chairman = () => {
  const [addDelegateAddress, setAddDelegateAddress] = useState ('');
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [submitted, setSubmitted] = useState ('');
  const [isSubmitted, setIsSubmitted] = useState (false);
  const [isTokenSent, setIsTokenSent] = useState (false);
  const toast = useToast ();
  const [boardAmount, setBoardAmount] = useState('')
  const [teacherAmount, setTeacherAmount] = useState('')
  const [studentAmount, setStudentAmount] = useState('')

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [stakeholder, setStakeholder] = useState('')


  const initialRef = useRef()
  const finalRef = useRef()

  const showErrorToast = message => {
    toast ({
      title: 'Unsuccessful',
      description: message,
      status: 'error',
      duration: '5000',
      isClosable: true,
    });
  };
  const addStakeholder = async (name, address, stakeholder) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const addStakeholderContract = new ethers.Contract(
          contractAddress.contractAddress,
          abi.abi,
          signer
        );
        const addStakeholderTxn = await addStakeholderContract.addStakeHolder(
          name,
          address,
          stakeholder
        );
        await addStakeholderTxn.wait();
        setSubmitted('stakeholder added successfully!');
        setIsSubmitted(false);
  
        setTimeout(() => {
          setSubmitted('');
          onClose();
          toast({
            title: 'Successfull',
            description: `File uploaded successfully`,
            status: 'success',
            duration: '5000',
            isClosable: true,
          });
        }, 1000);
      } else {
        onClose();
        setIsSubmitted(false);
        setSubmitted('');
        showErrorToast('Please ensure you are connected to metamask');
        console.log('ethereum object does not exist!');
      }
    } catch (error) {
      // onClose();
      // setIsSubmitted(false);
      // setSubmitted('');
      // showErrorToast('An unexpected error occured');
      console.log(error);
    }
  };
  
  
  const addStakeholders = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    addStakeholder(name, address, stakeholder)
  }
  const addDelegate = async address => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider (ethereum);
        const signer = provider.getSigner ();
        const addDelegateContract = new ethers.Contract (
          contractAddress.contractAddress,
          abi.abi,
          signer
        );
        const addDelegateTxn = await addDelegateContract.delegateChairmanship (
          address
        );
        await addDelegateTxn.wait ();
        setSubmitted ('successful!');
        setIsSubmitted (false);
        setAddDelegateAddress ('');

        setTimeout (() => {
          setSubmitted ('');
          toast ({
            title: 'Successfull',
            description: `added delegate successfully`,
            status: 'success',
            duration: '5000',
            isClosable: true,
          });
        }, 1000);
      } else {
        setIsSubmitted (false);
        setSubmitted ('');
        showErrorToast ('Please ensure you are connected to metamask');
        console.log ('ethereum object does not exist!');
      }
    } catch (error) {
      // onClose();
      // setIsSubmitted(false);
      // setSubmitted('');
      // showErrorToast('An unexpected error occured');
      console.log (error);
    }
  };

  const sendTokens = async (boardToken, teacherToken, studentToken) => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider (ethereum);
        const signer = provider.getSigner ();
        const sendTokenContract = new ethers.Contract (
          contractAddress.contractAddress,
          abi.abi,
          signer
        );
        const sendTokenTxn = await sendTokenContract.batchTransferToExistingStakeholders (
          boardToken, teacherToken, studentToken
        );
        await sendTokenTxn.wait ();
        setSubmitted ('successful!');
        setIsTokenSent (false);
        setAddDelegateAddress ('');

        setTimeout (() => {
          setSubmitted ('');
          toast ({
            title: 'Successfull',
            description: `tokens successfully sent`,
            status: 'success',
            duration: '5000',
            isClosable: true,
          });
        }, 1000);
      } else {
        setIsTokenSent (false);
        setSubmitted ('');
        showErrorToast ('Please ensure you are connected to metamask');
        console.log ('ethereum object does not exist!');
      }
    } catch (error) {
      // onClose();
      // setIsSubmitted(false);
      // setSubmitted('');
      // showErrorToast('An unexpected error occured');
      console.log (error);
    }
  };

  const handleAddDelegate = e => {
    e.preventDefault ();
  setIsSubmitted (true);
    
    addDelegate (addDelegateAddress);
  };

const handleSendTokens = e => {
  e.preventDefault()
  setIsTokenSent (true);
  sendTokens(boardAmount, teacherAmount, studentAmount)
}

  return (
    <Box>

      
      <Box w="60%" ml="20">
      <Button onClick={onOpen} mr='4'>Add stakeholder</Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a stakeholder</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <form onSubmit={addStakeholders}>
              <FormLabel>Name of stakeholder</FormLabel>
              <Input ref={initialRef} placeholder='Enter name' mb='4' value={name} onChange={e => setName(e.target.value)} required/>

              <FormLabel>Address of stakeholder</FormLabel>
              <Input ref={initialRef} placeholder='Enter address' mb='4' value={address} onChange={e => setAddress(e.target.value)} required/>
<RadioGroup required >
<Radio value='0' mr='2' onChange={e => setStakeholder(e.target.value)}>
Board Member
</Radio>
<Radio value='1' mr='2' onChange={e => setStakeholder(e.target.value)}>
Teacher
</Radio>
<Radio value='2' onChange={e => setStakeholder(e.target.value)}>
Student
</Radio>
</RadioGroup>

          <ModalFooter>
          <Text mr={2} color={'green.500'}>
                  {submitted}
                </Text>
                {isSubmitted === false ? (
                  <Button colorScheme="blue" mr={3} type="submit">
                    Add
                  </Button>
                ) : (
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="submit"
                    isLoading
                    loadingText="Adding"
                  >
                    Adding
                  </Button>
                )}
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
          </form>
          </ModalBody>
        </ModalContent>
      </Modal>

        <Link to="/setvote">
          <Button my="4">
            Set time and category for election
          </Button>
        </Link>

        <Box mb="4">
          <Text fontSize="3xl">
            Dispatch tokens to stakeholders
          </Text>
          <form action="" onSubmit={handleSendTokens}>
            <FormLabel htmlFor="board-member">Board Member</FormLabel>
            <Input
              placeholder="Enter board member amount"
              required
              value={boardAmount}
              onChange={e => setBoardAmount(e.target.value)}
              mb="4"
              type='number'
            />

            <FormLabel htmlFor="teacher">Teacher</FormLabel>
            <Input
              placeholder="Enter teacher amount"
              required
              value={teacherAmount}
              onChange={e => setTeacherAmount(e.target.value)}
              mb="4"
              type='number'
            />

            <FormLabel htmlFor="address">Student</FormLabel>
            <Input
              placeholder="Enter student amount"
              required
              value={studentAmount}
              onChange={e => setStudentAmount(e.target.value)}
              mb="4"
              type='number'

            />


{isTokenSent === false
              ? <Button colorScheme="blue" mr={3} type="submit">
                  Send Tokens
                </Button>
              : <Button
                  colorScheme="blue"
                  mr={3}
                  type="submit"
                  isLoading
                  loadingText="sending tokens"
                >
                  Send Tokens
                </Button>}
          </form>
        </Box>
        <Box mb="4">
          <Text fontSize="3xl">Add a delegate</Text>
          <form action="" onSubmit={handleAddDelegate}>
            <FormLabel htmlFor="address">Address of delegate</FormLabel>
            <Input
              id="first-name"
              placeholder="Enter address of delegate"
              required
              value={addDelegateAddress}
              onChange={e => setAddDelegateAddress (e.target.value)}
              mb="4"
            />
            <Text mr={2} color={'green.500'}>
              {submitted}
            </Text>
            {isSubmitted === false
              ? <Button colorScheme="blue" mr={3} type="submit">
                  Add Delegate
                </Button>
              : <Button
                  colorScheme="blue"
                  mr={3}
                  type="submit"
                  isLoading
                  loadingText="Adding Delegate"
                >
                  Add Delegate
                </Button>}
          </form>
        </Box>

        <Box>
          <Text fontSize="3xl">Remove a delegate</Text>
          <form action="">
            <FormLabel>Address of delegate</FormLabel>
            <Input
              id="first-name"
              placeholder="Enter address of delegate"
              required
            />
            <Button colorScheme="red" mr={3} type="submit" mt="4">
              Remove Delegate
            </Button>
          </form>
        </Box>

      </Box>


     
    </Box>
  );
};

export default Chairman;
