import React, { useState, useEffect } from "react";
import openSocket from "socket.io-client";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Divider from '@material-ui/core/Divider';
import { toast } from "react-toastify";


import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(8, 8, 3),
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		alignItems: "center",
		marginBottom: 12,

	},

	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	},

}));

const Settings = () => {
	const classes = useStyles();

	const [settings, setSettings] = useState([]);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const { data } = await api.get("/settings");
				setSettings(data);
			} catch (err) {
				toastError(err);
			}
		};
		fetchSession();
	}, []);

	useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL);

		socket.on("settings", data => {
			if (data.action === "update") {
				setSettings(prevState => {
					const aux = [...prevState];
					const settingIndex = aux.findIndex(s => s.key === data.setting.key);
					aux[settingIndex].value = data.setting.value;
					return aux;
				});
			}
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleChangeSetting = async e => {
		const selectedValue = e.target.value;
		const settingKey = e.target.name;

		try {
			await api.put(`/settings/${settingKey}`, {
				value: selectedValue,
			});
			toast.success(i18n.t("settings.success"));
		} catch (err) {
			toastError(err);
		}
	};

	const getSettingValue = key => {
		const { value } = settings.find(s => s.key === key);
		return value;
	};

	return (
		<div className={classes.root}>
			<Container className={classes.container} maxWidth="sm">
				<Typography variant="body2" gutterBottom>
					{i18n.t("settings.title")}
				</Typography>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.userCreation.name")}
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="userCreation-setting"
						name="userCreation"
						value={
							settings && settings.length > 0 && getSettingValue("userCreation")
						}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							{i18n.t("settings.settings.userCreation.options.enabled")}
						</option>
						<option value="disabled">
							{i18n.t("settings.settings.userCreation.options.disabled")}
						</option>
					</Select>

				</Paper>

				<Divider style={{ margin: '20px 0' }} />
				<Typography variant="body2" gutterBottom>
					Groups
				</Typography>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.groups.name")}
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="groups-setting"
						name="groups"
						value={
							settings && settings.length > 0 && getSettingValue("groups")
						}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							{i18n.t("settings.settings.groups.options.enabled")}
						</option>
						<option value="disabled">
							{i18n.t("settings.settings.groups.options.disabled")}
						</option>
					</Select>
				</Paper>

				<Divider style={{ margin: '20px 0' }} />
				<Typography variant="body2" gutterBottom>
					Typebot
				</Typography>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.typebot.name")}
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="typebot-setting"
						name="typebot"
						value={
							settings && settings.length > 0 && getSettingValue("typebot")
						}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							{i18n.t("settings.settings.typebot.options.enabled")}
						</option>
						<option value="disabled">
							{i18n.t("settings.settings.typebot.options.disabled")}
						</option>
					</Select>
				</Paper>
				
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.typebotUrl.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="typebotUrl-setting"
						name="typebotUrl"
						value={settings && settings.length > 0 ? getSettingValue("typebotUrl") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.typebotName.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="typebotName-setting"
						name="typebotName"
						value={settings && settings.length > 0 ? getSettingValue("typebotName") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.typebotRestart.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="typebotRestart-setting"
						name="typebotRestart"
						value={settings && settings.length > 0 ? getSettingValue("typebotRestart") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.typebotOff.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="typebotOff-setting"
						name="typebotOff"
						value={settings && settings.length > 0 ? getSettingValue("typebotOff") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.typebotTime.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="typebotTime-setting"
						name="typebotTime"
						value={settings && settings.length > 0 ? getSettingValue("typebotTime") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Divider style={{ margin: '20px 0' }} />
				<Typography variant="body2" gutterBottom>
					Gmail
				</Typography>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.emailUser.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="emailUser-setting"
						name="emailUser"
						value={settings && settings.length > 0 ? getSettingValue("emailUser") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.emailPass.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="emailPass-setting"
						name="emailPass"
						value={settings && settings.length > 0 ? getSettingValue("emailPass") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.emailFrom.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="emailFrom-setting"
						name="emailFrom"
						value={settings && settings.length > 0 ? getSettingValue("emailFrom") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.emailTo.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="emailTo-setting"
						name="emailTo"
						value={settings && settings.length > 0 ? getSettingValue("emailTo") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Divider style={{ margin: '20px 0' }} />
				<Typography variant="body2" gutterBottom>
					Vonage API
				</Typography>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.vonageApiKey.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="vonageApiKey-setting"
						name="vonageApiKey"
						value={settings && settings.length > 0 ? getSettingValue("vonageApiKey") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.vonageApiSecret.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="vonageApiSecret-setting"
						name="vonageApiSecret"
						value={settings && settings.length > 0 ? getSettingValue("vonageApiSecret") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.vonageApiId.name")}
					</Typography>
					<TextField
						margin="dense"
						variant="outlined"
						id="vonageApiId-setting"
						name="vonageApiId"
						value={settings && settings.length > 0 ? getSettingValue("vonageApiId") : ''}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					/>
				</Paper>

				<Divider style={{ margin: '20px 0' }} />
				<Typography variant="body2" gutterBottom>
					API KEY
				</Typography>
				<Paper className={classes.paper}>
					<TextField
						id="api-token-setting"
						readonly
						label="Token Api"
						margin="dense"
						variant="outlined"
						fullWidth
						value={settings && settings.length > 0 && getSettingValue("userApiToken")}
					/>
				</Paper>

			</Container>
		</div>
	);
};

export default Settings;
