import * as React from 'react'
import Layout from '../components/default_layout'

const NotFoundPage = () => {
	return (
		<Layout pageTitle="404">
			<p>Sorry! This page doesn't exist. :(</p>
			<br />
			<p>If you tried to find an article for this day, there aren't any (yet)!</p>
			<br />
			<p>Try selecting a different day using the calendar
				at the top of the page. To open the calendar,
				click the date at the top of the page.</p>
		</Layout>
	)
}

export default NotFoundPage
