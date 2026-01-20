/**
 * Home page component with category cards
 */

import { Link } from 'react-router-dom'
import { docCategories, siteConfig } from '../data/docs'

export function HomePage() {
  const title = siteConfig.title || 'Notes'
  const description = siteConfig.description || ''

  return (
    <div className="home-page">
      <h1>{title}</h1>
      {description && <p>{description}</p>}

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Documents
        </h2>
        {docCategories.map(category => (
          <div key={category.id} className="home-page-category">
            <h3>{category.name}</h3>
            <p>{category.description}</p>
            <ul>
              {category.files.map(file => (
                <li key={file.id}>
                  <Link to={`/doc/${file.id}`}>{file.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  )
}
