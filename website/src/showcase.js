import React from 'react'

import { H1, H3, P, A } from 'gatsby-theme-ocular/components';

export default function Showcase() {
    return (
        <div style={{padding: "64px 64px 0 64px"}}>
            <H1 style={{marginTop: "64px"}}>Showcase</H1>
            <P style={{marginBottom: "48px", font: "normal 14px/20px 'Uber Move',Helvetica,Arial,sans-serif"}}>
                These videos demonstrate polished animations made with hubble.gl and light post processing. Video editors and presentation software can be used to add text, dissolve between clips, and combine multiple renderings. Learn more about these techniques in the <A href="/docs/post-processing">post processing</A> guide.
            </P>
            <div style={{display: "flex", flexWrap: "wrap"}}>
                <Video name="LA Airspace" source="Uber Elevate" src="https://drive.google.com/file/d/1vFiFQkGvrQZJ6iFrU0vq2O3P-oU738wO/preview" />
                <Video name="Network Evolution" source="Uber Elevate" src="https://drive.google.com/file/d/11fsNGWiYD73-APOcpcOGt7SyrfF5wLzf/preview" />
                <Video name="LA Trip Movement" source="Uber Elevate" src="https://drive.google.com/file/d/1Np-z441mpgAL7MiZe3cchSVc_NnWRSni/preview" />
                <Video name="LA Connections" source="Uber Elevate" src="https://drive.google.com/file/d/1AHbR-5XhbU11gr1uslQn8Ujlbh4xN7-b/preview" />
                <Video name="LAX Movement Timelapse" source="Uber Elevate" src="https://drive.google.com/file/d/1-6bE0VLElT0e2r_eVMGqAvMQYme6zoGT/preview" />
            </div>
        </div>
    )
} 

function Video({name, source, src}) {
    return (
        <div style={{paddingRight: "64px", paddingBottom: "64px", font: "normal 14px/20px 'Uber Move',Helvetica,Arial,sans-serif"}}>
            <iframe frameBorder="0" width="640" height="360" allowFullScreen={true} title={name} src={src}/>
            <H3 style={{margin: "12px 0 4px 0"}}>{name}</H3>
            <P style={{margin: 0}}>Source: {source}</P>
        </div>
    )
}