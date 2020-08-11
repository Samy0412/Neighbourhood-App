import React, { useState, useEffect } from "react";
import moment from 'moment';
import axios from "axios";
import { Link } from "react-router-dom";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { Button, Avatar, Card, CardActionArea, CardHeader, CardContent, CardMedia, Typography, FormControl, InputLabel, Select, Modal, Backdrop, Fade, FormGroup } from "@material-ui/core";
import { Form } from "react-bootstrap";

// core components 
import GridContainer from "../Material-kit-components/GridContainer.js";
import GridItem from "../Material-kit-components/GridItem.js";
import Parallax from "../Material-kit-components/Parallax.js";

import AlertPost from "./AlertPost";

// import styles from "./Material-kit-components/landingPage.js";
import "../../styles.scss";

import filterByCategory from "../Helpers/filterByCategory";
import filterByNeighbourhood from "../Helpers/filterByNeighbourhood";
import AlertsCarousel from "../Home/AlertsCarousel.js";

//for Material UI
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  rootCard: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

moment().format();

function Alerts(props) {
  const classes = useStyles();
  const [alerts, setAlerts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [state, setState] = useState({
    search: '',
    selectedCategory: ''
  });


  const fetchAlerts = async () => {
    const alerts = await axios.get('http://localhost:8001/alerts');
    setAlerts(filterByNeighbourhood(alerts.data, props.user.neighbourhood_id));
  };



  const filterAndSetCategories = (filter) => {
    const filtered = props.categories.filter(category => category.category_type === filter);
    setCategories(filtered);
  };

  useEffect(() => {
    fetchAlerts();
    filterAndSetCategories("Alerts");
  }, []);

  //////////////////// REFACTOR THESE TOGETHER IF YOU CAN
  const handleChange = (event) => {
    const name = event.target.name;
    setState({
      ...state,
      [name]: event.target.value,
    });
  };

  function categoryChange(e) {
    setState({
      ...state,
      selectedCategory: e.target.value
    });
  }

  /////////////////////////


  //these functions handle the Modal
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenDelete = () => {
    setOpenDelete(true)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  const fetchFilteredSubscriptions = async (postCategory_id) => {
    const data = await axios.get('http://localhost:8001/subscriptions');
    const filtered = data.data.filter(subscription => subscription.category_id === parseInt(postCategory_id));
    const subscriber_ids = filtered.map(entry => entry = entry.user_id);
    const phoneData = await axios.get('http://localhost:8001/users/phone-numbers');
    const phoneFiltered = phoneData.data.filter(user => subscriber_ids.includes(user.id) && user.neighbourhood_id === props.user.neighbourhood_id).map(entry => `+${entry.phone_number}`);
    return phoneFiltered;
  };

  const sendSubscriptionSMS = async function (postCategory_id) {
    let categoryName = '';
    for (const category of categories) {
      if (category.id === parseInt(postCategory_id)) {
        categoryName = category.name;
      }
    }
    const phoneNumbers = await fetchFilteredSubscriptions(postCategory_id);
    axios.post("/twilio", { phoneNumbers, categoryName });
  };

  const onSubmitHandler = function (event) {
    event.preventDefault();
    registerAlert({
      user_id: props.user.id,
      neighbourhood_id: props.user.neighbourhood_id,
      category_id: state.selectedCategory,
      title: event.target.elements['alertTitle'].value,
      description: event.target.elements['alertDescription'].value,
      alert_photo: event.target.elements['alertPhoto'].value,
    });
    sendSubscriptionSMS(state.selectedCategory);
    handleClose();
  };

  const registerAlert = function (registrationData) {
    console.log('REEGISTAERW', registrationData);
    axios.post("/alerts", registrationData)
      .then((response) => {
        setAlerts(filterByNeighbourhood(response.data, props.user.neighbourhood_id));
      });
  };






  const deleteSubmitHandler = function (event) {
    event.preventDefault();
    const alertID = parseInt(event.target.dataset.message)
    deleteAlert({
      user_id: props.user.id,
      alert_id: alertID
    });
    handleCloseDelete();
  };

  const deleteAlert = function (registrationData) {
    axios.delete("/alerts/delete", { data: registrationData })
      .then(() => {
        fetchAlerts()
      })
  };




  const setReceiver = function (data) {
    props.receiverData(data);
  };

  return (
    <div>
      <div className="container-fluid gedf-wrapper">
        <div className="row" className="postingRow">
          <div className="col-md-6 gedf-main">

            {/* <Parallax image={require("../../assets/img/blizzard.jpg")}> */}
            <div className={classes.container}>
              <Card className={classes.root}>
                {/* <CardActionArea> */}
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel htmlFor="outlined-age-native-simple" id="z-index-zero">
                    Filter By Category
                    </InputLabel>
                  <Select
                    native
                    value={state.search}
                    onChange={handleChange}
                    label="search"
                    rows="50"
                    inputProps={{
                      name: 'search',
                      id: 'outlined-age-native-simple',
                    }}
                  >
                    <option aria-label="None" value="" />
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>{category.name}</option>
                    ))}
                  </Select>
                </FormControl>

                {props.user ? (
                  <div>

                    <div>
                      <Button color='primary' type="button" onClick={handleOpen}>
                        Post New Alert
                    </Button>
                      <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                      >
                        <Fade in={open}>
                          <div className={classes.paper}>
                            <h2 id="transition-modal-title">Post New Alert</h2>
                            <Form onSubmit={onSubmitHandler}>

                              <Form.Group controlId="alertTitle">
                                <Form.Label>Service Title</Form.Label>
                                <Form.Control type="title" placeholder="Title" />
                              </Form.Group>

                              <FormGroup controlId="serviceCategory">
                                <Form.Label>Select Category</Form.Label>
                                <Form.Control
                                  as="select"
                                  value={state.selectedCategory}
                                  onChange={categoryChange}
                                >
                                  <option></option>
                                  {categories.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                  ))}
                                </Form.Control>
                              </FormGroup>

                              <Form.Group controlId="alertDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control type="description" placeholder="Description" as="textarea" rows="3" />
                              </Form.Group>

                              <Form.Group controlId="alertPhoto">
                                <Form.Label>Photo URL</Form.Label>
                                <Form.Control type="url" placeholder="URL" />
                              </Form.Group>

                              <Button variant="contained" color="primary" type="submit">
                                Post
                            </Button>
                            </Form>
                          </div>
                        </Fade>
                      </Modal>
                    </div>
                  </div>
                ) : <div></div>}

                {/* </CardActionArea> */}
              </Card>

              <h1>...</h1>
              <div className="all-postings">
                {filterByCategory(alerts, state.search, categories).map(alert => (

                  <AlertPost
                    key={alert.id}
                    id={alert.id}
                    user_photo={alert.profile_photo}
                    user_first_name={alert.first_name}
                    user_last_name={alert.last_name}
                    time_created={alert.time_created}
                    post_photo={alert.alert_photo}
                    post_description={alert.description}
                    post_title={alert.title}
                    user_id={alert.user_id}
                    current_user_id={props.user.id}

                    handleOpenDelete={handleOpenDelete}
                    handleCloseDelete={handleCloseDelete}
                    openDelete={openDelete}
                    deleteSubmitHandler={deleteSubmitHandler}

                    modalClass={classes.modal}
                    paperClass={classes.paper}

                    receiver={props.receiver}
                    setReceiver={props.receiverData}
                  />

                ))}

              </div>
              {/* </Parallax> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alerts;



{/* <GridItem xs={12} sm={6} md={3}>
              <Card className={classes.root}>
                <CardActionArea>
                  <div key={alert.id}>

                    <CardMedia
                      className={classes.media}
                      image={alert.alert_photo}
                      title={alert.title}
                    />

                    <CardHeader
                      avatar={
                        <Avatar alt={`${alert.first_name} ${alert.last_name}`} src={alert.profile_photo} className={classes.large} />
                      }
                      title={`${alert.first_name} ${alert.last_name}`}
                      subheader={`Posted ${moment(alert.time_created).fromNow()}`}
                    />

                    <CardContent>
                      <Typography variant="body2" color="textPrimary" component="h3">
                        {alert.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" component="p">
                        {alert.description}
                      </Typography>
                    </CardContent>

                  </div>


                  {props.user.id === alert.user_id ?

                    <div>
                      <Button onClick={handleOpenDelete}>
                        DELETE ALERT
                        </Button>
                      <Modal
                        aria-labelledby="Moo"
                        aria-describedby="Moo"
                        className={classes.modal}
                        open={openDelete}
                        onClose={handleCloseDelete}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{
                          timeout: 500,
                        }}
                      >
                        <Fade in={openDelete}>
                          <div className={classes.paper}>
                            <h2 id="transition-modal-title">Are you sure you would like to delete this Alert?</h2>
                            <Form data-message={alert.id} onSubmit={deleteSubmitHandler}>

                              <Button variant="contained" color="secondary" type="submit">
                                Confirm
                            </Button>
                              <Button onClick={handleCloseDelete} variant="contained" color="primary" type="button">
                                Cancel
                            </Button>
                            </Form>
                          </div>
                        </Fade>
                      </Modal>
                    </div>
                    :

                    <Button onClick={() => setReceiver(alert)}>
                      <Link to={{ pathname: '/newmessage' }}>Send Message</Link>
                    </Button>

                  }
                </CardActionArea>
              </Card>
            </GridItem> */}