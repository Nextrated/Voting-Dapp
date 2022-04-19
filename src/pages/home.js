import React, { useState } from 'react';
import { Box, Text, Image, Button, useColorModeValue} from "@chakra-ui/react"

const Home = () => {
	 const [ loading, setLoading ] = useState(false)
	// const color = useColorModeValue("white", "black")
	const handlePolls = () => {
		setLoading(true);
	}
    return (
    	loading === false ? (<Box d="flex" flexDirection={{base:"column", md:"row"}} px={{base:5, md:10}} py={10} mx="auto" justifyContent="space-between">
	    	    		<Box w={{base:"100%", md:"40%"}} fontSize="4xl" fontWeight="700" mt="50px">
	    	    			<Text>
	    		    			Vote for the future of Zuri with <span style={{color:"yellow"}}>ZuriPolls</span>
	    		    		</Text>
	    	    			<Text>
	    		    			Your Vote translates to your voice and your right to make a choice	
	    		    		</Text>
	    		    		
	    		    		<Button bg="yellow" px={10} size="lg" mx="auto" color="black" onClick={handlePolls}> Go to Polls</Button>
	    	    		</Box>
	    	    		<Box w={{base:"100%", md:"50%"}} d="flex" justifyContent="flex-end">
	    	    			<Image src="hero.svg" htmlHeight="80%" htmlWidth="100%"/>	
	    	    		</Box>
	    	   	
	    	    	</Box>	) : 

    				(<Box w="100%" h="80vh">
		    			<Image src="vote.gif" htmlHeight="80%" htmlWidth="100%" mx="auto"/>	
		    		</Box>)
    
        
    );
};


export default Home;
