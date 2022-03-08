import React from "react";
import './ImageLinkForm.css';

const ImageLinkForm =({onInputChange,onSubmit})=>{
    return (
        <div>
            <p className="tc f1 .b--white"> Enter the image link here to detect the face</p>
            <div className='form center pa4 br3 shadow-5'>
                <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
                <button className='w-20 grow f4 link ph3 pv2 ml4 dib white bg-light-purple' onClick={onSubmit}>Detect</button>
            </div>
        </div>
    )
}
export default ImageLinkForm;