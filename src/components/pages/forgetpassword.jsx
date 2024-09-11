import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";
import { Button, Typography, TextField } from "@mui/material";

const ForgetPassword = () => {
  const [step, setStep] = useState(1); // Track the current step (1: request reset, 2: enter code & new password)
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate(); 

  // Cognito User Pool Data
  const poolData = {
    UserPoolId: "us-east-1_AEdwzu9Xx", // Your user pool id here
    ClientId: "6258t5vdisgcu7rjkuc5c94ba9", // Your client id here
  };
  const userPool = new CognitoUserPool(poolData);

  // Step 1: Request reset password (send code)
  const handleRequestReset = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.forgotPassword({
      onSuccess: (data) => {
        console.log("Code sent to:", data.CodeDeliveryDetails.Destination);
        setSuccessMessage("A verification code has been sent to your mobile.");
        setStep(2); // Move to the next step to enter verification code & new password
        setIsSubmitting(false);
      },
      onFailure: (err) => {
        console.error(err);
        setErrorMessage(err.message || "Failed to send verification code.");
        setIsSubmitting(false);
      },
    });
  };

  // Step 2: Confirm the new password
  const handleResetPassword = (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.confirmPassword(verificationCode, newPassword, {
      onSuccess: () => {
        setSuccessMessage("Password reset successfully. Please log in again.");
        setIsSubmitting(false);
        setTimeout(() => {
          navigate("/"); // Only navigate to login after the password is reset
        }, 2000); // Small delay to show success message
      },
      onFailure: (err) => {
        console.error(err);
        setErrorMessage(err.message || "Failed to reset password.");
        setIsSubmitting(false);
      },
    });
  };

  return (
    <div>
      <Typography variant="h6">
        {step === 1 ? "Forget Password" : "Enter Verification Code and New Password"}
      </Typography>

      {step === 1 ? (
        <form onSubmit={handleRequestReset}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            fullWidth
            required
          />
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}
          {successMessage && (
            <Typography color="primary">{successMessage}</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Send Verification Code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword}>
          <TextField
            label="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
          />
          {errorMessage && (
            <Typography color="error">{errorMessage}</Typography>
          )}
          {successMessage && (
            <Typography color="primary">{successMessage}</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Reset Password"}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgetPassword;