import React from 'react';
import { Box, Text, Avatar, Flex, useColorModeValue } from "@chakra-ui/react";
import { FaFistRaised } from 'react-icons/fa';
import { GiToken, GiVote } from 'react-icons/gi';
import { GoFileSubmodule } from 'react-icons/go';
import { FcViewDetails } from 'react-icons/fc';
import { SiOpslevel } from 'react-icons/si';
import { BiSad } from 'react-icons/bi';

const Dashboard = () => {
    const color = useColorModeValue("black", "white")
    return (
        <Box>
            <Box px={{base:5, md:10}} mt="50px">
                <Flex alignItems="center" my={5} ml={{base:0, md:10}}>
                    <Avatar size="lg" src="avatar.png" mr={3}/>
                    <Text fontSize={{base:"2xl",md:"3xl"}} fontWeight="600" color={color}  mt={2}>Welcome back, Human</Text>
                </Flex>
                
                <Text fontSize={{base:"2xl",md:"3xl"}} fontWeight="600" color={color} my={5} ml={{base:0, md:10}} d="flex" alignItems="center"><GiToken color="orange"/> &nbsp;Balance: 700ZURI</Text>
                <Text fontSize={{base:"2xl",md:"3xl"}} fontWeight="600" color={color} my={5} ml={{base:0, md:10}} d="flex" alignItems="center"><SiOpslevel color="orange"/> &nbsp;Role: Student</Text>
            </Box>
            <Box d="flex" flexDirection={{base:"column", md:"row"}} px={{base:5, md:10}}>
                <Box w={{base:"100%", md:"50%"}}>
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
                    <Box mx="auto" w="80%" border="0.4px solid orange" borderRadius="10px" px={5} py={3} h={{base:"auto", md:"66vh"}}>
                        <Text fontSize="2xl" fontWeight="600" textAlign="left">Activities</Text>
                        <Box textAlign="center" w="100%" mt={5}>
                            <Text color="orange" fontSize="6xl"ml="45%" mb={3}><BiSad /></Text>
                            <Text fontSize="lg" fontWeight="400">No recent activities. Please check back later</Text>
                        </Box>
                    </Box>
                        
                </Box>
            </Box>
        </Box>
    );
};
 

export default Dashboard;
