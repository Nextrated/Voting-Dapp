import React from 'react';
import { Box, Text, Flex, Button } from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

const Header = ({toggleWallet, currentAccount, currentNetwork, isConnected}) => {
     //truncate wallet address
    function truncate(input) {
        return input.substring(0, 8) + '...' + input.substring(38);
    };

    return (
        <Flex w="100%" p={5} boxShadow="xl" justify="space-between" alignItems="center" className="header">
            <Text fontSize={{base:"lg", md:"2xl"}} fontWeight="700">Computing Polls 🗳️</Text>
            <Box d="flex" alignItems="center">
                <ColorModeSwitcher/>
                <Box d="flex" flexDirection="column" mt="-10px" ml={3}>
                     <Button variant="outline" colorScheme="yellow" borderRadius="50px"  onClick={toggleWallet} mb={2}>
                         {isConnected ? <> {truncate(currentAccount)}</> : <>👛 &nbsp; Connect Wallet</>}
                     </Button>
                     <sub style={{color:"orange",fontSize:"10px", fontWeight:"bold", textAlign:'center'}}>{currentNetwork}</sub>
                </Box>
            </Box>
        </Flex>
        
    );
};



export default Header;
