/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import React from 'react';

export const onRenderBody = ({ pathname, setPostBodyComponents }) => {
        setPostBodyComponents([
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                    function initFreshChat() {
                        window.fcWidget.init({
                        token: "05d686db-6ad6-41fb-b3a1-86a669df5b8c",
                        host: "https://wchat.freshchat.com"
                        });
                    }
                    function initialize(i,t){var e;i.getElementById(t)?initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,e.src="https://wchat.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}function initiateCall(){initialize(document,"freshchat-js-sdk")}window.addEventListener?window.addEventListener("load",initiateCall,!1):window.attachEvent("load",initiateCall,!1);
                    `
                }}
            />
             // <script defer data-cfasync="false" type="text/javascript"
            //     dangerouslySetInnerHTML={{
            //         __html: `
            //             window.civchat = {
            //                 apiKey: "eWKGsg",
            //             };
            //             `
            //     }}
            // />,
            // <script defer data-cfasync="false" type="text/javascript" src="https://fraservotes.user.com/widget.js"></script>
        ])
}