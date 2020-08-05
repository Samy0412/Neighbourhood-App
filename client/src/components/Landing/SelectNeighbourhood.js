import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "../../styles.scss";

// @material-ui/core components
import { Button } from "@material-ui/core";

function SelectNeighbourhood() {

  const [homeRedirect, sethomeRedirect] = useState(false);
  const [neighbourhoods, setNeighbourhoods] = useState([]);

  useEffect(() => {
    axios.get("/neighbourhood/choices")
      .then(
        (response) => {
          // console.log("Data:", response.data);
          setNeighbourhoods(response.data);
        }
      );
  }, []);

  console.log("neighbourhoods:", neighbourhoods);
  // console.log("neighbourhoods 0 index:", Object.keys(neighbourhoods[0]));

  const addNeighbourhoodOne = function (event) {
    event.preventDefault();
    addNeighbourhood({
      id: neighbourhoods[0].id
    });
  };

  const addNeighbourhoodTwo = function (event) {
    event.preventDefault();
    addNeighbourhood({
      id: neighbourhoods[1].id
    });
  };

  const addNeighbourhood = function (neighbourID) {
    axios.post("/neighbourhood/addNeighbourhood", neighbourID)
      .then(() =>
        sethomeRedirect(true)
      );
  };

  if (homeRedirect) {
    return (
      <Redirect to="/home" />);
  }

  return (!neighbourhoods[0] ? null : (<div className="select-neighbourhood-container">
    <h3>Based on your location, we suggest joining one of the following neighbourhoods </h3>
    <div className="neighbourhood-choices">
      <figure>
        <img src={neighbourhoods[0].neighbourhood_photo}></img>
        <Button variant="contained" color="primary" type="submit" onClick={addNeighbourhoodOne}>
          {neighbourhoods[0].name}
        </Button>
      </figure>
      <figure>
        <img src={neighbourhoods[1].neighbourhood_photo}></img>
        <Button variant="contained" color="primary" type="submit" onClick={addNeighbourhoodTwo}>
          {neighbourhoods[1].name}
        </Button>
      </figure>
    </div>
  </div>
  )
  );
}

export default SelectNeighbourhood;
