import React from 'react';
import { Box, Text, Avatar, Flex, useColorModeValue } from "@chakra-ui/react";

const Dashboard = () => {
	const color = useColorModeValue("black", "white")
    return (
        <Box d="flex" flexDirection={{base:"column-reverse", md:"row"}} px={{base:5, md:10}} mt="50px">
        	<Box w={{base:"100%", md:"50%"}}>
        		<Box color={color} border="1px solid orange" borderRadius="10px">
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
        		<Box>
        			
        		</Box>
        	</Box>

        	<Box w={{base:"100%", md:"50%"}}>
        			<Text fontSize="lg" fontWeight="600" textAlign="left">Activities</Text>
        	</Box>
        </Box>
    );
};
 

export default Dashboard;
