import React, { Component } from 'react'
import Layout from '../components/article_layout'

export default class IndexPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			pages: [
				{
					titleText: "",
					timestampText: "",
					imgSrc: "",
					bodyText: [],
				}
			]
		}
	}

	componentDidMount() {
		let url = new URL(window.location.href);
		fetch("http://" + url.hostname + ":" + url.port + "/api/nhkpage" + (url.search === "" ? (`?date=${new Date().valueOf()}&artnumber=-1`) : url.search))
			.then(response => {
				return response.text()
			})
			.then(resultData => {
				resultData.split("|~|").map(resultText => {
					resultText = resultText
						.replaceAll(/<rt>.*?<\/rt>/g, '')
						.replaceAll(/<table.*?<\/table>/gs, '')
						.replaceAll(/<audio.*<\/audio>/g, '')
						.replaceAll("<ruby>", '')
						.replaceAll("</ruby>", '')
						.replaceAll("</p>", '')
						.replaceAll(/<a.*?>/g, '')
						.replaceAll("</a>", '');
					let titleParsed = resultText.split("<h3>").pop().split("</h3>")[0];
					let timeParsed = resultText.split(/<time.*?>/).pop().split("</time>")[0];
					let imgParsed = resultText.split("<img src=\"").pop().split("\"")[0];
					let txtParsed = resultText.replaceAll(/<[^p][^\/p].*?>/g, '').split(/<p.*?>/).slice(1);
					this.setState({ 
						pages: [...this.state.pages, {
							titleText: titleParsed,
							timestampText: timeParsed,
							imgSrc: imgParsed,
							bodyText: txtParsed,
						}]
					});
				})
		})
	}

	render() {
		return (
			<Layout
			pages={this.state.pages.slice(1)}
			>
		</Layout>
		)
	}
}