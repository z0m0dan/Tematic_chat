import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import React, { InputHTMLAttributes } from 'react'
import { useField } from 'formik'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string,
    label: string,
    placeholder: string
    isRequired?: boolean
    type?: string

}
export const InputField:React.FC<InputFieldProps>  = ({isRequired = false, type= 'text',...props}) => {
    const [field, {error}] = useField(props)
    return (
        <FormControl isInvalid={!!error} mt={4} isRequired={isRequired}>
        <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
        <Input {...field} id={field.name} type={type}  placeholder={props.placeholder} />
        {error? <FormErrorMessage>{error}</FormErrorMessage> : null}
      </FormControl>
    );
}


