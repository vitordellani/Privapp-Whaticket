import React from "react";

import { Card, Button } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import TicketHeaderSkeleton from "../TicketHeaderSkeleton";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  ticketHeader: {
    display: "flex",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    flex: "none",
    borderBottom: `1px solid ${theme.palette.divider}`,
    transition: "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease",
    [theme.breakpoints.down("sm")]: {
      flexWrap: "wrap",
    },
  },
}));

const TicketHeader = ({ loading, children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const handleBack = () => {
    history.push("/tickets");
  };

  return (
    <>
      {loading ? (
        <TicketHeaderSkeleton />
      ) : (
        <Card square className={classes.ticketHeader}>
          <Button onClick={handleBack} style={{ color: theme.palette.text.primary }}>
            <ArrowBackIos style={{ color: theme.palette.text.primary }} />
          </Button>
          {children}
        </Card>
      )}
    </>
  );
};

export default TicketHeader;