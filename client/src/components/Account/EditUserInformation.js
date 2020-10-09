import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";

import { Form, Button } from "react-bootstrap";
import styles from "../Material-kit-components/landingPage.js";
import "../../styles.scss";

const useStyles = makeStyles(styles);

function EditUserInformation(props) {
  const [accountRedirect, setAccountRedirect] = useState(false);
  const classes = useStyles();

  const onSubmitHandler = function (event) {
    event.preventDefault();
    registerUser({
      firstName: event.target.elements["formBasicFirstname"].value,
      lastName: event.target.elements["formBasicLastname"].value,
      email: event.target.elements["formBasicEmail"].value,
      phone_number: event.target.elements["formBasicPhoneNumber"].value,
      profile_photo: event.target.elements["formBasicProfilePhoto"].value,
      bio: event.target.elements["formBasicBio"].value,
      id: props.user.id,
    });
  };

  const registerUser = function (registrationData) {
    axios
      .post("/users/edit", registrationData)
      .then((response) => {
        setAccountRedirect(true);
        props.editUser(response.data);
      })
      .catch((err) => {
        alert(err);
      });
  };

  if (accountRedirect) {
    return <Redirect to="/account" />;
  }

  return (
    <div>
      <Form onSubmit={onSubmitHandler} className="form-contenant">
        <div className="post-event-header">
          <h2 id="transition-modal-title">Edit Account</h2>
          <Button
            onClick={props.handleClose2}
            variant="none"
            type="button"
            id="close-button"
            disableRipple
          >
            <i class="fa fa-times " id="service-close" aria-hidden="true"></i>
          </Button>
        </div>

        <div className="event-form">
          <div className="first-section">
            <Form.Group controlId="formBasicFirstname">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                defaultValue={props.user.first_name}
                type="firstname"
                placeholder="First name"
              />
            </Form.Group>
            <Form.Group controlId="formBasicLastname">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                defaultValue={props.user.last_name}
                type="lastname"
                placeholder="Last name"
              />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                defaultValue={props.user.email}
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                defaultValue={props.user.phone_number}
                type="tel"
                placeholder="Phone Number"
              />
            </Form.Group>
          </div>
          <div className="second-section">
            <Form.Group controlId="formBasicProfilePhoto">
              <Form.Label>Profile Photo (URL or blank)</Form.Label>
              <Form.Control
                defaultValue={
                  props.user.profile_photo === "https://i.imgur.com/j6IJGS2.png"
                    ? ""
                    : props.user.profile_photo
                }
                type="url"
              />
            </Form.Group>

            <Form.Group controlId="formBasicBio">
              <Form.Label>Write a Bio</Form.Label>
              <Form.Control
                defaultValue={props.user.bio}
                as="textarea"
                rows="3"
                type="textarea"
                placeholder="Write something about yourself"
              />
            </Form.Group>

            <Button
              variant="outline-warning"
              href="/selectNeighbourhood"
              className="change-neighbourhood"
            >
              Change Neighbourhood
            </Button>
          </div>
        </div>

        <Button
          variant="warning"
          type="submit"
          className="service-alert-button post"
        >
          <div className="save">
            <i class="fa fa-save fa-2x"></i>
            <div>SAVE</div>
          </div>
        </Button>
      </Form>
    </div>
  );
}

export default EditUserInformation;
