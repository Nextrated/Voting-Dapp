import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Avatar,
  Flex,
  Button,
  Image,
  useColorModeValue,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { FaFistRaised } from "react-icons/fa";
import { GiToken, GiVote } from "react-icons/gi";
import { GoFileSubmodule } from "react-icons/go";
import { FcViewDetails } from "react-icons/fc";
import { SiOpslevel } from "react-icons/si";
import { BiSad } from "react-icons/bi";
import {
  getUserDetails,
  getUserBalance,
  hasElectionStarted,
  isResultAnnounced,
  isStakeholder,
  getElectionCategory,
  compileResults,
  isVoteCordinator,
} from "../utils";
import ElectionDetails from "../components/ElectionDetails";
import VoteModal from "../components/VoteModal";
import ContestAlert from "../components/ContestAlert";
import ResultModal from "../components/ResultModal";

const Dashboard = ({ currentAccount }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bal, setBal] = useState(0);
  const [roles, setRoles] = useState([]);
  const [eligibility, setEligibility] = useState([]);
  const [category, setCategory] = useState([]);
  const [eligibleCategory, setEligibleCategory] = useState([]);
  const [compiling, setCompiling] = useState(false);
  const color = useColorModeValue("black", "white");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isContestOpen,
    onOpen: onContestOpen,
    onClose: onContestClose,
  } = useDisclosure();

  const {
    isOpen: isVoteOpen,
    onOpen: onVoteOpen,
    onClose: onVoteClose,
  } = useDisclosure();
  const {
    isOpen: isResultOpen,
    onOpen: onResultOpen,
    onClose: onResultClose,
  } = useDisclosure();

  function getEligibleCategory(arr) {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].eligibility === role) {
        newArr.push(arr[i]);
      }
    }
    setEligibleCategory(newArr);
  }

  function parseCategory(arr1, arr2) {
    if (arr1.length === 0) {
      setCategory([]);
    } else {
      let newArr = [];
      for (let i = 0; i < arr1.length; i++) {
        let obj = {
          role: arr1[i],
          eligibility: arr2[i],
        };
        newArr.push(obj);
      }
      setCategory(newArr);
    }
  }

  useEffect(() => {
    if (isStakeholder(window.ethereum, currentAccount)) {
      getUserDetails(window.ethereum).then((res) => {
        // console.log(res)
        setName(res.name);
        const r = parseInt(res.role._hex, 16);
        if (r === 0) {
          setRole("Vote Cordinator");
        } else if (r === 1) {
          setRole("Teacher");
        }else if (r === 2) {
          setRole("Student");
        }
      });

      getUserBalance(window.ethereum, currentAccount).then((res) => {
        const r = parseInt(res._hex, 16);
        setBal(r / 10 ** 18);
      });

      getCategory();
    } else {
      window.location.assign("/");
    }
  }, [bal, role, name, currentAccount, roles]);

  function convHex(hex) {
    return parseInt(hex._hex, 16);
  }

  const getCategory = async () => {
    await getElectionCategory(window.ethereum).then(async (res) => {
      if (res[0].length !== 0) {
        await setRoles(res[0]);
        for (let i = 0; i < res[1].length; i++) {
          var r = convHex(res[1][i]);
          if(r===0){
            await setEligibility([...eligibility,"Vote Cordinator"])
          } else if (r === 1) {
            await setEligibility([...eligibility, "Teacher"]);
          } else {
            await setEligibility([...eligibility, "Student"]);
          }
        }
      } else {
        setRoles([]);
        setEligibility([]);
      }
      parseCategory(roles, eligibility);
    });
  };

  const resetBal = (bal) => {
    setBal(bal);
  };

  const contest = () => {
    getCategory().then(() => {
      if (eligibility.includes(role) === false) {
        toast({
          title: "Sorry",
          description:
            "You are not eligible to contest for any of the available positions",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        getEligibleCategory(category);
        onContestOpen();
      }
    });
  };

  const announce = async () => {
    const r = await isResultAnnounced(window.ethereum);
    if (r === false) {
      toast({
        title: "Sorry",
        description: "Election results have not been announced yet!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      onResultOpen();
    }
  };

  const vote = async () => {
    const r = await hasElectionStarted(window.ethereum);
    if (r === false) {
      toast({
        title: "Sorry",
        description: "Voting for this election has not commenced!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      onVoteOpen();
    }
  };

  const handleCompilation = async () => {
    const r = await hasElectionStarted(window.ethereum);
    if (r === true) {
      toast({
        title: "Sorry",
        description: "Election is still in progress!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setCompiling(true);
      compileResults(window.ethereum)
        .then((res) => {
          setCompiling(false);
          console.log("Votes compiled: ",res);
          toast({
            title: "Compilation successful",
            description: "Compiled results have been sent to the vote cordinator",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        })
        .catch(() => {
          setCompiling(false);
          toast({
            title: "Sorry",
            description: "An unexpected error occured during compilation",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  return compiling === false ? (
    <Box>
      <Box px={{ base: 5, md: 10 }} mt="50px">
        <Flex alignItems="center" my={5} ml={{ base: 0, md: 10 }}>
          <Avatar size="lg" src="avatar.png" mr={3} />
          <Text
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="600"
            color={color}
            mt={2}
          >
            Welcome back, {name}
          </Text>
        </Flex>

        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="600"
          color={color}
          my={5}
          ml={{ base: 0, md: 10 }}
          d="flex"
          alignItems="center"
        >
          <GiToken color="orange" /> &nbsp;Balance: {bal} ZET
        </Text>
        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="600"
          color={color}
          my={5}
          ml={{ base: 0, md: 10 }}
          d="flex"
          alignItems="center"
        >
          <SiOpslevel color="orange" /> &nbsp;Role: {role}
        </Text>
      </Box>
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        px={{ base: 5, md: 10 }}
        mb={5}
      >
        <Box w={{ base: "100%", md: "50%" }}>
          <Box
            d="flex"
            justifyContent="space-around"
            w="100%"
            flexWrap="wrap"
            flexDirection={{ base: "column", md: "row" }}
          >
            <Box
              w={{ base: "100%", md: "50%", lg: "40%" }}
              mx={{ base: "auto", lg: "12px" }}
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
              onClick={onOpen}
            >
              <Flex mb={5} fontWeight="700">
                <Box mr={5}>
                  <FcViewDetails />
                </Box>
                <Text fontSize="xl">Election details</Text>
              </Flex>
              <Text fontSize="md" textAlign="left" fontWeight="300">
                Click to see election details, positions available for election
                and eligibility to contest
              </Text>
            </Box>
            <Box
              w={{ base: "100%", md: "50%", lg: "40%" }}
              mx={{ base: "auto", lg: "12px" }}
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
              onClick={contest}
            >
              <Flex mb={5} fontWeight="700">
                <Box mr={5}>
                  <FaFistRaised />
                </Box>
                <Text fontSize="xl">Contest</Text>
              </Flex>
              <Text fontSize="md" textAlign="left" fontWeight="300">
                Express your interest to vie for a particular position by
                clicking here. Only eligible candidates can contest
              </Text>
            </Box>
            <Box
              w={{ base: "100%", md: "50%", lg: "40%" }}
              mx={{ base: "auto", lg: "12px" }}
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
              onClick={vote}
            >
              <Flex mb={5} fontWeight="700">
                <Box mr={5}>
                  <GiVote />
                </Box>
                <Text fontSize="xl">Vote</Text>
              </Flex>
              <Text fontSize="md" textAlign="left" fontWeight="300">
                Express your choice by voting for a suitable candidate here.
                Your votes are not monitored as it is made anonymously
              </Text>
            </Box>
            <Box
              w={{ base: "100%", md: "50%", lg: "40%" }}
              mx={{ base: "auto", lg: "12px" }}
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
              onClick={announce}
            >
              <Flex mb={5} fontWeight="700">
                <Box mr={5}>
                  <GoFileSubmodule />
                </Box>
                <Text fontSize="xl">See Results</Text>
              </Flex>
              <Text fontSize="md" textAlign="left" fontWeight="300">
                View voting results here. Results are only available after
                compilation and has been made public by the vote cordinator
              </Text>
            </Box>
          </Box>
        </Box>

        <Box
          w={{ base: "100%", md: "50%" }}
          direction={{ base: "column", md: "row" }}
        >
          <Box
            mx="auto"
            w="80%"
            border="0.4px solid orange"
            borderRadius="10px"
            px={5}
            py={3}
            h="97%"
          >
            <Text fontSize="2xl" fontWeight="600" textAlign="left" mb={3}>
              Activities
            </Text>

            {role == "Vote Cordinator" || role === "Teacher" ? (
              <Button
                bg="orange"
                isFullWidth
                size="lg"
                onClick={handleCompilation}
              >
                Compile Results
              </Button>
            ) : null}

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
      </Flex>
      <ElectionDetails isOpen={isOpen} onClose={onClose} />
      <ResultModal isOpen={isResultOpen} onClose={onResultClose} />

      <ContestAlert
        role={eligibleCategory}
        name={name}
        isModalOpen={isContestOpen}
        onModalClose={onContestClose}
        resetBal={resetBal}
        currentAccount={currentAccount}
      />
      <VoteModal
        category={category}
        isOpen={isVoteOpen}
        onClose={onVoteClose}
        roles={roles}
        resetBal={resetBal}
        currentAccount={currentAccount}
      />
    </Box>
  ) : (
    <Box w="100%">
      <Image src="compiling.gif" htmlWidth="75%" mx="auto" />
    </Box>
  );
};

export default Dashboard;
