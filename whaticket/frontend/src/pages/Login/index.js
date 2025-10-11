import React, { useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  InputAdornment,
  IconButton,
  Link,
  Box
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from "@material-ui/core/styles";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import iconImage from "../../assets/icon.png";

const useStyles = makeStyles((theme) => ({
  '@keyframes breathe': {
    '0%, 100%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(1.05)',
    },
  },
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '-200% 0',
    },
    '100%': {
      backgroundPosition: '200% 0',
    },
  },
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #07372a 0%, #05251c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
  },
  loginCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: theme.spacing(4),
    maxWidth: 400,
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    animation: '$fadeInUp 0.8s ease-out',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: 'linear-gradient(90deg, #07372a, #0a4d3a, #07372a)',
      backgroundSize: '200% 100%',
      animation: '$shimmer 2s linear infinite',
    },
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
  },
  logoImage: {
    width: 60,
    height: 60,
    marginBottom: theme.spacing(2),
    animation: '$breathe 3s ease-in-out infinite',
    filter: 'drop-shadow(0 4px 20px rgba(7, 55, 42, 0.3))',
    objectFit: 'contain',
  },
  title: {
    fontWeight: 600,
    color: '#07372a',
    marginBottom: theme.spacing(1),
  },
  subtitle: {
    color: '#666',
    fontSize: '0.9rem',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      '&.Mui-focused': {
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 12px rgba(7, 55, 42, 0.2)',
      },
    },
    '& .MuiInputLabel-outlined': {
      color: '#666',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e0e0e0',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#07372a',
    },
  },
  submitButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#07372a',
    color: 'white',
    fontWeight: 600,
    fontSize: '1rem',
    textTransform: 'none',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#05251c',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(7, 55, 42, 0.3)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  registerLink: {
    color: '#07372a',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#05251c',
      textDecoration: 'underline',
    },
  },
  // Remover estilos antigos não utilizados
  paper: {
    display: 'none',
  },
  whatsapp: {
    display: 'none',
  },
  submit: {
    display: 'none',
  },
  containerWrapper: {
    display: 'none',
  },
  container: {
    display: 'none',
  },
  mobileContainer: {
    display: 'none',
  },
  hideOnMobile: {
    display: 'none',
  },
}));

const Login = () => {
  const classes = useStyles();

  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { handleLogin } = useContext(AuthContext);

  const handleChangeInput = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(user);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Box className={classes.loginCard}>
        <div className={classes.logoContainer}>
          <img src={iconImage} alt="Logo" className={classes.logoImage} />
          <Typography component="h1" variant="h5" className={classes.title}>
            {process.env.REACT_APP_TITLE}
          </Typography>
          <Typography variant="body2" className={classes.subtitle}>
            Faça login para acessar o sistema
          </Typography>
        </div>
        
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Usuário"
            name="email"
            value={user.email}
            onChange={handleChangeInput}
            autoComplete="email"
            autoFocus
            className={classes.textField}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            id="password"
            value={user.password}
            onChange={handleChangeInput}
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            className={classes.textField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((e) => !e)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className={classes.submitButton}
          >
            Entrar
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link
                variant="body2"
                component={RouterLink}
                to="/signup"
                className={classes.registerLink}
              >
                {i18n.t("login.buttons.register")}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </div>
  );
};

export default Login;
