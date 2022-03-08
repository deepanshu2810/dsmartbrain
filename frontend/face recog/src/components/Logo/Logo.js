import React from "react";
import brain from './brain.png'
import Tilt from 'react-parallax-tilt'

const Logo =()=>{
    return (
        
        <div className="ma4 mt0" style={{display:"flex", justifyContent:"center"}}>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 150, width: 150 }} >
                <div style={{display:"flex", justifyContent:"center"}} className="Tilt-inner pa3"> 
                    <img  style={{paddingTop: '5px'}} alt="logo" src={brain}/> 
                </div>
            </Tilt>
            
        </div>
    )
}
export default Logo;