import * as React from 'react'
import Layout from '../components/default_layout'
import { StaticImage } from 'gatsby-plugin-image'
import { Link } from 'gatsby'

// styles
const headingStyle = {
    fontSize: "40px",
    textAlign: "center",
}

const logoStyle = {
	margin: "auto",
	textAlign: "center",
}

const infoText = {
	textAlign: "left",
	margin: "20px 0px 20px 0px",
	fontSize: "22px",
}

const techText = {
	textAlign: "center",
	fontSize: "20px",
	paddingTop: "30px",
}

  const AboutPage = () => {
	return (
		<Layout>
			<h1 style={headingStyle}>ABOUT</h1>
			<div style={logoStyle}>
				<StaticImage
					alt="JPEZ Logo"
					src="../images/jpez_logo.png"
					width={93}
				/>
			</div>
			<div>
				<p style={infoText}>
					JPEZ is a website designed for user's to keep track
					of the kanji they see in real world Japanese news
					articles. New articles will be updated everyday from <a href="https://nhkeasier.com/"> https://nhkeasier.com/</a> - 
					a website that further helps the reader understand
					Japanese news articles.
				</p>
				<p style={infoText}>
					Feel free to browse JPEZ without an account! However,
					to begin tracking your kanji on articles, please <Link to="/about">create an account</Link> and
					check the "Mark Article As Read" box once you've finished
					reading an article!
				</p>
			</div>
			<div style={techText}>
				For more techical information on how JPEZ works,
				please reference the items below.<br />
				<p><a href="../files/ISP-Project-Final-Report.pdf">Final Report</a></p>
				<p><a href="../files/ISP-Project-Final-Presentation.ppt">Powerpoint</a></p>
				<p>Demo Video</p>
				<video width="500px" height="281px" controls>
					<source src="" type="video/mp4" />
				</video>
			</div>
		</Layout>
	)
}

export default AboutPage
