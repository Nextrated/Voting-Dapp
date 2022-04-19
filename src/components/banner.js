import React from 'react';
import { Box, Text } from "@chakra-ui/react";


const Banner = () => {
    return (
		<Box bg="orange" w="100%" py={2} className="banner" boxShadow="xl">
			<Text className="banner-text"> You will be notified on your dashboard when election commences and if you are eligible to contest. Only valid members of the Zuri Organization can vote🔥🔥. Ensure you are registered by the chairman before you can vote or contest.	</Text>
		</Box>
    );
};

export default Banner;
