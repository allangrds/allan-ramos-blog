require('dotenv').config()

const queries = require('./src/utils/algolia_queries')

module.exports = {
  plugins: [
    {
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-autolink-headers',
          },
        ],
      },
      resolve: 'gatsby-plugin-mdx',
    },
    {
      options: {
        name: 'uploads',
        path: `${__dirname}/static/assets/uploads/`,
      },
      resolve: 'gatsby-source-filesystem',
    },
    'gatsby-plugin-netlify-cms',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-image',
    {
      options: {
        trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
      },
      resolve: 'gatsby-plugin-google-analytics',
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      options: {
        icon: 'static/assets/images/icon.png',
      },
      resolve: 'gatsby-plugin-manifest',
    },
    'gatsby-transformer-sharp',
    {
      __key: 'pages',
      options: {
        name: 'pages',
        path: './src/pages/',
      },
      resolve: 'gatsby-source-filesystem',
    },
    {
      options: {
        rule: {
          include: /assets/,
        },
      },
      resolve: 'gatsby-plugin-react-svg',
    },
    'gatsby-plugin-sharp',
    'gatsby-plugin-robots-txt',
    {
      options: {
        name: 'posts',
        path: `${__dirname}/posts`,
      },
      resolve: 'gatsby-source-filesystem',
    },
    {
      options: {
        plugins: [
          {
            options: {
              name: 'uploads',
            },
            resolve: 'gatsby-remark-relative-images',
          },
          {
            options: {
              linkImagesToOriginal: false,
              maxWidth: 629,
            },
            resolve: 'gatsby-remark-images',
          },
          'gatsby-remark-lazy-load',
          {
            options: {
              maintainCase: true,
              removeAccents: true,
            },
            resolve: 'gatsby-remark-autolink-headers',
          },
        ],
      },
      resolve: 'gatsby-transformer-remark',
    },
    {
      options: {
        apiKey: process.env.GATSBY_ALGOLIA_ADMIN_KEY,
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        chunkSize: 10000,
        enablePartialUpdates: true,
        indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
        queries,
      },
      resolve: 'gatsby-plugin-algolia-search',
    },
  ],
  siteMetadata: {
    author: '@allanramos',
    description: 'Aprendendo e compartilhando tecnologia',
    siteUrl: 'https://allanramos.com.br',
    title: 'Allan Ramos',
  },
}
