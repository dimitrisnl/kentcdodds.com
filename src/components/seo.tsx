import React from 'react'
import Helmet from 'react-helmet'
import {StaticQuery, graphql} from 'gatsby'
import SchemaOrg from './schema-org'

type Props = {
  isBlogPost?: boolean
  postData?: {
    childMarkdownRemark: {
      frontmatter?: Frontmatter
    }
  }
  frontmatter?: Frontmatter
  postImage: string
}

function SEO({
  postData = {childMarkdownRemark: {}},
  frontmatter = postData.childMarkdownRemark.frontmatter,
  postImage = null,
  isBlogPost = false,
}: Props) {
  return (
    <StaticQuery
      query={graphql`
        {
          site {
            siteMetadata {
              title
              description
              canonicalUrl
              image
              author {
                name
              }
              organization {
                name
                url
                logo
              }
              social {
                twitter
                fbAppID
              }
            }
          }
        }
      `}
      render={({site: {siteMetadata}}) => {
        const seo = frontmatter || siteMetadata
        const title = seo.title
        const description = seo.description
        const image = postImage ? `${seo.canonicalUrl}${postImage}` : seo.image
        const url = frontmatter
          ? `${seo.canonicalUrl}/${frontmatter.slug}`
          : seo.canonicalUrl
        const datePublished = isBlogPost ? frontmatter.datePublished : false

        return (
          <React.Fragment>
            <Helmet>
              {/* General tags */}
              <title>{title}</title>
              <meta name="description" content={description} />
              <meta name="image" content={image} />

              {/* OpenGraph tags */}
              <meta property="og:url" content={url} />
              {isBlogPost ? (
                <meta property="og:type" content="article" />
              ) : null}
              <meta property="og:title" content={title} />
              <meta property="og:description" content={description} />
              <meta property="og:image" content={image} />
              <meta property="fb:app_id" content={seo.social.fbAppID} />

              {/* Twitter Card tags */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:creator" content={seo.social.twitter} />
              <meta name="twitter:title" content={title} />
              <meta name="twitter:description" content={description} />
              <meta name="twitter:image" content={image} />
            </Helmet>
            <SchemaOrg
              isBlogPost={isBlogPost}
              url={url}
              title={title}
              image={image}
              description={description}
              datePublished={datePublished}
              canonicalUrl={seo.canonicalUrl}
              author={seo.author}
              organization={seo.organization}
              defaultTitle={seo.defaultTitle}
            />
          </React.Fragment>
        )
      }}
    />
  )
}

SEO.defaultProps = {
  postImage: null,
}

export default SEO