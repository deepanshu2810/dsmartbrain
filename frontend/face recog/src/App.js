import logo from './logo.svg';
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Rank from "./components/Rank/Rank";
import Clarifai, { FACE_DETECT_MODEL } from 'clarifai';
import './App.css';
import 'tachyons';

// import Particles from 'react-particles-js';
import Particles  from "react-tsparticles";
import React,{ Component } from 'react';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';

const particlesOptions = {
  fps_limit: 60,
  interactivity: {
    detect_on: "canvas",
    events: {
      onclick: { enable: true, mode: "push" },
      onhover: {
        enable: true,
        mode: "repulse",
        parallax: { enable: false, force: 60, smooth: 10 }
      },
      resize: true
    },
    modes: {
      push: { quantity: 4 },
      attract: { distance: 200, duration: 0.4, factor: 5 }
    }
  },
  particles: {
    color: { value: "#ffffff" },
    line_linked: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.4,
      width: 1
    },
    move: {
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
      bounce: false,
      direction: "none",
      enable: true,
      out_mode: "out",
      random: false,
      speed: 2,
      straight: false
    },
    number: { density: { enable: true, value_area: 800 }, value: 80 },
    opacity: {
      anim: { enable: false, opacity_min: 0.1, speed: 1, sync: false },
      random: false,
      value: 0.5
    },
    shape: {
      character: {
        fill: false,
        font: "Verdana",
        style: "",
        value: "*",
        weight: "400"
      },
      image: {
        height: 100,
        replace_color: true,
        src: "images/github.svg",
        width: 100
      },
      polygon: { nb_sides: 5 },
      stroke: { color: "#000000", width: 0 },
      type: "circle"
    },
    size: {
      anim: { enable: false, size_min: 0.1, speed: 40, sync: false },
      random: true,
      value: 5
    }
  },
  polygon: {
    draw: { enable: false, lineColor: "#ffffff", lineWidth: 0.5 },
    move: { radius: 10 },
    scale: 1,
    type: "none",
    url: ""
  },
  // retina_detect: true
}

const app = new Clarifai.App({
  apiKey: '2d8a576bb0f643eb95ded4595238c022'
 });

const initialState = {
  input:"",
  imageUrl:"",
  box:{},
  route:"signin",
  isSignedIn:false,
  user:{
  id:"",
  name: "",
  email: "",
  entries:'0',
  joined: ""
  }
}
class App extends Component{
  constructor(){
    super();
    this.state=initialState
    
  }
  loadUser = (data)=>{
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries:data.entries,
      joined: data.joined
    }})
}
  // componentDidMount(){
  //   fetch("http://localhost:3001/")
  //   .then(resp=> resp.json())
  //   .then(console.log);
  // }

  onRouteChange = (event) =>{
    if(event == 'signout'){this.setState(initialState)}
    else if(event == 'hi'){this.setState({isSignedIn:true})}
    this.setState({route:event});
  }
  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    // console.log(clarifaiFace);
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width,height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }
  displayFaceBox = (box)=>{
    console.log(box);
    this.setState({box:box});
  }
  onInputChange= (event) =>{
    console.log(event.target.value);
    this.setState({input:event.target.value});
  }
  onSubmit= ()=>{
    this.setState({imageUrl: this.state.input})
    // console.log("hi");
    app.models.
      predict(
        Clarifai.FACE_DETECT_MODEL,
      this.state.input)
      .then(resp =>{
        // console.log(resp);
        if(resp) {
          fetch("http://localhost:3001/image",{
            method:"put",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({
                id:this.state.user.id
            })
          })
          .then(resp=>resp.json())
          .then(count=>{
            this.setState(Object.assign(this.state.user , {entries:count}))
          })
          .catch(console.log)
        }
        this.displayFaceBox(this.calculateFaceLocation(resp));
      })
      .catch(err => console.log(err));
  }
  
  render(){
  const {isSignedIn , imageUrl , box , route} = this.state;
  return (
    <div>
      <Particles className='particles'
          // init={particlesInit}
          params={particlesOptions}
        />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { route ==='hi' 
        ? 
        <div>
          <Logo/>
          <Rank name = {this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
          <FaceRecognition box={box} imageUrl={imageUrl}/>
        </div>
        : (
          route ==='signin' ? 
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
          :
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
        )
      } 
    </div>
  );
  }
}

export default App;
