import React from 'react'
import Layout from '@theme/Layout';

export default function Showcase() {
    return (
        <Layout title="Showcase" description="Animations built with hubble.gl">
            <div style={{padding: "64px 64px 0 64px"}}>
                <h1>Showcase</h1>
                <p style={{font: "normal 14px/20px 'Uber Move',Helvetica,Arial,sans-serif"}}>
                    <i>Would you like us to feature your project? <a href="https://github.com/visgl/hubble.gl/issues">Let us know!</a></i>
                </p>
                <p style={{marginBottom: "48px", font: "normal 14px/20px 'Uber Move',Helvetica,Arial,sans-serif"}}>
                    These videos demonstrate polished animations made with hubble.gl and light post processing. Video editors and presentation software can be used to add text, dissolve between clips, and combine multiple renderings. Learn more about these techniques in the <a href="/docs/post-processing">post processing</a> guide.
                </p>
                <div style={{display: "flex", flexWrap: "wrap"}}>
                    <Video name="LA Airspace" source="Uber Elevate" src="https://drive.google.com/file/d/1vFiFQkGvrQZJ6iFrU0vq2O3P-oU738wO/preview" />
                    <Video name="Network Evolution" source="Uber Elevate" src="https://drive.google.com/file/d/11fsNGWiYD73-APOcpcOGt7SyrfF5wLzf/preview" />
                    <Video name="LA Trip Movement" source="Uber Elevate" src="https://drive.google.com/file/d/1Np-z441mpgAL7MiZe3cchSVc_NnWRSni/preview" />
                    <Video name="LA Connections" source="Uber Elevate" src="https://drive.google.com/file/d/1AHbR-5XhbU11gr1uslQn8Ujlbh4xN7-b/preview" />
                    <Video name="LAX Movement Timelapse" source="Uber Elevate" src="https://drive.google.com/file/d/1-6bE0VLElT0e2r_eVMGqAvMQYme6zoGT/preview" />
                </div>
            </div>
        </Layout>
    )
} 

function Video({name, source, src}) {
    return (
        <div style={{paddingRight: "64px", paddingBottom: "64px", font: "normal 14px/20px 'Uber Move',Helvetica,Arial,sans-serif"}}>
            <iframe frameBorder="0" width="640" height="360" allowFullScreen={true} title={name} src={src}/>
            <h3 style={{margin: "12px 0 4px 0"}}>{name}</h3>
            <p style={{margin: 0}}>Source: {source}</p>
        </div>
    )
}