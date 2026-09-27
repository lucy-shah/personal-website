import portfolioPreview from '../assets/portfolioWebIMG.png'
import huskyClubQuestPreview from '../assets/huksyCQIMG.png'

const projects = [
  {
    slug: 'personal-portfolio',
    title: 'Personal Portfolio',
    detail: 'Personal project · Jun 2026–Present',
    description: 'A multi-page portfolio for sharing my work, interests, and the ideas behind them.',
    overview:
      'I designed and built this site as a home for my projects and the things I’m curious about, with a visual style that feels personal while staying easy to explore.',
    highlights: [
      'Built with React and Vite, with dedicated pages for projects, resume, about, inspiration, and contact.',
      'Created responsive layouts, custom styling, and small animations throughout the site.',
      'Set up GitHub Actions to build and deploy the site to GitHub Pages.',
    ],
    stack: 'React · Vite · JavaScript · CSS · GitHub Pages',
    previewImage: portfolioPreview,
    previewAlt: 'Screenshot of Lucy Shah’s personal portfolio homepage',
    link: 'https://lucy-shah.github.io/personal-website/',
    accent: 'project-accent-pink',
  },
  {
    slug: 'husky-club-quest',
    title: 'Husky Club Quest',
    detail: 'Data and software project · Jan–May 2026',
    description: 'A searchable directory for discovering and rating Northeastern student organizations.',
    overview:
      'I built the data and backend foundation for a tool that helps Northeastern students find clubs that fit their interests.',
    highlights: [
      'Scraped and maintained a Supabase PostgreSQL database of 600+ student organizations.',
      'Built FastAPI endpoints for club search, filtering, and student-submitted ratings.',
      'Designed the database schema and SQL queries for club metadata and aggregated ratings.',
    ],
    stack: 'Python · FastAPI · PostgreSQL · Supabase · SQL',
    previewImage: huskyClubQuestPreview,
    previewAlt: 'Screenshot of the Husky Club Quest home page',
    accent: 'project-accent-blue',
  },
]

export default projects
