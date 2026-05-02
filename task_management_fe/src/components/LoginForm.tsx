// src/components/LoginForm.tsx
import { Box, Button, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';

import { boundActions, selectors } from '../app/index';
import { useLoginPageStyles } from '../pages/LoginPage.styles';
import { useLoginFormStyles } from './LoginForm.styles';
import { PasswordField } from './PasswordField';
import { FormTextField } from './FormTextField';

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

type LoginFormProps = {
  onSignUpClick: () => void;
  onForgotClick: () => void;
};

export const LoginForm = ({ onSignUpClick, onForgotClick }: LoginFormProps) => {
  const { classes } = useLoginFormStyles();
  const { classes: pageClasses, cx } = useLoginPageStyles();
  const error = useSelector(selectors.auth.isError);

  return (
    <Formik initialValues={{ email: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        console.log('v', values);
        boundActions.auth.loginRequest({
          email: values.email,
          password: values.password,
        });
      }}>
      {() => (
        <Form className={classes.form}>
          {error && (
            <Typography variant="body2" className={classes.errorText}>
              {error}
            </Typography>
          )}

          <Box className={classes.fieldGroup}>
            <Typography variant="body2" className={pageClasses.label}>Email</Typography>
            <FormTextField
              fullWidth
              className={classes.textField}
              name="email"
              type="email"
              placeholder="Enter email address"
              size="small"
            />
          </Box>

          <Box className={classes.passwordFieldGroup}>
            <PasswordField
              name="password"
              label="Password"
              placeholder="Enter Account Password"
            />
          </Box>

          <Box className={classes.forgotRow}>
            <Button variant="text" onClick={onForgotClick} className={pageClasses.forgotPasswordButton}>
              Forgot Password?
            </Button>
          </Box>

          <Button
            fullWidth
            variant="contained"
            className={pageClasses.primaryButton}
            type="submit"
          >
            Sign in to my workspace
          </Button>

          <Typography className={classes.orDivider}>or</Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={onSignUpClick}
            className={cx(pageClasses.primaryButton, pageClasses.primaryButtonFlush)}
          >
            Create an account
          </Button>
        </Form>
      )}
    </Formik>
  );
};
