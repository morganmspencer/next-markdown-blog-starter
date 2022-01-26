import { getAuthors, getAuthorBySlug } from 'pages/api/authors'
import PageLayout from 'components/PageLayout'
import FeedItem from 'components/FeedItem'

import { GetStaticProps, GetStaticPaths } from 'next'

const blog = require('nmbs.config.json')

export default function Author({
  author,
}: {
  author: ObjectWithCategory,
}) {
  return (
    <PageLayout title={`${author.title}`} metaTitle={`${author.title}${blog.seo.sep}${blog.authors.name}`}>
      <section className="feed-wrapper">
        {author.posts.map(post => (
          <FeedItem
            key={post.slug}
            title={`${post.title}`}
            link={`/${post.category}/${post.slug}`}
            excerpt={post.excerpt}
          />
        ))}
      </section>
    </PageLayout>
  )
}

export const getStaticPaths: GetStaticPaths = () => {
  const authors = getAuthors()

  return {
    paths: authors.map((author) => {
      return {
        params: {
          author: author.slug,
        },
      }
    }),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const params = context.params
  const authorSlug = params?.author?.toString()

  let author: MarkdownFileObject

  if (authorSlug) {
    author = getAuthorBySlug(authorSlug, [], true)
  } else {
    author = {}
  }

  return {
    props: { author },
  }
}