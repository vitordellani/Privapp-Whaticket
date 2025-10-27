import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import { Badge } from "@material-ui/core";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import BallotIcon from '@material-ui/icons/Ballot';
import GroupIcon from '@material-ui/icons/Group';
import SendIcon from '@material-ui/icons/Send';
import TextsmsIcon from '@material-ui/icons/Textsms';
import PhoneInTalkIcon from '@material-ui/icons/PhoneInTalk';
import BurstModeIcon from '@material-ui/icons/BurstMode';
// import InstagramIcon from '@material-ui/icons/Instagram';
//import ChatIcon from '@material-ui/icons/Chat';
//import ScheduleIcon from '@material-ui/icons/Schedule';
import ScheduleIcon from '@material-ui/icons/Schedule';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import SubjectIcon from '@material-ui/icons/Subject';
import RecordVoiceOverIcon from '@material-ui/icons/RecordVoiceOver';

import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";
import { makeStyles } from "@material-ui/core/styles";
import { useThemeMode } from "../context/ThemeMode/ThemeModeContext";

import chatImage from "../assets/icon.png";

const useStyles = makeStyles(theme => ({
	icon: {
		color: theme.palette.primary.main
	},
	logoContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		padding: theme.spacing(2),
		background: 'linear-gradient(135deg, rgba(7, 55, 42, 0.05) 0%, rgba(10, 77, 58, 0.1) 100%)',
		borderRadius: 16,
		margin: theme.spacing(1),
		transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
		position: 'relative',
		overflow: 'hidden',
		border: '1px solid rgba(7, 55, 42, 0.1)',
		boxShadow: '0 4px 20px rgba(7, 55, 42, 0.1)',
		'&::before': {
			content: '""',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background: 'radial-gradient(circle at center, rgba(7, 55, 42, 0.05) 0%, transparent 70%)',
			opacity: 0,
			transition: 'opacity 0.3s ease',
		},
		'&:hover': {
			transform: 'translateY(-2px)',
			boxShadow: '0 8px 30px rgba(7, 55, 42, 0.15)',
			'&::before': {
				opacity: 1,
			},
		},
		// Responsividade baseada no estado da sidebar
		'&.drawer-closed': {
			padding: theme.spacing(0.5),
			margin: theme.spacing(0.5),
			borderRadius: 8,
		},
	},
	logoImage: {
		width: '72px',
		height: '72px',
		maxWidth: '72px',
		objectFit: 'contain',
		filter: 'drop-shadow(0 4px 12px rgba(7, 55, 42, 0.2))',
		transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
		borderRadius: theme.spacing(1),
		'&:hover': {
			transform: 'scale(1.08) rotate(2deg)',
			filter: 'drop-shadow(0 8px 20px rgba(7, 55, 42, 0.3)) brightness(1.1)',
		},
		// Responsividade baseada no estado da sidebar
		'&.drawer-closed': {
			width: '32px',
			height: '32px',
			maxWidth: '32px',
			borderRadius: 4,
		},
		// Responsividade
		[theme.breakpoints.down('sm')]: {
			width: '56px',
			height: '56px',
			maxWidth: '56px',
			'&.drawer-closed': {
				width: '28px',
				height: '28px',
				maxWidth: '28px',
			},
		},
		[theme.breakpoints.down('xs')]: {
			width: '48px',
			height: '48px',
			maxWidth: '48px',
			'&.drawer-closed': {
				width: '24px',
				height: '24px',
				maxWidth: '24px',
			},
		},
	},
	logoTitle: {
		fontWeight: 700,
		background: 'linear-gradient(135deg, #07372a 0%, #0a4a37 50%, #0d5d44 100%)',
		WebkitBackgroundClip: 'text',
		WebkitTextFillColor: 'transparent',
		backgroundClip: 'text',
		textAlign: 'center',
		fontSize: '1.2rem',
		marginTop: theme.spacing(1),
		opacity: 0.95,
		transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
		letterSpacing: '0.5px',
		textTransform: 'uppercase',
		'&:hover': {
			opacity: 1,
			transform: 'scale(1.05)',
			textShadow: '0 2px 8px rgba(7, 55, 42, 0.3)',
		},
		// Responsividade baseada no estado da sidebar
		'&.drawer-closed': {
			display: 'none', // Oculta o título quando a sidebar está fechada
		},
		// Estilos para dark mode
		'&.dark-mode': {
			color: '#ffffff',
			background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #bdbdbd 100%)',
			WebkitBackgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
			backgroundClip: 'text',
			'&:hover': {
				textShadow: '0 2px 8px rgba(255, 255, 255, 0.3)',
			},
		},
		[theme.breakpoints.down('md')]: {
			fontSize: '1.1rem',
			marginTop: theme.spacing(0.5),
		},
		[theme.breakpoints.down('sm')]: {
			fontSize: '1rem',
			letterSpacing: '0.3px',
		},
		[theme.breakpoints.down('xs')]: {
			fontSize: '0.9rem',
			letterSpacing: '0.2px',
		},
	},
}));

function ListItemLink(props) {
  const { icon, primary, to, className } = props;
  const classes = useStyles();

  const renderLink = React.useMemo(
    () =>
      React.forwardRef((itemProps, ref) => (
        <RouterLink to={to} ref={ref} {...itemProps} />
      )),
    [to]
  );

  return (
    <li>
      <ListItem button component={renderLink} className={className}>
        {icon ? <ListItemIcon className={classes.icon}>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
}

const MainListItems = (props) => {
  
  const { drawerClose, drawerOpen } = props;
  const { whatsApps } = useContext(WhatsAppsContext);
  const { user } = useContext(AuthContext);
  const { mode } = useThemeMode();
  const [connectionWarning, setConnectionWarning] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (whatsApps.length > 0) {
        const offlineWhats = whatsApps.filter((whats) => {
          return (
            whats.status === "qrcode" ||
            whats.status === "PAIRING" ||
            whats.status === "DISCONNECTED" ||
            whats.status === "TIMEOUT" ||
            whats.status === "OPENING"
          );
        });
        if (offlineWhats.length > 0) {
          setConnectionWarning(true);
        } else {
          setConnectionWarning(false);
        }
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
  }, [whatsApps]);

  return (
    <div onClick={drawerClose}>
      <div className={`${classes.logoContainer} ${!drawerOpen ? 'drawer-closed' : ''}`}>
        <img 
          src={chatImage} 
          className={`${classes.logoImage} ${!drawerOpen ? 'drawer-closed' : ''}`}
          alt={process.env.REACT_APP_TITLE} 
        />
        <div className={`${classes.logoTitle} ${!drawerOpen ? 'drawer-closed' : ''} ${mode === 'dark' ? 'dark-mode' : ''}`}>
          {process.env.REACT_APP_TITLE || 'Privapp'}
        </div>
      </div>
      <Divider style={{
        background: 'linear-gradient(90deg, transparent 0%, rgba(33, 150, 243, 0.3) 50%, transparent 100%)',
        height: '2px',
        margin: '16px 0',
        border: 'none',
        borderRadius: '1px',
        boxShadow: '0 1px 3px rgba(33, 150, 243, 0.2)',
      }} />
      <ListItemLink
        to="/connections"
        primary={i18n.t("mainDrawer.listItems.connections")}
        icon={
          <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
            <SyncAltIcon />
          </Badge>
        }
      />
      <ListItemLink
        to="/"
        primary="Dashboard"
        icon={<BallotIcon />}
      />
      <ListItemLink
        to="/tickets"
        primary={i18n.t("mainDrawer.listItems.tickets")}
        icon={<WhatsAppIcon />}
      />

      <ListItemLink
        to="/contacts"
        primary={i18n.t("mainDrawer.listItems.contacts")}
        icon={<ContactPhoneOutlinedIcon />}
      />
      <ListItemLink
        to="/quickAnswers"
        primary={i18n.t("mainDrawer.listItems.quickAnswers")}
        icon={<QuestionAnswerOutlinedIcon />}
      />
      <Divider />
      <ListSubheader inset>
        {i18n.t("mainDrawer.listItems.bulk")}
      </ListSubheader>
      {/* <ListItemLink
              to="/ZDGChatbot"
              primary={i18n.t("mainDrawer.listItems.ZDGChatbot")}
        icon={<ChatIcon />}
      /> */}
      {/* <ListItemLink
              to="/ZDGAgendamento"
              primary={i18n.t("mainDrawer.listItems.ZDGAgendamento")}
              icon={<ScheduleIcon />}
      /> */}
      <ListItemLink
              to="/ZDGHistorico"
              primary={i18n.t("mainDrawer.listItems.ZDGHistorico")}
              icon={<SubjectIcon />}
      />
      <ListItemLink
              to="/ZDG"
              primary={i18n.t("mainDrawer.listItems.ZDG")}
              icon={<SendIcon />}
      />
      <ListItemLink
              to="/ZDGMedia"
              primary={i18n.t("mainDrawer.listItems.ZDGMedia")}
              icon={<BurstModeIcon />}
      />
      <ListItemLink
              to="/ZDGMedia2"
              primary={i18n.t("mainDrawer.listItems.ZDGMedia2")}
              icon={<BurstModeIcon />}
      />
      <ListItemLink
              to="/ZDGMedia3"
              primary={i18n.t("mainDrawer.listItems.ZDGMedia3")}
              icon={<RecordVoiceOverIcon />}
      />
      <ListItemLink
              to="/ZDGGroups"
              primary={i18n.t("mainDrawer.listItems.ZDGGroups")}
              icon={<GroupIcon />}
      />
      {/* <ListItemLink
              to="/InstaDirect"
              primary={i18n.t("mainDrawer.listItems.Direct")}
              icon={<InstagramIcon />}
      /> */}
      <ListItemLink
              to="/SMS"
              primary={i18n.t("mainDrawer.listItems.SMS")}
              icon={<TextsmsIcon />}
      />
      <ListItemLink
              to="/VoiceCall"
              primary={i18n.t("mainDrawer.listItems.VoiceCall")}
              icon={<PhoneInTalkIcon />}
      />
      <Can
        role={user.profile}
        perform="drawer-admin-items:view"
        yes={() => (
          <>
            <Divider />
            <ListSubheader inset>
              {i18n.t("mainDrawer.listItems.administration")}
            </ListSubheader>
            {/* <ListItemLink
              to="/connections"
              primary={i18n.t("mainDrawer.listItems.connections")}
              icon={
                <Badge badgeContent={connectionWarning ? "!" : 0} color="error">
                  <SyncAltIcon />
                </Badge>
              }
            /> */}
            <ListItemLink
              to="/users"
              primary={i18n.t("mainDrawer.listItems.users")}
              icon={<PeopleAltOutlinedIcon />}
            />
            <ListItemLink
              to="/queues"
              primary={i18n.t("mainDrawer.listItems.queues")}
              icon={<AccountTreeOutlinedIcon />}
            />
            <ListItemLink
              to="/settings"
              primary={i18n.t("mainDrawer.listItems.settings")}
              icon={<SettingsOutlinedIcon />}
            />
          </>
        )}
      />
    </div>
  );
};

export default MainListItems;
