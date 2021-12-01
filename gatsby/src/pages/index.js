import React, { Component } from 'react'
import Layout from '../components/article_layout'

export default class IndexPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			titleText: "",
			timestampText: "",
			imgSrc: "",
			bodyText: [],
		}
	}

	componentDidMount() {
		fetch('api/nhkpage?date=1638162000000&artnumber=0')
			.then(response => {
				return response.text()
			})
      		.then(resultData => {
				resultData = resultData
					.replaceAll(/<rt>.*?<\/rt>/g, '')
					.replaceAll(/<table.*?<\/table>/gs, '')
					.replaceAll(/<audio.*<\/audio>/g, '')
					.replaceAll("<ruby>", '')
					.replaceAll("</ruby>", '')
					.replaceAll("</p>", '')
					.replaceAll(/<a.*?>/g, '')
					.replaceAll("</a>", '');
				let titleParsed = resultData.split("<h3>").pop().split("</h3>")[0];
				let timeParsed = resultData.split(/<time.*?>/).pop().split("</time>")[0];
				let imgParsed = resultData.split("<img src=\"").pop().split("\"")[0];
				let txtParsed = resultData.split(/<p.*?>/).slice(1);
        		this.setState({ 
					titleText: titleParsed,
					timestampText: timeParsed,
					imgSrc: imgParsed,
					bodyText: txtParsed,
				});
      	})
	}

	render() {
		return (
			<Layout
			title={this.state.titleText}
			timestamp={this.state.timestampText}
			img={this.state.imgSrc}
			text={this.state.bodyText}
			>
		</Layout>
	)
	}
}