import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Modal, Backdrop, Fade } from "@material-ui/core";
import { Button } from "@material-ui/core";
import Login from "./Login";
import "../../styles.scss";

//for Material UI
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));
function Landing(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    console.log("CLOSE");
    setOpen(false);
  };
  return (
    <div>
      <header className="landing-header">
        <div class="logo-container">
          <img src="./logo.png" alt="logo" />
          <h4 class="logo">CupOSugah</h4>
        </div>
        <nav>
          <ul class="nav-links">
            <li>
              <a class="nav-link" href="#">
                About
              </a>
            </li>
            <li>
              <a class="nav-link" href="#">
                Team
              </a>
            </li>
          </ul>
        </nav>
        <div class="login-container">
          <Button
            className="login-button"
            variant="warning"
            onClick={handleOpen}
          >
            LOG IN
          </Button>
        </div>
      </header>
      <main>
        <section class="presentation">
          <div class="introduction">
            <div class="intro-text">
              <h1>Your neighbourhood private social network </h1>
              <p>CupOSugah will help you connect with your neighbours.</p>
              <ul>
                <li>
                  <img src="./images/dot.png" alt="dot" />
                  Meet the members and connect with them.
                </li>
                <li>
                  {" "}
                  <img src="./images/dot.png" alt="dot" />
                  Request for help or offer your services.
                </li>
                <li>
                  <img src="./images/dot.png" alt="dot" />
                  Keep up to date with local events and alerts, and recieve
                  updates via SMS.
                </li>
              </ul>
            </div>
            <div class="sign-in-container">
              <Button
                className="sign-in-button"
                variant="contained"
                href="/register"
              >
                JOIN NOW!
              </Button>
            </div>
          </div>
          <div class="cover">
            <img src="./images/neighbourhood.png" alt="neighbourhood" />
          </div>
        </section>
      </main>

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div>
            <Login handleClose={handleClose} login={props.login} />
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default Landing;
