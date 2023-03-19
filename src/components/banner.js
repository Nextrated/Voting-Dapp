import React from 'react';
import { Box, Text } from "@chakra-ui/react";


const Banner = () => {
    return (
		<Box bg="orange" w="100%" py={2} className="banner" boxShadow="xl">
			<Text className="banner-text" color="black"> You will be notified on your dashboard when election expression of interest and voting starts. Only valid members of Computing Masters Department can vote🔥🔥. Ensure you are registered by the vote adminstrator before you can vote or contest.	</Text>
		</Box>
    );
};

export default Banner;
