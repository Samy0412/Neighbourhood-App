import React from "react";
import { Button } from "@material-ui/core";
import "../../styles.scss";

function Landing(props) {
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
          <Button className="login-button" variant="contained" href="/login">
            LOGIN
          </Button>
        </div>
      </header>
      <main>
        <section class="presentation">
          <div class="introduction">
            <div class="intro-text">
              <h1>Welcome to your neighbourhood!</h1>
              <p>Come and join the community blabalalalalalalalaalalaal.</p>
            </div>
            <div class="sign-in-button">
              <Button
                className="login-button"
                variant="contained"
                href="/register"
              >
                Sign In
              </Button>
            </div>
          </div>
          <div class="cover">
            <img src="./images/neighbourhood.png" alt="neighbourhood" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default Landing;
