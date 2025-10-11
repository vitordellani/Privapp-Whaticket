import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Tooltip, Switch, IconButton } from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { useThemeMode } from "../../context/ThemeMode/ThemeModeContext";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  iconBtn: {
    color: "inherit",
    padding: 6,
    marginRight: theme.spacing(1),
  },
}));

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 48,
    height: 26,
    padding: 0,
    margin: 0,
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(22px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: theme.palette.secondary.main,
        opacity: 1,
        border: "none",
      },
    },
  },
  thumb: {
    width: 24,
    height: 24,
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    backgroundColor: theme.palette.type === "dark" ? "#fff" : "#fff",
  },
  track: {
    borderRadius: 26 / 2,
    backgroundColor:
      theme.palette.type === "dark" ? "#3a3a3a" : "#cfd8dc",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.shortest,
    }),
  },
  checked: {},
}))(Switch);

const DarkModeToggle = () => {
  const classes = useStyles();
  const { mode, toggle } = useThemeMode();

  return (
    <div className={classes.root}>
      <Tooltip title={mode === "dark" ? "Modo escuro" : "Modo claro"}>
        <IconButton className={classes.iconBtn} onClick={toggle} aria-label="Alternar tema" color="inherit">
          {mode === "dark" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Tooltip>
      <IOSSwitch checked={mode === "dark"} onChange={toggle} name="darkMode" />
    </div>
  );
};

export default DarkModeToggle;