import React from "react";

import { Avatar, CardHeader } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

import { i18n } from "../../translate/i18n";

const TicketInfo = ({ contact, ticket, onClick }) => {
  const theme = useTheme();
  return (
    <CardHeader
      onClick={onClick}
      style={{ cursor: "pointer" }}
      titleTypographyProps={{ noWrap: true, style: { color: theme.palette.text.primary } }}
      subheaderTypographyProps={{ noWrap: true, style: { color: theme.palette.text.secondary } }}
      avatar={<Avatar src={contact.profilePicUrl} alt="contact_image" />}
      title={`${contact.name} #${ticket.id}`}
      subheader={
        ticket.user &&
        `${i18n.t("messagesList.header.assignedTo")} ${ticket.user.name}`
      }
    />
  );
};

export default TicketInfo;
