import React from "react";

const Navigation =({onRouteChange , isSignedIn})=>{
        if(isSignedIn)
        {
            return (
                <div  style={{display:"flex",justifyContent:"end"}}>
                    <div onClick={() => onRouteChange("signout")} className='pa3 f3 link dim black pointer underline'> Sign Out </div>
                </div>
            );
        }
        else{
            return (
                <div  style={{display:"flex",justifyContent:"end"}}>
                    <div onClick={() => onRouteChange("signin")} className='pa3 f3 link dim black pointer underline'> Sign In </div>
                    <div onClick={() => onRouteChange("register")} className='pa3 f3 link dim black pointer underline'> Register </div>
                </div>
            )
        }
}
export default Navigation;