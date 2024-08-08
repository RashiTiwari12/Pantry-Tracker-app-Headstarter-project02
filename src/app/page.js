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
import {
  Box,
  Typography,
  Button,
  TextField,
  useMediaQuery,
  Grid,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();
  const email = useRef(null);
  const password = useRef(null);
  const fullname = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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
              console.log("");
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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        backgroundImage:
          'url("https://cdn.pixabay.com/photo/2021/02/01/06/48/geometric-5969508_1280.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backdropFilter: "blur(10px)",
        position: "relative",
      }}
    >
      <Grid container justifyContent="center">
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          sx={{
            bgcolor: "#fff",
            p: 4,
            border: "2px solid grey",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom align="center">
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
              {isMobile
                ? isSignInForm
                  ? "Sign In"
                  : "Sign Up"
                : isSignInForm
                ? "Sign In to Your Account"
                : "Create Your Account"}
            </Button>
            <Typography variant="body2" sx={{ mt: 2 }}>
              {isSignInForm ? (
                <>
                  New User?{" "}
                  <Button
                    variant="text"
                    color="primary"
                    sx={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: 0,
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "transparent", // To remove background on hover
                      },
                    }}
                    onClick={toggleSignInForm}
                  >
                    Sign up now
                  </Button>
                  .
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <Button
                    variant="text"
                    color="primary"
                    sx={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      padding: 0,
                      minWidth: "auto",
                      "&:hover": {
                        backgroundColor: "transparent", // To remove background on hover
                      },
                    }}
                    onClick={toggleSignInForm}
                  >
                    Sign In now
                  </Button>
                  .
                </>
              )}
            </Typography>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
