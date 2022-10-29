import * as React from 'react'
import Layout from '../components/default_layout'

import { Head as DefaultHead } from "../components/default_layout"

export const Head = () => (
    <DefaultHead>
        <script src="/assets/js/search.js"></script>
    </DefaultHead>
)

const SearchPage = () => (
    <Layout>
    </Layout>
)
export default SearchPage;