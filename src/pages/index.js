import React, { Component } from 'react'
import Layout from '../components/article_layout'

export async function getArticleState(id) {
  let url = new URL(window.location.href);
  let response = await fetch(
    "http://" + url.hostname + ":" + url.port + "/api/getstatereadarticle",
    {
  	  method: "POST",
  	  headers: {'Content-Type': 'application/json'},
  	  body: JSON.stringify({
  	    date: url.search.split('&')[0].replace('?date=', ''),
  	    artnumber: id,
  	  })
    }
  )
  return await response.text() === "true";
}

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

	async componentDidMount() {
		let url = new URL(window.location.href);
		await fetch("http://" + url.hostname + ":" + url.port + "/api/nhkpage" + (url.search === "" ? (`?date=${new Date().valueOf()}&artnumber=-1`) : url.search))
			.then(response => {
				if (response.ok) {
					return response.text()
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
						});
					});
				} else {
					window.location.assign("/404");
				}
			})

		for (let articleCheckbox of document.getElementsByClassName("articleCheckbox")) {
			articleCheckbox.checked = await getArticleState(articleCheckbox.id);
		}
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