import React from 'react';
import { Box, Text, Avatar, Flex, useColorModeValue } from "@chakra-ui/react";
import { FaFistRaised } from 'react-icons/fa';
import { GiVote } from 'react-icons/gi';
import { GoFileSubmodule } from 'react-icons/go';
import { FcViewDetails } from 'react-icons/fc';

const Dashboard = () => {
    const color = useColorModeValue("black", "white")
    return (
        <Box d="flex" flexDirection={{base:"column-reverse", md:"row"}} px={{base:5, md:10}} mt="50px">
            <Box w={{base:"100%", md:"50%"}}>
                    <Text fontSize="3xl" fontWeight="600" color={color} my={5} ml={10} >Welcome back, Human</Text>
                {/*<Box color={color} border="1px solid orange" borderRadius="10px" mx="auto" my={3} w={{base:"100%", md:"90%"}}>
                    <Text fontSize="2xl" fontWeight="600" textAlign="left">My Profile</Text>
                    <Flex>
                        <Avatar size="xl" src="avatar.png"/>
                        <Text>0x253hgdjalshcfsdjsvmxgsjbcrw65etyitwy</Text>
                    </Flex>
                    <Flex>
                        <Text>Name:</Text>
                        <Text>John Doe</Text>
                    </Flex>
                    <Flex>
                        <Text>Role:</Text>
                        <Text>Student</Text>
                    </Flex>
                    
                </Box>
*/}
                <Box d="flex" justifyContent="space-around" w="100%" flexWrap="wrap" flexDirection={{base:"column", md:"row"}}>
                    <Box w={{base:"100%", md:"50%",lg:"40%"}} mx={{base:"auto", lg:"12px"}} h="auto" backdropFilter="auto" backdropBlur="8px" boxShadow="xl" color={color} textAlign="center" fontSize="4xl"  p={5} my={3} borderRadius="10px" border="0.4px solid orange" cursor="pointer" className="card">
                        <Flex mb={5} fontWeight="700">
                            <Box mr={5}><FcViewDetails/></Box>
                            <Text fontSize="xl">Election details</Text>
                        </Flex>
                        <Text fontSize="md" textAlign="left" fontWeight="300">Click to see election details, positions available for election and eligibility to contest</Text>
                        
                    </Box>
                    <Box w={{base:"100%", md:"50%",lg:"40%"}} mx={{base:"auto", lg:"12px"}} h="auto" bg="orange" boxShadow="xl" color="black" textAlign="center" fontSize="3xl" p={5} my={3} borderRadius="10px" cursor="pointer" className="card">
                            <Flex mb={5} fontWeight="700">
                                <Box mr={5}><FaFistRaised/></Box>
                                <Text fontSize="xl">Contest</Text>     
                            </Flex>
                            <Text fontSize="md" textAlign="left" fontWeight="300">Express your interest to vie for a particular position by clicking here. Only eligible candidates can contest</Text>                       
                    </Box>
                    <Box w={{base:"100%", md:"50%",lg:"40%"}} mx={{base:"auto", lg:"12px"}} h="auto" bg="orange" color="black" boxShadow="xl" textAlign="center" fontSize="3xl" p={5} my={3} borderRadius="10px" cursor="pointer" className="card">
                        <Flex mb={5} fontWeight="700">
                            <Box mr={5}><GiVote/></Box>
                            <Text fontSize="xl">Vote</Text>
                        </Flex>
                        <Text fontSize="md" textAlign="left" fontWeight="300">Express your choice by voting for a suitable candidate here. Your votes are not monitored as it is made anonymously</Text>
                        
                    </Box>
                    <Box w={{base:"100%", md:"50%",lg:"40%"}} mx={{base:"auto", lg:"12px"}} h="auto" backdropFilter="auto" backdropBlur="8px" boxShadow="xl" color={color} textAlign="center" fontSize="3xl" p={5} my={3} borderRadius="10px" border="0.4px solid orange" cursor="pointer" className="card">
                        <Flex mb={5} fontWeight="700">
                            <Box mr={5}><GoFileSubmodule/></Box>
                            <Text fontSize="xl">See Results</Text>
                        </Flex>
                        <Text fontSize="md" textAlign="left" fontWeight="300">View voting results here. Results are only available after compilation and has been made public by the chairman</Text>
                    </Box>               
                </Box>
            </Box>

            <Box w={{base:"100%", md:"50%"}}>

                    <Text fontSize="lg" fontWeight="600" textAlign="left">Activities</Text>
            </Box>
        </Box>
    );
};
 

export default Dashboard;
