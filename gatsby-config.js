module.exports = {
  	siteMetadata: {
   		title: "jpez",
  	},
	proxy: {
		prefix: "/users",
		url: "http://localhost:8080",
	},
  	plugins: [
		"gatsby-plugin-image",
		"gatsby-plugin-sharp",
		"gatsby-plugin-react-helmet",
		{
			resolve: "gatsby-plugin-manifest",
			options: {
				icon: 'src/images/jpez_logo.png'
			}
		}
	],
};
