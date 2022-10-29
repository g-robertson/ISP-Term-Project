import * as React from 'react'
import DefaultLayout from '../components/default_layout'

export { Head } from "../components/default_layout"

const NotFoundPage = () => (
	<DefaultLayout pageTitle="404">
		<p>Sorry! This page doesn't exist. :(</p>
		<br />
		<p>If you tried to find an article for this day, there aren't any (yet)!</p>
		<br />
		<p>Try selecting a different day using the calendar
			at the top of the page. To open the calendar,
			click the date at the top of the page.</p>
	</DefaultLayout>
)
export default NotFoundPage;
