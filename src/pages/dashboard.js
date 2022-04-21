import React, {useRef, useState} from 'react';
import {
  Box,
  Text,
  Avatar,
  Flex,
  useColorModeValue,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  useToast
} from '@chakra-ui/react';
import {FaFistRaised} from 'react-icons/fa';
import {GiToken, GiVote} from 'react-icons/gi';
import {GoFileSubmodule} from 'react-icons/go';
import {FcViewDetails} from 'react-icons/fc';
import {SiOpslevel} from 'react-icons/si';
import {BiSad} from 'react-icons/bi';
import {ethers} from 'ethers'

import contractAddress from '../utils/contract_address.json'
import abi from '../utils/abi.json'

const Dashboard = () => {
  const color = useColorModeValue ('black', 'white');
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [stakeholder, setStakeholder] = useState('')
  const [submitted, setSubmitted] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const initialRef = useRef()
  const finalRef = useRef()


console.log('name', name)

console.log('address', address)
console.log('stakeholder', stakeholder)

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
          title: 'Successful',
          description: `added stakeholder successfully`,
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



  return (
    <Box>
      <Box px={{base: 5, md: 10}} mt="50px">
        <Flex alignItems="center" my={5} ml={{base: 0, md: 10}}>
          <Avatar size="lg" src="avatar.png" mr={3} />
          <Box>
            <Text
              fontSize={{base: '2xl', md: '3xl'}}
              fontWeight="600"
              color={color}
              mt={2}
            >
              Welcome back, Human
            </Text>

            <Button onClick={onOpen}>Add stakeholder</Button>
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
          </Box>
        </Flex>

        <Text
          fontSize={{base: '2xl', md: '3xl'}}
          fontWeight="600"
          color={color}
          my={5}
          ml={{base: 0, md: 10}}
          d="flex"
          alignItems="center"
        >
          <GiToken color="orange" /> &nbsp;Balance: 700ZURI
        </Text>
        <Text
          fontSize={{base: '2xl', md: '3xl'}}
          fontWeight="600"
          color={color}
          my={5}
          ml={{base: 0, md: 10}}
          d="flex"
          alignItems="center"
        >
          <SiOpslevel color="orange" /> &nbsp;Role: Student
        </Text>
      </Box>
      <Box
        d="flex"
        flexDirection={{base: 'column', md: 'row'}}
        px={{base: 5, md: 10}}
      >
        <Box w={{base: '100%', md: '50%'}}>
          <Box
            d="flex"
            justifyContent="space-around"
            w="100%"
            flexWrap="wrap"
            flexDirection={{base: 'column', md: 'row'}}
          >
            <Box
              w={{base: '100%', md: '50%', lg: '40%'}}
              mx={{base: 'auto', lg: '12px'}}
              h="auto"
              backdropFilter="auto"
              backdropBlur="8px"
              boxShadow="xl"
              color={color}
              textAlign="center"
              fontSize="4xl"
              p={5}
              my={3}
              borderRadius="10px"
              border="0.4px solid orange"
              cursor="pointer"
              className="card"
            >
              <Flex mb={5} fontWeight="700">
                <Box mr={5}><FcViewDetails /></Box>
                <Text fontSize="xl">Election details</Text>
              </Flex>
              <Text fontSize="md" textAlign="left" fontWeight="300">
                Click to see election details, positions available for election and eligibility to contest
              </Text>

            </Box>
            <Box
              w={{base: '100%', md: '50%', lg: '40%'}}
              mx={{base: 'auto', lg: '12px'}}
              h="auto"
              bg="orange"
              boxShadow="xl"
              color="black"
              textAlign="center"
              fontSize="3xl"
              p={5}
              my={3}
              borderRadius="10px"
              cursor="pointer"
              className="card"
            >
              <Flex mb={5} fontWeight="700">
                <Box mr={5}><FaFistRaised /></Box>
                <Text fontSize="xl">Contest</Text>
              </Flex>
              <Text fontSize="md" textAlign="left" fontWeight="300">
                Express your interest to vie for a particular position by clicking here. Only eligible candidates can contest
              </Text>
            </Box>
            <Box
              w={{base: '100%', md: '50%', lg: '40%'}}
              mx={{base: 'auto', lg: '12px'}}
              h="auto"
              bg="orange"
              color="black"
              boxShadow="xl"
              textAlign="center"
              fontSize="3xl"
              p={5}
              my={3}
              borderRadius="10px"
              cursor="pointer"
              className="card"
            >
              <Flex mb={5} fontWeight="700">
                <Box mr={5}><GiVote /></Box>
                <Text fontSize="xl">Vote</Text>
              </Flex>
              <Text fontSize="md" textAlign="left" fontWeight="300">
                Express your choice by voting for a suitable candidate here. Your votes are not monitored as it is made anonymously
              </Text>

            </Box>
            <Box
              w={{base: '100%', md: '50%', lg: '40%'}}
              mx={{base: 'auto', lg: '12px'}}
              h="auto"
              backdropFilter="auto"
              backdropBlur="8px"
              boxShadow="xl"
              color={color}
              textAlign="center"
              fontSize="3xl"
              p={5}
              my={3}
              borderRadius="10px"
              border="0.4px solid orange"
              cursor="pointer"
              className="card"
            >
              <Flex mb={5} fontWeight="700">
                <Box mr={5}><GoFileSubmodule /></Box>
                <Text fontSize="xl">See Results</Text>
              </Flex>
              <Text fontSize="md" textAlign="left" fontWeight="300">
                View voting results here. Results are only available after compilation and has been made public by the chairman
              </Text>
            </Box>
          </Box>
        </Box>

        <Box w={{base: '100%', md: '50%'}}>
          <Box
            mx="auto"
            w="80%"
            border="0.4px solid orange"
            borderRadius="10px"
            px={5}
            py={3}
            h={{base: 'auto', md: '66vh'}}
          >
            <Text fontSize="2xl" fontWeight="600" textAlign="left">
              Activities
            </Text>
            <Box textAlign="center" w="100%" mt={5}>
              <Text color="orange" fontSize="6xl" ml="45%" mb={3}>
                <BiSad />
              </Text>
              <Text fontSize="lg" fontWeight="400">
                No recent activities. Please check back later
              </Text>
            </Box>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
