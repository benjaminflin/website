module.exports = {
  siteMetadata: {
    title: `ben / flin`,
    description: `Benjamin Flin's personal website`,
    author: `@benjaminflin`
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-layout`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`
      }
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `ben-flin-website`,
        short_name: `ben-flin`,
        start_url: `/`,
        theme_color: `#000000`,
        background_color: `#ffffff`,
        display: `standalone`,
        icon: `./src/images/icon-32x32.png`
      }
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/images/icon.png"
      }
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /images/
        }
      }
    }
  ]
};
