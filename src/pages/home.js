import React, { useState } from 'react';
import { Box, Text, Image, Button } from "@chakra-ui/react"
import {isStakeholder} from "../utils";

const Home = ({currentAccount}) => {
	 const [ loading, setLoading ] = useState(false)
	// const color = useColorModeValue("white", "black")
	async function redirect(){
		await window.location.assign("/dashboard")
	}

	const stakeholderCheck = async() => {
	    const res = await isStakeholder(window.ethereum, currentAccount);
	    return res
	  }
		
	const handlePolls = async() => {
		const res = await stakeholderCheck()
		setLoading(true);
		res ? setTimeout(redirect, 3000) : alert("Sorry, you are not a stakeholder")
		// setTimeout(redirect, 3000);		
	}

    return (
    	loading === false ? (<Box d="flex" flexDirection={{base:"column-reverse", md:"row"}} px={{base:5, md:10}} py={10} mx="auto" justifyContent="space-between">
	    	    		<Box w={{base:"100%", md:"40%"}} fontSize={{base:"3xl",md:"2xl",lg:"4xl"}} fontWeight="700" mt="50px" textAlign={{base:"center", md:"left"}}>
	    	    			<Text>
	    		    			Vote for the future of Zuri with <span style={{color:"orange"}}>ZuriPolls</span>
	    		    		</Text>
	    	    			<Text>
	    		    			Your vote translates to your voice and your right to make a choice	
	    		    		</Text>
	    		    		
	    		    		<Button bg="orange" isFullWidth mt={10} size="lg" color="black" onClick={handlePolls}> Go to Polls</Button>
	    	    		</Box>
	    	    		<Box w={{base:"100%", md:"50%"}} d="flex" justifyContent="flex-end">
	    	    			<Image src="hero.svg" htmlHeight="80%" htmlWidth="100%" className="hero-img"/>	
	    	    		</Box>
	    	   	
	    	    	</Box>	) : 

    				(<Box w="100%">
		    			<Image src="vote.gif" htmlWidth="75%" mx="auto"/>	
		    		</Box>)
    
        
    );
};


export default Home;
