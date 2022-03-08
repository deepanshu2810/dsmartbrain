import React from "react";
import './Rank.css'

const Rank =({name,entries})=>{
    return (
        <div>
            {/* <link href="https://fonts.googleapis.com/css2?family=Neonderthaw&display=swap" rel="stylesheet"></link> */}
            <link href="https://fonts.googleapis.com/css2?family=Syne+Tactile&display=swap" rel="stylesheet"></link>
            <p className="tc"> {name}'s Rank is </p>
            <p className="tc">{entries}</p>
        </div>
    )
}
export default Rank;