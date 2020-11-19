import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Redirect } from 'react-router-dom';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import axios from 'axios';
import {
  Drawer, CssBaseline, AppBar, Toolbar, List, Typography,
  Divider, IconButton, ListItem, ListItemIcon, ListItemText,
  Link, TextField, Paper 
} from '@material-ui/core';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import HistoryIcon from '@material-ui/icons/History';
import StarIcon from '@material-ui/icons/Star';
import MailIcon from '@material-ui/icons/Mail';
import SettingsIcon from '@material-ui/icons/Settings';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import ContactPhoneIcon from '@material-ui/icons/ContactPhone';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3500')
const drawerWidth = 240;



const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "100%",
  },
  cardContent: {
    flexGrow: 1,
  },
  root: {
    display: "flex",
  },
  appBar: {
    height: 50,
    justifyContent: "center",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0,85),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
    card2: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      margin: "30px",
      minHeight: "30rem"
  },
  form: {
    maxWidth: "350px",
    borderRadius: "5px",
    padding: "20px",
    boxShadow: "0px 3px 24px -8px rgba(0, 0, 0, 0.75)"
  },
  namefield: { 
    marginBottom: "40px",
 
   },
  button: {
    marginTop: "20px",
    padding: "10px",
    background: "transparent",
    borderRadius: "5px"
  },
  renderchat: {
    maxWidth: "5000px",
    borderRadius: "5px",
    padding: "20px",
    boxShadow: "0px 3px 24px -8px rgba(0, 0, 0, 0.75)"
  },
  h3: { 
    color: "#2f72da" 
  },
  span: { 
    color: "black" 
  }

}));

export default function MessagePage() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const[state, setState] = useState({message: '', name: localStorage.getItem("username") })
  const[chat, setChat] = useState([])
   

  useEffect(() => {
  socket.on('message', ({name, message}) => {

      setChat([...chat,{name,message}])
  })
},[state])


  const onTextChange = e => { 
    
    setState({...state, [e.target.name]: e.target.value})
  }



   const onMessageSubmit = e => {
    e.preventDefault()
    const {name, message} = state
   
    socket.emit('message', {name, message})
    setState({message: '', name}) 
  }


  const renderChat = () => {
   
    return chat.map(({ name,message}, index) => (
      <div key = {index}>
        <h3>
         
          {name}: <span>{message}</span>
        </h3>
      </div>
    ))  
  }


  const handleDrawerOpen = () => {// function opens the side drawer
    setOpen(true);
  };

  const handleDrawerClose = () => {// function closes the side drawer
    setOpen(false);
  };

  useEffect(() => {// function gets messages of the user
    axios.post("http://localhost:4000/listings/filter", {username: localStorage.getItem("username")})
      .then(response => {
        setIsLoaded(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      });
  }, [])

  if(localStorage.getItem("auth-token") !== ""){// check if user logged in
    if(error){// handling errors
      return <div>Error: {error.message}</div>;
    }
    else if(!isLoaded){// waiting for setup
      return <div>Loading...</div>;
    }
    else{// rendering main display
      return(
        <div>
          <div className={classes.root}>
            <CssBaseline/>
            <AppBar
              position="relative"
              className={clsx(classes.appBar, {[classes.appBarShift]: open,})}
            >
              <Toolbar>
                <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
                >
                  <MenuIcon/>
                </IconButton>
                <Typography variant="h6" noWrap>
                  {localStorage.getItem("username")}'s MESSAGES!
                </Typography>
              </Toolbar>
            </AppBar>
          </div>
          <div>
            <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="left"
            open={open}
            classes={{paper: classes.drawerPaper,}}
            >
              <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                </IconButton>
              </div>
              <Divider/>
              <List>
                {[
                  {link: "http://localhost:3000/live-listings", text: "Live Listings", index: 0},
                  {link: "http://localhost:3000/sold-listings", text: "Sold Listings", index: 1},
                  {link: "http://localhost:3000/order-history", text: "Order History", index: 2},
                  {link: "http://localhost:3000/wishlist", text: "Wishlist", index: 3},
                  {link: "#", text: "Messages", index: 4},
                  {link: "http://localhost:3000/user-settings", text: "Settings", index: 5},
                ].map((obj) => (
                  <Link href={obj.link}>
                    <ListItem button key={obj.text}>
                      <ListItemIcon>
                        {obj.index === 0 && <MoneyOffIcon/>}
                        {obj.index === 1 && <MonetizationOnIcon/>}
                        {obj.index === 2 && <HistoryIcon/>}
                        {obj.index === 3 && <StarIcon/>}
                        {obj.index === 4 && <MailIcon/>}
                        {obj.index === 5 && <SettingsIcon/>}
                      </ListItemIcon>
                      <ListItemText primary={obj.text}/>
                    </ListItem>
                  </Link>
                ))}
              </List>
              <Divider/>
              <List>
                {["Inbox", "Started", "Sent Emails", "Drafts"].map((text, index) => (
                  <ListItem button key={text}>
                    <ListItemIcon>
                      {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
                    </ListItemIcon>
                    <ListItemText primary={text}/>
                  </ListItem>
                ))}
              </List>
            <Divider/>
            <List>
              {["All mail", "Trash", "Spam"].map((text, index) => (
                <ListItem button key={text}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
            <Divider/>
              <List>
                {[
                  {link: "#", text: "Customer Support", index: 0},
                  {link: "#", text: "Contact Email", index: 1},
                  {link: "#", text: "Contact Number", index: 2},
                ].map((obj) => (
                  <Link href={obj.link}>
                    <ListItem button key={obj.text}>
                      <ListItemIcon>
                        {obj.index === 0 && <ContactSupportIcon/>}
                        {obj.index === 1 && <ContactMailIcon/>}
                        {obj.index === 2 && <ContactPhoneIcon/>}
                      </ListItemIcon>
                      <ListItemText primary={obj.text}/>
                    </ListItem>
                  </Link>
                ))}
              </List>
            </Drawer>
          </div >
          
        
           
            <div className= {classes.card2}>
            <form onSubmit = {onMessageSubmit}>
                  <h1>Messenger</h1>
                  
                  <div className = {classes.namefield}>
                    {"Welcome " + state.name + "!"}
                  </div>
                  <div>
                    <TextField 
                    name = "message" 
                    onChange = {e => onTextChange(e)} 
                    value ={state.message}
                    id = "outlined-multiline-static"
                    variant = "outlined" 
                    label = "Message"
                    />
                  </div>
                  <button>Send Message</button>
            </form>
            <div className = {classes.renderchat}>
              <h1>Chat Log</h1>
              {renderChat()}
          </div>
          </div>
        </div>
      );
    }
  }
  else{// redirects to login page if not signed in
    return(
        <Redirect to="/login"/>
    );
  }
}