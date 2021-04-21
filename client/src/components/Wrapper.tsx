
import { Box } from "@chakra-ui/react";
import React from "react";

interface WrapperProps {
    Variant?: 'small' | 'regular' | 'big'
    center?: boolean
}
function getWidth(variant: string) {
    switch(variant)
    {
        case 'small': return '30%'
        case 'regular': return '50%'
        case 'big': return '80%'
        default: return '100%'
    }
}
const Wrapper: React.FC<WrapperProps>  = ({children, Variant='regular', center=false}) => {
    return (
        <Box maxW={getWidth(Variant)} w='100%' 
            mx={center? 'auto': 'none'}
        >
            {children}
        </Box>
        )
}

export default Wrapper