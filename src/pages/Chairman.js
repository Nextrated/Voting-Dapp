import React, {useState} from 'react';
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
  useToast
} from '@chakra-ui/react';

import {ethers} from 'ethers'

import contractAddress from '../utils/contract_address.json'
import abi from '../utils/abi.json'

const Chairman = () => {
  const [addDelegateAddress, setAddDelegateAddress] = useState('')
  const [submitted, setSubmitted] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();

const showErrorToast = message => {
  toast({
    title: 'Unsuccessful',
    description: message,
    status: 'error',
    duration: '5000',
    isClosable: true,
  });
};
const addDelegate = async (address) => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const addDelegateContract = new ethers.Contract(
        contractAddress.contractAddress,
        abi.abi,
        signer
      );
      const addDelegateTxn = await addDelegateContract.delegateChairmanship(
        address
      );
      await addDelegateTxn.wait();
      setSubmitted('successful!');
      setIsSubmitted(false);
      setAddDelegateAddress('')

      setTimeout(() => {
        setSubmitted('');
        toast({
          title: 'Successfull',
          description: `added delegate successfully`,
          status: 'success',
          duration: '5000',
          isClosable: true,
        });
      }, 1000);
    } else {
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


  const handleAddDelegate = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    addDelegate(addDelegateAddress)
    
  }


  return (
    <Box w='60%' ml='20'>
      <Box mb='4'>
            <Text fontSize='3xl'>Add a delegate</Text>
        <form action="" onSubmit={handleAddDelegate}>
          <FormLabel htmlFor="address">Address of delegate</FormLabel>
          <Input
            id="first-name"
            placeholder="Enter address of delegate"
            required
            value={addDelegateAddress}
            onChange = {e => setAddDelegateAddress(e.target.value)}
            mb='4'
          />
          <Text mr={2} color={'green.500'}>
                  {submitted}
                </Text>
         {isSubmitted === false ? (
                  <Button colorScheme="blue" mr={3} type="submit">
                    Add Delegate
                  </Button>
                ) : (
                  <Button
                    colorScheme="blue"
                    mr={3}
                    type="submit"
                    isLoading
                    loadingText="Adding Delegate"
                  >
                    Adding
                  </Button>
                )}
        </form>
      </Box>


      <Box>
            <Text fontSize='3xl'>Remove a delegate</Text>
        <form action="" >
          <FormLabel>Address of delegate</FormLabel>
          <Input
            id="first-name"
            placeholder="Enter address of delegate"
            required
          />
          <Button colorScheme="red" mr={3} type="submit" mt='4'>
                    Remove Delegate
                  </Button>
        </form>
      </Box>

    </Box>
  );
};

export default Chairman;
