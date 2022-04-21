import React, {useEffect} from 'react';
import {Box } from "@chakra-ui/react";
import { isStudent } from "../utils"

const Admin = () => {
	useEffect(()=>{
		const res= isStudent(window.ethereum);
		if(res === true){
			window.location.assign("/dashboard")
		}
	}, [])
    return (

    	// you can add a button in dashboard.js that says go to admin and that button is only visible to non-students. That button should redirect you to this page
        <Box>admin only</Box>
    );
};



export default Admin;
