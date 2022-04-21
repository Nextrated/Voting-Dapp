import React, { useEffect, useState } from 'react';
import { Box, Text, Avatar, Flex, useColorModeValue, useToast, useDisclosure } from "@chakra-ui/react";
import { FaFistRaised } from 'react-icons/fa';
import { GiToken, GiVote } from 'react-icons/gi';
import { GoFileSubmodule } from 'react-icons/go';
import { FcViewDetails } from 'react-icons/fc';
import { SiOpslevel } from 'react-icons/si';
import { BiSad } from 'react-icons/bi';
import { getUserDetails, getUserBalance, isStudent, hasElectionStarted, isResultAnnounced } from "../utils";
import ElectionDetails  from "../components/ElectionDetails";

const Dashboard = ({currentAccount}) => {
    const [name, setName] = useState ('');
    const [role, setRole] = useState ('');
    const [bal, setBal] = useState (0);
    const color = useColorModeValue("black", "white");
    const toast = useToast();
    const { isOpen, onOpen, onClose} = useDisclosure();
    useEffect (() => {
        getUserDetails(window.ethereum).then((res) => {
            console.log(res)
                setName(res.name);
                const r = parseInt((res.role._hex), 16);
                if(r===0){
                    setRole("Board member")
                } else if(r===1){
                    setRole("Teacher")
                }else{
                    setRole("Student")
                }
        });

        getUserBalance(window.ethereum).then((res) => {
            const r = parseInt((res._hex), 16);
            setBal(r / (10 ** 18));
        })
      }, [bal, role, name])


    // const showElectionDetails = () => {

    // }

    const contest = ()=> {
        if (role === "Student"){
            toast({
                title:"Sorry",
                description:"You are not eligible to contest",
                status:"error",
                duration: 5000,
                isClosable:true
            });
        } else{
            return;
        }
    }

    const announce = async() => {
        const res = await isResultAnnounced(window.ethereum)
        if (res === false){
            toast({
                title:"Sorry",
                description:"Election results have not been announced yet!",
                status:"error",
                duration: 5000,
                isClosable:true
            });
        } else{
            return;
        }
    }

    const vote = async ()=> {
        const res = await hasElectionStarted(window.ethereum)
        if (res === false){
            toast({
                title:"Sorry",
                description:"Voting for this election has not commenced!",
                status:"error",
                duration: 5000,
                isClosable:true
            });
        } else{
            return;
        }

    }

    const showElectionDetails = ()=>{
        onOpen();
    }

    return (
        <Box>
            <Box px={{base:5, md:10}} mt="50px">
                <Flex alignItems="center" my={5} ml={{base:0, md:10}}>
                    <Avatar size="lg" src="avatar.png" mr={3}/>
                    <Text fontSize={{base:"2xl",md:"3xl"}} fontWeight="600" color={color}  mt={2}>Welcome back, {name}</Text>
                </Flex>
                
                <Text fontSize={{base:"2xl",md:"3xl"}} fontWeight="600" color={color} my={5} ml={{base:0, md:10}} d="flex" alignItems="center"><GiToken color="orange"/> &nbsp;Balance: {bal} ZET</Text>
                <Text fontSize={{base:"2xl",md:"3xl"}} fontWeight="600" color={color} my={5} ml={{base:0, md:10}} d="flex" alignItems="center"><SiOpslevel color="orange"/> &nbsp;Role: {role}</Text>
            </Box>
            <Box d="flex" flexDirection={{base:"column", md:"row"}} px={{base:5, md:10}}>
                <Box w={{base:"100%", md:"50%"}}>
                    <Box d="flex" justifyContent="space-around" w="100%" flexWrap="wrap" flexDirection={{base:"column", md:"row"}} onClick={showElectionDetails}>
                        <Box w={{base:"100%", md:"50%",lg:"40%"}} mx={{base:"auto", lg:"12px"}} h="auto" backdropFilter="auto" backdropBlur="8px" boxShadow="xl" color={color} textAlign="center" fontSize="4xl"  p={5} my={3} borderRadius="10px" border="0.4px solid orange" cursor="pointer" className="card">
                            <Flex mb={5} fontWeight="700">
                                <Box mr={5}><FcViewDetails/></Box>
                                <Text fontSize="xl">Election details</Text>
                            </Flex>
                            <Text fontSize="md" textAlign="left" fontWeight="300">Click to see election details, positions available for election and eligibility to contest</Text>
                            
                        </Box>
                        <Box w={{base:"100%", md:"50%",lg:"40%"}} mx={{base:"auto", lg:"12px"}} h="auto" bg="orange" boxShadow="xl" color="black" textAlign="center" fontSize="3xl" p={5} my={3} borderRadius="10px" cursor="pointer" className="card" onClick={contest}>
                                <Flex mb={5} fontWeight="700">
                                    <Box mr={5}><FaFistRaised/></Box>
                                    <Text fontSize="xl">Contest</Text>     
                                </Flex>
                                <Text fontSize="md" textAlign="left" fontWeight="300">Express your interest to vie for a particular position by clicking here. Only eligible candidates can contest</Text>                       
                        </Box>
                        <Box w={{base:"100%", md:"50%",lg:"40%"}} mx={{base:"auto", lg:"12px"}} h="auto" bg="orange" color="black" boxShadow="xl" textAlign="center" fontSize="3xl" p={5} my={3} borderRadius="10px" cursor="pointer" className="card" onClick={vote}>
                            <Flex mb={5} fontWeight="700">
                                <Box mr={5}><GiVote/></Box>
                                <Text fontSize="xl">Vote</Text>
                            </Flex>
                            <Text fontSize="md" textAlign="left" fontWeight="300">Express your choice by voting for a suitable candidate here. Your votes are not monitored as it is made anonymously</Text>
                            
                        </Box>
                        <Box w={{base:"100%", md:"50%",lg:"40%"}} mx={{base:"auto", lg:"12px"}} h="auto" backdropFilter="auto" backdropBlur="8px" boxShadow="xl" color={color} textAlign="center" fontSize="3xl" p={5} my={3} borderRadius="10px" border="0.4px solid orange" cursor="pointer" className="card" onClick={announce}>
                            <Flex mb={5} fontWeight="700">
                                <Box mr={5}><GoFileSubmodule/></Box>
                                <Text fontSize="xl">See Results</Text>
                            </Flex>
                            <Text fontSize="md" textAlign="left" fontWeight="300">View voting results here. Results are only available after compilation and has been made public by the chairman</Text>
                        </Box>               
                    </Box>
                </Box>

                <Box w={{base:"100%", md:"50%"}}>
                    <Box mx="auto" w="80%" border="0.4px solid orange" borderRadius="10px" px={5} py={3} h={{base:"auto", md:"66vh"}}>
                        <Text fontSize="2xl" fontWeight="600" textAlign="left">Activities</Text>
                        <Box textAlign="center" w="100%" mt={5}>
                            <Text color="orange" fontSize="6xl"ml="45%" mb={3}><BiSad /></Text>
                            <Text fontSize="lg" fontWeight="400">No recent activities. Please check back later</Text>
                        </Box>
                    </Box>
                        
                </Box>
            </Box>
            <ElectionDetails onClose={onClose} isOpen={isOpen} />
        </Box>
    );
};
 

export default Dashboard;
