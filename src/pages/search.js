import * as React from 'react'
import Layout from '../components/default_layout'

import { Head as DefaultHead } from "../components/default_layout"

export const Head = () => {
    return (
        <DefaultHead>
            <script src="/assets/js/search.js"></script>
        </DefaultHead>
    )
}

const SearchPage = () => {
    return (
        <Layout>
        </Layout>
    )
}

export default SearchPage;