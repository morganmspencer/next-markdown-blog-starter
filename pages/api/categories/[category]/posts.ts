import fs from 'fs'
import { postsDirectory, getPostBySlug } from '../../posts'

import type { NextApiRequest, NextApiResponse } from 'next'

export function getPostsByCategory(category: string, fields: string[] | undefined = undefined) {
  const slugs = fs.readdirSync(postsDirectory)

  const content = slugs
    .map((slug) => getPostBySlug(slug, fields))
    .sort((a, b) => (
      a.publish_date > b.publish_date ? -1 : 1
    ))


  content.forEach((post, i) => {
    if (post.category !== category) {
      content.splice(i, 1)
    } else {
      delete post.category
    }
  })

  return content
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).end()
  }

  const slug = req.query?.category?.toString()
  const queryFields = req.query?.fields?.toString()

  const fields: string[] = []

  if (queryFields) {
    fields.push(...queryFields.split(','))
  }

  const content = getPostsByCategory(slug, fields)
  res.status(200).json(content)
}