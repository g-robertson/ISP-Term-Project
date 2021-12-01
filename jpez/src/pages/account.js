import * as React from 'react'
import Layout from '../components/account_layout'

const AccountPage = () => {
	return (
		<Layout
		user="Seth"
		kanjiEntries={ 
			[
				{kanji:"水",count:"45",articles:[
					{checkedDate:"2021-11-30",articleLink:"/2021-11-30/3"},
					{checkedDate:"2021-11-30",articleLink:"/2021-11-30/1"},
					{checkedDate:"2021-11-30",articleLink:"/2021-11-30/5"},
					{checkedDate:"2021-11-30",articleLink:"/2021-11-30/5"}
				]},
				{kanji:"川",count:"24",articles:[
					{checkedDate:"2021-11-30",articleLink:"/2021-11-30/3"},
					{checkedDate:"2021-11-30",articleLink:"/2021-11-30/1"},
					{checkedDate:"2021-11-30",articleLink:"/2021-11-30/5"}
				]},
			]
		}>
		</Layout>
	)
}

export default AccountPage