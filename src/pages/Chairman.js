import React, { useState, useRef } from "react";
import {
  FormLabel,
  Input,
  Box,
  Text,
  Grid,
  GridItem,
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
  Image,
  RadioGroup,
  Center,
  Heading,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  PlusSquareIcon,
  StarIcon,
  TimeIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";

import { Link } from "react-router-dom";

import { ethers } from "ethers";

import contractAddress from "../contracts/contract_address.json";
import abi from "../contracts/abi.json";

const Chairman = () => {
  const [addDelegateAddress, setAddDelegateAddress] = useState("");
  const [removeDelegateAddress, setRemoveDelegateAddress] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [submitted, setSubmitted] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTokenSent, setIsTokenSent] = useState(false);
  const toast = useToast();
  const [teacherAmount, setTeacherAmount] = useState("");
  const [studentAmount, setStudentAmount] = useState("");

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [stakeholder, setStakeholder] = useState("");

  const initialRef = useRef();
  const finalRef = useRef();

  const {
    isOpen: isAddStakeholderOpen,
    onOpen: onAddStakeholderOpen,
    onClose: onAddStakeholderClose,
  } = useDisclosure();

  const {
    isOpen: isDispatchTokenOpen,
    onOpen: onDispatchTokenOpen,
    onClose: onDispatchTokenClose,
  } = useDisclosure();

  const {
    isOpen: isAddDelegateOpen,
    onOpen: onAddDelegateOpen,
    onClose: onAddDelegateClose,
  } = useDisclosure();

  const {
    isOpen: isRemoveDelegateOpen,
    onOpen: onRemoveDelegateOpen,
    onClose: onRemoveDelegateClose,
  } = useDisclosure();

  const showErrorToast = (message) => {
    toast({
      title: "Unsuccessful",
      description: message,
      status: "error",
      duration: 5000,
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
          contractAddress,
          abi,
          signer
        );
        const addStakeholderTxn = await addStakeholderContract.addStakeHolder(
          name,
          address,
          stakeholder
        );
        await addStakeholderTxn.wait();
        setSubmitted("stakeholder added successfully!");
        setIsSubmitted(false);

        setTimeout(() => {
          setSubmitted("");
          onAddStakeholderClose();
          toast({
            title: "Successfull",
            description: `Stakeholder uploaded successfully`,
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }, 1000);
      } else {
        onAddStakeholderClose();
        setIsSubmitted(false);
        setSubmitted("");
        showErrorToast("Please ensure you are connected to metamask");
        console.log("ethereum object does not exist!");
      }
    } catch (error) {
      onAddStakeholderClose();
      setIsSubmitted(false);
      setSubmitted("");
      showErrorToast("An unexpected error occured");
      console.log(error);
    }
  };

  const addStakeholders = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    addStakeholder(name, address, stakeholder);
  };
  const addDelegate = async (address) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const addDelegateContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        const addDelegateTxn = await addDelegateContract.DelegatevoteCordinator(
          address
        );
        await addDelegateTxn.wait();
        setSubmitted("successful!");
        setIsSubmitted(false);
        setAddDelegateAddress("");

        setTimeout(() => {
          setSubmitted("");
          onAddDelegateClose();
          toast({
            title: "Successfull",
            description: `added delegate successfully`,
            status: "success",
            duration: "5000",
            isClosable: true,
          });
        }, 1000);
      } else {
        setIsSubmitted(false);
        onAddDelegateClose();
        setSubmitted("");
        showErrorToast("Please ensure you are connected to metamask");
        console.log("ethereum object does not exist!");
      }
    } catch (error) {
      onAddDelegateClose();
      setIsSubmitted(false);
      setSubmitted("");
      showErrorToast("An unexpected error occured");
      console.log(error);
    }
  };

  const removeDelegate = async (address) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const removeDelegateContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        const removeDelegateTxn = await removeDelegateContract.removeDelegate(
          address
        );
        await removeDelegateTxn.wait();
        setSubmitted("successful!");
        setIsSubmitted(false);
        setRemoveDelegateAddress("");

        setTimeout(() => {
          setSubmitted("");
          onRemoveDelegateClose();
          toast({
            title: "Successfull",
            description: `removed delegate successfully`,
            status: "success",
            duration: "5000",
            isClosable: true,
          });
        }, 1000);
      } else {
        setIsSubmitted(false);
        onRemoveDelegateClose();
        setSubmitted("");
        showErrorToast("Please ensure you are connected to metamask");
        console.log("ethereum object does not exist!");
      }
    } catch (error) {
      onRemoveDelegateClose();
      setIsSubmitted(false);
      setSubmitted("");
      showErrorToast("An unexpected error occured");
      console.log(error);
    }
  };

  const sendTokensToStudents = async (studentToken) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const sendTokenContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        const sendTokenTxn = await sendTokenContract.batchTransferToStudents(
          studentToken
        );
        await sendTokenTxn.wait();
        setSubmitted("successful!");
        setIsTokenSent(false);
        setAddDelegateAddress("");

        setTimeout(() => {
          setSubmitted("");
          onDispatchTokenClose();

          toast({
            title: "Successfull",
            description: `tokens successfully sent`,
            status: "success",
            duration: "5000",
            isClosable: true,
          });
        }, 1000);
      } else {
        setIsTokenSent(false);
        onDispatchTokenClose();
        setSubmitted("");
        showErrorToast("Please ensure you are connected to metamask");
        console.log("ethereum object does not exist!");
      }
    } catch (error) {
      onDispatchTokenClose();
      setIsSubmitted(false);
      setSubmitted("");
      showErrorToast("An unexpected error occured");
      console.log(error);
    }
  };

  const sendTokensToTeachers = async (teacherToken) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const sendTokenContract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        const sendTokenTxn = await sendTokenContract.batchTransferToTeachers(
          teacherToken
        );
        await sendTokenTxn.wait();
        setSubmitted("successful!");
        setIsTokenSent(false);
        setAddDelegateAddress("");

        setTimeout(() => {
          setSubmitted("");
          onDispatchTokenClose();

          toast({
            title: "Successfull",
            description: `tokens successfully sent`,
            status: "success",
            duration: "5000",
            isClosable: true,
          });
        }, 1000);
      } else {
        setIsTokenSent(false);
        onDispatchTokenClose();
        setSubmitted("");
        showErrorToast("Please ensure you are connected to metamask");
        console.log("ethereum object does not exist!");
      }
    } catch (error) {
      onDispatchTokenClose();
      setIsSubmitted(false);
      setSubmitted("");
      showErrorToast("An unexpected error occured");
      console.log(error);
    }
  };

  const handleAddDelegate = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    addDelegate(addDelegateAddress);
  };

  const handleRemoveDelegate = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    removeDelegate(removeDelegateAddress);
  };

  const handleSendTokensToStudents = (e) => {
    e.preventDefault();
    setIsTokenSent(true);
    sendTokensToStudents(studentAmount);
  };

  const handleSendTokensToTeachers = (e) => {
    e.preventDefault();
    setIsTokenSent(true);
    sendTokensToTeachers(teacherAmount);
  };

  return (
    <Box mx="10" my="10">
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={6}
      >
        <GridItem>
          <Box onClick={onAddStakeholderOpen} cursor="pointer">
            <Box
              maxW={"445px"}
              h="250"
              w={"full"}
              bg={useColorModeValue("white", "orange.900")}
              boxShadow={"2xl"}
              rounded={"md"}
              p={6}
              overflow={"hidden"}
            >
              <CheckCircleIcon fontSize="3xl" mb="5" color="blue" />
              <Stack>
                <Heading
                  color={useColorModeValue("gray.700", "white")}
                  fontSize={"2xl"}
                >
                  Add a stakeholder
                </Heading>
                <Text color={"gray.500"}>
                  The Admin or the vote cordinator can add a stakeholder.
                  Stakeholders can be a teacher or a student.
                </Text>
              </Stack>
            </Box>
          </Box>
          <Modal
            initialFocusRef={initialRef}
            finalFocusRef={finalRef}
            isOpen={isAddStakeholderOpen}
            onClose={onAddStakeholderClose}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add a stakeholder</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <form onSubmit={addStakeholders}>
                  <FormLabel>Name of stakeholder</FormLabel>
                  <Input
                    ref={initialRef}
                    placeholder="Enter name"
                    mb="4"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />

                  <FormLabel>Address of stakeholder</FormLabel>
                  <Input
                    ref={initialRef}
                    placeholder="Enter address"
                    mb="4"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <RadioGroup required>
                    <Radio
                      value="1"
                      mr="2"
                      onChange={(e) => setStakeholder(e.target.value)}
                    >
                      Teacher
                    </Radio>
                    <Radio
                      value="2"
                      onChange={(e) => setStakeholder(e.target.value)}
                    >
                      Student
                    </Radio>
                  </RadioGroup>

                  <ModalFooter>
                    <Text mr={2} color={"green.500"}>
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
                    <Button onClick={onAddStakeholderClose}>Cancel</Button>
                  </ModalFooter>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </GridItem>
        <GridItem>
          <Link to="/setvote">
            <Box cursor="pointer">
              <Box
                maxW={"445px"}
                h="250"
                w={"full"}
                bg={useColorModeValue("white", "gray.900")}
                boxShadow={"2xl"}
                rounded={"md"}
                p={6}
                overflow={"hidden"}
              >
                <TimeIcon fontSize="3xl" mb="5" />
                <Stack>
                  <Heading
                    color={useColorModeValue("gray.700", "white")}
                    fontSize={"2xl"}
                  >
                    Set time and category for election
                  </Heading>
                  <Text color={"gray.500"}>
                    Only the Vote Administrator can set the time and category
                    for election. As well as commencing the election.
                  </Text>
                </Stack>
              </Box>
            </Box>
          </Link>
        </GridItem>
        <GridItem>
          <Box mb="4">
            <Box onClick={onDispatchTokenOpen} cursor="pointer">
              <Box
                maxW={"445px"}
                h="250"
                w={"full"}
                bg={useColorModeValue("white", "gray.900")}
                boxShadow={"2xl"}
                rounded={"md"}
                p={6}
                overflow={"hidden"}
              >
                <StarIcon fontSize="3xl" mb="5" color="purple" />
                <Stack>
                  <Heading
                    color={useColorModeValue("gray.700", "white")}
                    fontSize={"2xl"}
                  >
                    Dispatch Tokens
                  </Heading>
                  <Text color={"gray.500"}>
                    The Admin or the vote cordinator can distribute tokens to
                    the stakeholders to enable them vote in elections.
                  </Text>
                </Stack>
              </Box>
            </Box>
            <Modal
              initialFocusRef={initialRef}
              finalFocusRef={finalRef}
              isOpen={isDispatchTokenOpen}
              onClose={onDispatchTokenClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Dispatch Tokens to stakeholders</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                  <form action="" onSubmit={handleSendTokensToTeachers}>
                    <FormLabel htmlFor="teacher">Teacher</FormLabel>
                    <Input
                      placeholder="Enter teacher amount"
                      required
                      value={teacherAmount}
                      onChange={(e) => setTeacherAmount(e.target.value)}
                      mb="4"
                      type="number"
                    />
                    <ModalFooter>
                      <Text mr={2} color={"green.500"}>
                        {submitted}
                      </Text>
                      {isTokenSent === false ? (
                        <Button colorScheme="blue" mr={3} type="submit">
                          Send Tokens
                        </Button>
                      ) : (
                        <Button
                          colorScheme="blue"
                          mr={3}
                          type="submit"
                          isLoading
                          loadingText="sending tokens"
                        >
                          Sending Tokens
                        </Button>
                      )}
                      <Button onClick={onDispatchTokenClose}>Cancel</Button>
                    </ModalFooter>
                  </form>

                  <form action="" onSubmit={handleSendTokensToStudents}>
                    <FormLabel htmlFor="address">Student</FormLabel>
                    <Input
                      placeholder="Enter student amount"
                      required
                      value={studentAmount}
                      onChange={(e) => setStudentAmount(e.target.value)}
                      mb="4"
                      type="number"
                    />
                    <ModalFooter>
                      <Text mr={2} color={"green.500"}>
                        {submitted}
                      </Text>
                      {isTokenSent === false ? (
                        <Button colorScheme="blue" mr={3} type="submit">
                          Send Tokens
                        </Button>
                      ) : (
                        <Button
                          colorScheme="blue"
                          mr={3}
                          type="submit"
                          isLoading
                          loadingText="sending tokens"
                        >
                          Sending Tokens
                        </Button>
                      )}
                      <Button onClick={onDispatchTokenClose}>Cancel</Button>
                    </ModalFooter>
                  </form>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        </GridItem>
        <GridItem>
          <Box mb="4">
            <Box onClick={onAddDelegateOpen} cursor="pointer">
              <Box
                maxW={"445px"}
                h="250"
                w={"full"}
                bg={useColorModeValue("white", "gray.900")}
                boxShadow={"2xl"}
                rounded={"md"}
                p={6}
                overflow={"hidden"}
              >
                <PlusSquareIcon fontSize="3xl" mb="5" color="green" />
                <Stack>
                  <Heading
                    color={useColorModeValue("gray.700", "white")}
                    fontSize={"2xl"}
                  >
                    Add a delegate
                  </Heading>
                  <Text color={"gray.500"}>
                    The chairman can add a delegate to assist himself/herself
                    with the day to day activities in the Zuri Organization like
                    adding of stakeholders and distribution of tokens.
                  </Text>
                </Stack>
              </Box>
            </Box>

            <Modal
              initialFocusRef={initialRef}
              finalFocusRef={finalRef}
              isOpen={isAddDelegateOpen}
              onClose={onAddDelegateClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Add a Delegate</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                  <form action="" onSubmit={handleAddDelegate}>
                    <FormLabel htmlFor="address">Address of delegate</FormLabel>
                    <Input
                      id="first-name"
                      placeholder="Enter address of delegate"
                      required
                      value={addDelegateAddress}
                      onChange={(e) => setAddDelegateAddress(e.target.value)}
                      mb="4"
                    />
                    <Text mr={2} color={"green.500"}>
                      {submitted}
                    </Text>
                    <ModalFooter>
                      <Text mr={2} color={"green.500"}>
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
                          Add Delegate
                        </Button>
                      )}

                      <Button onClick={onAddDelegateClose}>Cancel</Button>
                    </ModalFooter>
                  </form>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        </GridItem>
        <GridItem>
          <Box>
            <Box onClick={onRemoveDelegateOpen} cursor="pointer">
              {" "}
              <Box
                maxW={"445px"}
                h="250"
                w={"full"}
                bg={useColorModeValue("white", "gray.900")}
                boxShadow={"2xl"}
                rounded={"md"}
                p={6}
                overflow={"hidden"}
              >
                <WarningTwoIcon fontSize="3xl" mb="5" color="red" />
                <Stack>
                  <Heading
                    color={useColorModeValue("gray.700", "white")}
                    fontSize={"2xl"}
                  >
                    Remove a delegate
                  </Heading>
                  <Text color={"gray.500"}>
                    The chairman of Zuri organization can remove a delegate if
                    he/she feels it is time to remove such a delegate.
                  </Text>
                </Stack>
              </Box>
            </Box>
            <Modal
              initialFocusRef={initialRef}
              finalFocusRef={finalRef}
              isOpen={isRemoveDelegateOpen}
              onClose={onRemoveDelegateClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Remove a Delegate</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                  <form action="" onSubmit={handleRemoveDelegate}>
                    <FormLabel>Address of delegate</FormLabel>
                    <Input
                      id="first-name"
                      placeholder="Enter address of delegate"
                      value={removeDelegateAddress}
                      onChange={(e) => setRemoveDelegateAddress(e.target.value)}
                      required
                    />
                    <Text mr={2} color={"green.500"}>
                      {submitted}
                    </Text>
                    <ModalFooter>
                      <Text mr={2} color={"green.500"}>
                        {submitted}
                      </Text>

                      {isSubmitted === false ? (
                        <Button colorScheme="red" mr={3} type="submit">
                          Remove Delegate
                        </Button>
                      ) : (
                        <Button
                          colorScheme="red"
                          mr={3}
                          type="submit"
                          isLoading
                          loadingText="Removing Delegate"
                        >
                          Remove Delegate
                        </Button>
                      )}

                      <Button onClick={onRemoveDelegateClose}>Cancel</Button>
                    </ModalFooter>
                  </form>
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Chairman;
