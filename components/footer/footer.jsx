import React, { Component } from 'react';
import { Icon } from 'semantic-ui-react';
import styles from "./footer.module.css"

export default function Footer(props) {
    return (
        <div className={styles.footer_container}>
            <div className ={`${styles.light_gray} ${styles.flex_justify_center}`}>
                <Icon circular name='twitter' className={styles.social_icons} />
                <Icon circular name='linkedin alternate' className={styles.social_icons} />
                <Icon circular name='mail outline' className={styles.social_icons} />
            </div>
            <div className={styles.footer_sub_container}>
            <div className={styles.flex_justify_center}> 
                <span style={{padding : '0px 0.8em', fontSize : '0.95em', fontWeight : '700'}}>GDPR COMMITMENT</span>
                <span style={{padding : '0px 0.8em', fontSize : '0.95em', fontWeight : '700'}}>TERMS OF USE</span>
                <span style={{padding : '0px 0.8em', fontSize : '0.95em', fontWeight : '700'}}>PRIVACY POLICY</span>
            </div>
            <div className={styles.flex_justify_center}>
                <div>
                    GP LIAISON SERVICES LTD, JACKSON HOUSE, STATION ROAD, LONDON, E4 7BU, UNITED KINGDOM 
                    <br></br>
                    <br></br>
                    0207 477 2436 | HELLO@GP-LIAISON.COM
                </div>
            </div>
            <div className={styles.flex_justify_center}>
                <div style={{opacity : '0.75'}}>
                Powered by <a href='https://www.dahgroup.co.uk/' style={{color : '#ebebeb', textDecoration : 'underline'}}>Direct Access Healthcare Group</a>
                </div>
            </div>
            </div>
        </div>
    )
}