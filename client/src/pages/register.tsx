import { Button, Flex, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";

const Register: React.FC = () => {
  const router = useHistory();

  return (
    <React.Fragment>
      <Flex align="center" height="100vh">
        <Wrapper center Variant="small">
          <Text fontSize="3xl" textAlign="center" fontWeight="bold">
            Registro
          </Text>
          <Formik
            initialValues={{ username: "", password: "", name: "" }}
            onSubmit={async (values, actions) => {
              try {
                await fetch("http://localhost:5000/users/register", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(values),
                });
                alert("Registrado correctamente");
                router.push("/");
              } catch (error) {
                alert(error.message);
              }
            }}
          >
            {() => (
              <Form>
                <InputField
                  name="name"
                  label="Ingresa tu nombre"
                  placeholder="Es el nombre que se vera en la aplicacion"
                />
                <InputField
                  name="username"
                  label="Ingresa tu nombre de usuario"
                  placeholder="Es tu usuario para entrar a la aplicacion"
                />
                <InputField
                  name="password"
                  label="Ingresa tu nombre de contraseña"
                  placeholder=""
                  type="password"
                />
                <Button
                  colorScheme="blue"
                  mt={5}
                  justifyContent="center"
                  type="submit"
                >
                  Registrase
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      </Flex>
    </React.Fragment>
  );
};

export default Register;
