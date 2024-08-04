"use client";
import { useRef, useState } from "react";
import { checkValidData } from "./validate";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, TextField } from "@mui/material";
const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const email = useRef(null);
  const password = useRef(null);
  const fullname = useRef(null);
  const handleButtonClick = () => {
    const message = checkValidData(
      email.current.value,
      password.current.value
      // fullname.current.value
    );
    setErrorMessage(message);

    if (message) return;
    if (!isSignInForm) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value,
        fullname.current.value
      )
        .then((userCredential) => {
          router.push("/inventory");
          // Signed up
          const user = userCredential.user;
          updateProfile(user, {
            displayName: fullname.current.value,
          })
            .then(() => {
              const { uid, email, displayName, photoURL } = auth.currentUser;
            })
            .catch((error) => {
              // An error occurred
              setErrorMessage(error.message);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "," + errorMessage);
        });
    } else {
      //sign in
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed in

          router.push("/inventory");
          const user = userCredential.user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + ",", errorMessage);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{
          border: "2px solid red",
          backgroundImage:
            'url("https://cdn.pixabay.com/photo/2021/02/01/06/48/geometric-5969508_1280.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backdropFilter: "blur(10px)",
          position: "relative",
        }}
      >
        <Box
          height={500}
          width={500}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          p={2}
          bgcolor="#fff"
          sx={{
            border: "2px solid grey",
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            {isSignInForm ? "Sign In" : "Sign Up"}
          </Typography>
          <form onSubmit={(e) => e.preventDefault()} style={{ width: "100%" }}>
            {!isSignInForm && (
              <TextField
                inputRef={fullname}
                label="Full Name"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
            <TextField
              inputRef={email}
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            <TextField
              inputRef={password}
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
            />
            {errorMessage && (
              <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleButtonClick}
            >
              {isSignInForm ? "Sign In" : "Sign Up"}
            </Button>
            <Typography
              variant="body2"
              sx={{ mt: 2, cursor: "pointer", textDecoration: "underline" }}
              onClick={toggleSignInForm}
            >
              {isSignInForm
                ? "New User? Sign up now."
                : "Already registered? Sign In now"}
            </Typography>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Login;
