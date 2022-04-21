import React, {useState} from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Box,
  Text,
  Center,
  Button,
  useToast,
  Radio,
  RadioGroup
} from '@chakra-ui/react';

import {ethers} from 'ethers'

import contractAddress from '../utils/contract_address.json'
import abi from '../utils/abi.json'


const SetVotingAndTime = () => {
    const [categoryDescription, setCategoryDescription] = useState('')
    const [eligibility, setEligibility] = useState('')
    return (
<Box>
   <Text>Set voting and eligibility</Text>
        <form action="">
        <FormLabel htmlFor="address">Enter category description</FormLabel>
          <Input
            id=""
            placeholder="Enter description here"
            required
            value={categoryDescription}
            onChange = {e => setCategoryDescription(e.target.value)}
            mb='4'
          />
<RadioGroup required >
<Radio value='0' mr='2' onChange={e => setEligibility(e.target.value)}>
Board Member
</Radio>
<Radio value='1' mr='2' onChange={e => setEligibility(e.target.value)}>
Teacher
</Radio>
<Radio value='2' onChange={e => setEligibility(e.target.value)}>
Student
</Radio>
</RadioGroup>

<Input type='time'/>
        </form>
</Box>
    )
}

export default SetVotingAndTime