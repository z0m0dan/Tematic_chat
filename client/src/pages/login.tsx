import { Form, Formik } from 'formik'
import React from 'react'
import { InputField } from "../components/InputField"
import Wrapper from "../components/Wrapper"
import { Flex, Button, Text } from "@chakra-ui/react";
import { useHistory } from 'react-router-dom'

const Login = () => {
    const router = useHistory() 
    return ( 
     <React.Fragment>
         <Flex
            align='center'
            height='100vh'
         >
           <Wrapper Variant='small' center>
               <Text fontSize='3xl' 
               textAlign='center'
                fontWeight='bold'
            >Inicio de sesión</Text>
           <Formik initialValues={{}} 
           onSubmit={(values, actions) => {
               alert(JSON.stringify(values))
               actions.setSubmitting(true)
                setTimeout(()=> {
                    actions.setSubmitting(false)
                    router.push('/dashboard')
                }, 2000)
           }}>
               {({isSubmitting})=> (
                   <Form>
                       <InputField name='username' label='Nombre de usuario' placeholder="" />
                       <InputField name='password' label='Clave' placeholder="" type='password' />
                        <Button type='submit'
                            mt={5}
                            colorScheme='red'
                            isLoading={isSubmitting}
                        >Iniciar Sesión</Button>
                   </Form>
               )}
           </Formik>
       </Wrapper>
       </Flex>
     </React.Fragment>
    )
}


export default Login