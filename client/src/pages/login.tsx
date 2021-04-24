import { Button, Flex, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import { InputField } from "../components/InputField";
import Wrapper from "../components/Wrapper";

const Login = () => {
  const router = useHistory();

  if (localStorage.getItem("qid")) router.push("/dashboard");

  function handleRegister() {
    router.push("/register");
  }
  return (
    <React.Fragment>
      <Flex align="center" height="100vh">
        <Wrapper Variant="small" center>
          <Text fontSize="3xl" textAlign="center" fontWeight="bold">
            Inicio de sesión
          </Text>
          <Formik
            initialValues={{ username: "", password: "" }}
            onSubmit={async (values, actions) => {
              actions.setSubmitting(true);
              try {
                const response = await fetch(
                  "http://localhost:5000/auth/login",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                  }
                );
                if (response.status === 404) {
                  alert("El usuario no existe");
                  return;
                }
                const data = await response.json();
                localStorage.setItem("qid", data.token);
                router.push("/dashboard");
              } catch (e) {
                alert(e.message);
              }
              actions.setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputField
                  name="username"
                  label="Nombre de usuario"
                  placeholder=""
                />
                <InputField
                  name="password"
                  label="Clave"
                  placeholder=""
                  type="password"
                />
                <Button
                  type="submit"
                  mt={5}
                  colorScheme="red"
                  isLoading={isSubmitting}
                >
                  Iniciar Sesión
                </Button>
                <Button
                  mt={5}
                  mx={5}
                  colorScheme="green"
                  onClick={handleRegister}
                >
                  Registrarse
                </Button>
              </Form>
            )}
          </Formik>
        </Wrapper>
      </Flex>
    </React.Fragment>
  );
};

export default Login;
