import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

// react-bootstrap
import Form from "react-bootstrap/Form";

//Material-kit-component styling and components (try to avoid understanding it, too confusing...)
import styles from "./Material-kit-components/landingPage.js";

//Our own style sheet
import "../../styles.scss";

const useStyles = makeStyles(styles);

function Login(props) {
  const [homeRedirect, sethomeRedirect] = useState(false);
  const classes = useStyles();

  //Hook from React-hook-form
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (userInfo) => {
    axios
      .post("/users/login", userInfo)
      .then((response) => {
        sethomeRedirect(true);
        props.login(response.data);
      })
      .catch((err) => alert("wrong credentials!"));
  };

  if (homeRedirect) {
    return <Redirect to="/home" />;
  }
  return (
    <div>
      <Form onSubmit={handleSubmit(onSubmit)} className="form-contenant-login">
        <div className="post-event-header">
          <h2 id="transition-modal-title">Welcome Back</h2>
          <Button
            onClick={props.handleClose}
            variant="none"
            type="button"
            id="close-button"
            disableRipple
          >
            <i class="fa fa-times " aria-hidden="true"></i>
          </Button>
        </div>
        <div className="event-form">
          <div className="first-section">
            <Form.Group controlId="formBasicEmail">
              <Form.Label>
                Email address <span>*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                ref={register({ required: true })}
              />
              {errors.email && (
                <span className="error-message">This field is required</span>
              )}
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>
                Password <span>*</span>
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                ref={register({ required: true })}
              />
              {errors.password && (
                <span className="error-message">This field is required</span>
              )}
            </Form.Group>
          </div>
        </div>
        <Button
          variant="warning"
          type="submit"
          className="service-alert-button post"
        >
          LOGIN
        </Button>
      </Form>
    </div>
  );
}

export default Login;
