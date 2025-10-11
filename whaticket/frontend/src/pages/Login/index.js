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
  '@keyframes gradientShift': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
  '@keyframes floatAnimation': {
    '0%, 100%': {
      transform: 'translateY(0px)',
    },
    '50%': {
      transform: 'translateY(-10px)',
    },
  },
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f4c3a 0%, #07372a 50%, #05251c 100%)',
    backgroundSize: '400% 400%',
    animation: '$gradientShift 8s ease infinite',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(2),
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'radial-gradient(circle at 20% 80%, rgba(15, 76, 58, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(7, 55, 42, 0.3) 0%, transparent 50%)',
      pointerEvents: 'none',
    },
  },
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: 24,
    padding: theme.spacing(5),
    maxWidth: 420,
    width: '100%',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    animation: '$fadeInUp 0.8s ease-out',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 35px 70px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.15)',
    },
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
    animation: '$floatAnimation 6s ease-in-out infinite',
  },
  logoImage: {
    width: 80,
    height: 80,
    objectFit: 'contain',
    marginBottom: theme.spacing(2),
    filter: 'drop-shadow(0 8px 32px rgba(7, 55, 42, 0.3))',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
      filter: 'drop-shadow(0 12px 40px rgba(7, 55, 42, 0.4))',
    },
  },
  title: {
    fontWeight: 700,
    color: '#07372a',
    marginBottom: theme.spacing(1),
    background: 'linear-gradient(135deg, #07372a, #0a4d3a)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    fontSize: '1.8rem',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    fontWeight: 400,
    opacity: 0.8,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(2),
  },
  textField: {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      borderRadius: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderColor: 'rgba(7, 55, 42, 0.2)',
        borderWidth: 2,
      },
      '&:hover fieldset': {
        borderColor: 'rgba(7, 55, 42, 0.4)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#07372a',
        boxShadow: '0 0 0 3px rgba(7, 55, 42, 0.1)',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 25px rgba(7, 55, 42, 0.15)',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#666',
      fontWeight: 500,
      '&.Mui-focused': {
        color: '#07372a',
      },
    },
  },
  submitButton: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(1.5),
    borderRadius: 12,
    background: 'linear-gradient(135deg, #07372a 0%, #0a4d3a 100%)',
    color: 'white',
    fontWeight: 600,
    fontSize: '1.1rem',
    textTransform: 'none',
    boxShadow: '0 8px 25px rgba(7, 55, 42, 0.3)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
      transition: 'left 0.5s ease',
    },
    '&:hover': {
      background: 'linear-gradient(135deg, #05251c 0%, #07372a 100%)',
      transform: 'translateY(-3px)',
      boxShadow: '0 12px 35px rgba(7, 55, 42, 0.4)',
      '&::before': {
        left: '100%',
      },
    },
    '&:active': {
      transform: 'translateY(-1px)',
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
        </form>
      </Box>
    </div>
  );
};

export default Login;
