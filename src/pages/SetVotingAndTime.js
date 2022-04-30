import React, {useState, useEffect, useRef} from 'react';
import {
  FormLabel,
  Input,
  Box,
  Text,
  Center,
  Button,
  useToast,
  Radio,
  RadioGroup,
  Grid,
  GridItem,
  useColorModeValue,
  Stack,
  Heading,
  useDisclosure,
  Modal,
  ModalBody,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
} from '@chakra-ui/react';

import {ethers} from 'ethers';

import contractAddress from '../contracts/contract_address.json';
import abi from '../contracts/abi.json';
import {startContestTime, startElectionTime} from '../utils';
import {InfoIcon, RepeatClockIcon, TimeIcon} from '@chakra-ui/icons';

const SetVotingAndTime = () => {
  const toast = useToast ();
  const [categoryDescription, setCategoryDescription] = useState ('');
  const [eligibility, setEligibility] = useState ('');
  const [interestTime, setInterestTime] = useState ('');
  const [electionTime, setElectionTime] = useState ('');
  const [submitted, setSubmitted] = useState ('');
  const [isCategorySet, setIsCategorySet] = useState (false);
  const [votingDurations, setVotingDurations] = useState(false);
  const [contestingDuration, setContestingDuration] = useState(false);
  const [currentCategory, setCurrentCategory] = useState ({
    category: '',
    role: '',
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

  const initialRef = useRef ();
  const finalRef = useRef ();

  const handleTime = e => {
    const time = e.target.value;
    setInterestTime (time);
    //console.log("tymeee", time)
  };

  const handleElectionTime = e => {
    const time = e.target.value;
    setElectionTime (time);
    //console.log("tymeee", time)
  };

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
          category,
          parseInt (role)
        );
        await setCategoryTxn.wait ();
        setSubmitted ('successful!');
        setIsCategorySet (false);
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
      showErrorToast ('An unexpected error occured');
      console.log (error);
    }
  };

  const handleCategory = e => {
    e.preventDefault ();
    sendCategory (categoryDescription, eligibility);
    setIsCategorySet (true);
  };

  const [eligibleRole, setEligibleRole] = useState ('');
  const getCurrentCategory = async () => {
    const provider = new ethers.providers.Web3Provider (window.ethereum);
    await provider.send ('eth_requestAccounts', []);
    const signer = await provider.getSigner ();
    const contract = new ethers.Contract (
      contractAddress.contractAddress,
      abi.abi,
      signer
    );
    const category = await contract.getCurrentCategory ();
    const getRole = String (category[1]);

    if (getRole === 0) {
      setEligibleRole ('Board Member');
    } else if (getRole === 1) {
      setEligibleRole ('Teacher');
    } else if (getRole === 2) {
      setEligibleRole ('Student');
    }

    setCurrentCategory ({
      category: category[0],
      role: eligibleRole,
    });
    console.log (category);
    console.log ('category', category[0]);
    console.log ('role', String (category[1]));
  };

  const setContestTime = e => {
    e.preventDefault ();
    setContestingDuration(true)
    startContestTime (Number (interestTime), window.ethereum)
      .then (() => {
        setInterestTime ('');
        setContestingDuration(false)
        toast ({
          title: 'Successfull',
          description: `Contest time is set`,
          status: 'success',
          duration: '5000',
          isClosable: true,
        });
      })
      .catch (r => {
        setInterestTime ('');
        let x = r
          .toString ()
          .split ('}')[0]
          .split ('{')[1]
          .replace (',"data":', '');
        x = JSON.parse (`{${x}}`);
        toast ({
          title: 'Sorry',
          description: x.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const setVotingDuration = e => {
    e.preventDefault ();
    setVotingDurations(true)
    startElectionTime (Number (electionTime), window.ethereum)
      .then (() => {
        setElectionTime ('');
        setVotingDurations(false)
        toast ({
          title: 'Successfull',
          description: `Election time is set`,
          status: 'success',
          duration: '5000',
          isClosable: true,
        });
      })
      .catch (r => {
        setElectionTime ('');
        let x = r
          .toString ()
          .split ('}')[0]
          .split ('{')[1]
          .replace (',"data":', '');
        x = JSON.parse (`{${x}}`);
        toast ({
          title: 'Sorry',
          description: x.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const {
    isOpen: setVotingOpen,
    onOpen: onSetVotingOpen,
    onClose: onSetVotingClose,
  } = useDisclosure ();

  const {
    isOpen: showInterestOpen,
    onOpen: onShowInterestOpen,
    onClose: onShowInterestClose,
  } = useDisclosure ();

  const {
    isOpen: setTimeOpen,
    onOpen: onSetTimeOpen,
    onClose: onSetTimeClose,
  } = useDisclosure ();

  useEffect (() => {
    getCurrentCategory ();
    console.log ('Category', currentCategory);
  }, []);
  return (
    <Box mx="10" my="10">
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
          lg: 'repeat(3, 1fr)',
        }}
        gap={6}
        mb='8'
      >

        <GridItem>
          <Box onClick={onSetVotingOpen} cursor="pointer">

            <Box
              maxW={'445px'}
              h="250"
              w={'full'}
              bg={useColorModeValue ('white', 'grey.900')}
              boxShadow={'2xl'}
              rounded={'md'}
              p={6}
              overflow={'hidden'}
            >
              <InfoIcon fontSize="3xl" mb="5" color="blue" />
              <Stack>
                <Heading
                  color={useColorModeValue ('gray.700', 'white')}
                  fontSize={'2xl'}
                >
                  Set voting and eligibility
                </Heading>
                <Text color={'gray.500'}>
                  The chairman has the power to set voting and who is eligible to contest and show interest in this particular election.

                </Text>
              </Stack>
            </Box>
          </Box>

          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={setVotingOpen}
            onClose={onSetVotingClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Set voting and eligibility</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>

                <form action="" onSubmit={handleCategory}>
                  <FormLabel htmlFor="address">
                    Enter category description
                  </FormLabel>
                  <Input
                    id=""
                    placeholder="Enter description here"
                    required
                    value={categoryDescription}
                    onChange={e => setCategoryDescription (e.target.value)}
                    mb="4"
                  />

                  <RadioGroup required>
                    <Radio
                      value="0"
                      mr="2"
                      onChange={e => setEligibility (e.target.value)}
                    >
                      Board Member
                    </Radio>
                    <Radio
                      value="1"
                      mr="2"
                      onChange={e => setEligibility (e.target.value)}
                    >
                      Teacher
                    </Radio>
                    <Radio
                      value="2"
                      onChange={e => setEligibility (e.target.value)}
                    >
                      Student
                    </Radio>
                  </RadioGroup>
                  <ModalFooter>
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
                        </Button>}
                    <Button onClick={onSetVotingClose}>Cancel</Button>

                  </ModalFooter>

                </form>

              </ModalBody>

            </ModalContent>

          </Modal>
        </GridItem>
        <GridItem>
          <Box onClick={onShowInterestOpen} cursor="pointer">
            <Box
              maxW={'445px'}
              h="250"
              w={'full'}
              bg={useColorModeValue ('white', 'grey.900')}
              boxShadow={'2xl'}
              rounded={'md'}
              p={6}
              overflow={'hidden'}
            >
              <RepeatClockIcon fontSize="3xl" mb="5" color="green" />
              <Stack>
                <Heading
                  color={useColorModeValue ('gray.700', 'white')}
                  fontSize={'2xl'}
                >
                  Set Time for contestants to show interest (in seconds)
                </Heading>
                <Text color={'gray.500'}>
                  The chairman sets the time for the contestants to show interest in a particular election.
                  {' '}
                </Text>
              </Stack>
            </Box>

          </Box>

          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={showInterestOpen}
            onClose={onShowInterestClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader mt='5'>
                Set Time for contestants to show interest (in seconds)
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <form action="" onSubmit={setContestTime}>
                  <FormLabel>
                    Enter the time
                  </FormLabel>
                  <Input type="number" onChange={handleTime} min="0" placeholder='Enter time' required/>
                  <ModalFooter>
                  {contestingDuration === false
                      ? <Button colorScheme="blue" mr={3} type="submit">
                           Set time
                        </Button>
                      : <Button
                          colorScheme="blue"
                          mr={3}
                          type="submit"
                          isLoading
                          loadingText="setting contesting duration"
                        >
                          Set time
                        </Button>}
                    <Button onClick={onShowInterestClose}>Cancel</Button>
                  </ModalFooter>

                </form>
              </ModalBody>

            </ModalContent>
          </Modal>

        </GridItem>
        <GridItem>
          <Box onClick={onSetTimeOpen} cursor="pointer">

            <Box
              maxW={'445px'}
              h="250"
              w={'full'}
              bg={useColorModeValue ('white', 'grey.900')}
              boxShadow={'2xl'}
              rounded={'md'}
              p={6}
              overflow={'hidden'}
            >
              <TimeIcon fontSize="3xl" mb="5" />
              <Stack>
                <Heading
                  color={useColorModeValue ('gray.700', 'white')}
                  fontSize={'2xl'}
                >
                  Set Time for everyone to vote (in seconds)
                </Heading>
                <Text color={'gray.500'}>
                  The chairman has the power to set the time span of how long he wants voting to last.
                  {' '}

                </Text>
              </Stack>
            </Box>
          </Box>

          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={setTimeOpen}
            onClose={onSetTimeClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader mt='5'>
                Set Time for everyone to vote (in seconds)
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>

                <form action="" onSubmit={setVotingDuration}>
                  <FormLabel> Set Time for vote</FormLabel>
                  <Input type="number" onChange={handleElectionTime} min="0" placeholder='Set time' required/>
                  <ModalFooter>
                  {votingDurations === false
                      ? <Button colorScheme="blue" mr={3} type="submit">
                           Set time
                        </Button>
                      : <Button
                          colorScheme="blue"
                          mr={3}
                          type="submit"
                          isLoading
                          loadingText="setting voting duration"
                        >
                          Set time
                        </Button>}
                    <Button onClick={onSetTimeClose}>Cancel</Button>
                  </ModalFooter>

                </form>
              </ModalBody>

            </ModalContent>

          </Modal>

        </GridItem>

      </Grid>

      <div>
        <p> <strong>Category:</strong> {currentCategory.category[0]}</p>
        <p>
          {' '}
          <strong>Role Eligible to Contest : </strong>
          {' '}
          {currentCategory.role}
        </p>
        <div>
          <strong />
        </div>

      </div>
    </Box>
  );
};

export default SetVotingAndTime;
