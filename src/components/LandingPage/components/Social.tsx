import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faStackOverflow, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons';
import socialsLinks from '../../../content/socialsLinks';

const Social = (): JSX.Element => {

    let socialsIndex = 0;      
    const [toggle, setToggle] = useState(false);

    const hoverComments = () => {      
      setToggle(!toggle);

      setTimeout(() =>{
        setToggle(false);
      }, 90000);
    }    

    const clickComments = () => {      
        setToggle(!toggle);
  
        setTimeout(() =>{
          setToggle(false);
        }, 5000);
      }    
    return (
        <div className={ (toggle) ? "toggle-btn active" : "toggle-btn"}>
          <div className="toggle-comment" onMouseEnter={hoverComments} onClick={clickComments}>
            <FontAwesomeIcon  icon={faCommentDots} />        
          </div>          
          <div className="social">
            <h3>Find me at</h3>
            <div className="container">
              <ul>
                  {                                      
                    socialsLinks.map(el => {
                          
                        {++socialsIndex;}  
                        return (
                            <li key={socialsIndex}>
                                <a href={el.link} className={el.type} target="_blank">
                                    {
                                        (el.type == 'google') ? <FontAwesomeIcon icon={faGoogle} /> : 
                                            (el.type == 'twitter') ? <FontAwesomeIcon icon={faTwitter} /> :   
                                                (el.type == 'github') ? <FontAwesomeIcon icon={faGithub} /> :                                      
                                                    (el.type == 'stackoverflow') ? <FontAwesomeIcon icon={faStackOverflow} /> :                                      
                                                        (el.type == 'email') ? <FontAwesomeIcon icon={faEnvelope} /> : ''                                    
                                    }                                    
                                </a>
                            </li>                        
                        );                                              
                    })
                  }
                
              </ul>
            </div>
          </div>
        </div>
    );
}

export default Social;