import React from 'react';
import './IntialSetting.css';

function IntialSetting(props) {
    return (props.trigger) ? (
        <div className='showSetting'>
            <div className='showSetting-inner'>
                <button className='close-btn' onClick={() => props.setTrigger(false)}>Close</button>
                { props.children }
            </div>
        </div>
    ) : "";
}

export default IntialSetting;