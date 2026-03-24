// ============================================
// PORTFOLIO SCRIPT - WAQAS
// GitHub API Integration & Dynamic Content
// ============================================

// GitHub API Configuration
const GITHUB_USER = 'connect2waqas';
const GITHUB_API = 'https://api.github.com';

// Repository Categories Mapping
const REPO_CATEGORIES = {
  'OOP': 'oop',
  'Two-sum': 'algorithms',
  'groupby': 'data',
  'API': 'other',
  'skills-introduction-to-git': 'other',
};

// Default Projects Data (Fallback)
const DEFAULT_PROJECTS = [
  {
    name: 'OOP',
    description: 'Object-Oriented Programming concepts and implementations in Python. Demonstrates classes, inheritance, polymorphism, and encapsulation.',
    url: 'https://github.com/connect2waqas/OOP',
    category: 'oop',
    language: 'Python',
    tags: ['OOP', 'Classes', 'Inheritance'],
    updated: 'Recently',
  },
  {
    name: 'Two-sum',
    description: 'Classic LeetCode problem: find indices of two numbers that add up to a target value. Demonstrates algorithm optimization.',
    url: 'https://github.com/connect2waqas/Two-sum',
    category: 'algorithms',
    language: 'Python',
    tags: ['Algorithm', 'Array', 'Hashing'],
    updated: 'Recently',
  },
  {
    name: 'groupby',
    description: 'Data manipulation using Pandas groupby functionality. Practical data analysis and aggregation techniques.',
    url: 'https://github.com/connect2waqas/groupby',
    category: 'data',
    language: 'Python',
    tags: ['Pandas', 'Data Analysis', 'Grouping'],
    updated: 'Recently',
  },
  {
    name: 'API',
    description: 'API development and integration. Building and consuming APIs for practical applications.',
    url: 'https://github.com/connect2waqas/API',
    category: 'other',
    language: 'Python',
    tags: ['API', 'Integration', 'HTTP'],
    updated: 'Recently',
  },
  {
    name: 'skills-introduction-to-git',
    description: 'Learning Git and version control basics. Understanding workflows, commits, branches, and collaboration.',
    url: 'https://github.com/connect2waqas/skills-introduction-to-git',
    category: 'other',
    language: 'Git',
    tags: ['Git', 'Version Control', 'Learning'],
    updated: 'Recently',
  },
];

let allProjects = [...DEFAULT_PROJECTS];
let currentFilter = 'all';
let searchQuery = '';

// ===== Theme Management =====
const THEME_KEY = 'portfolio-theme';

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

  if (isDark) {
    document.body.classList.remove('light-mode');
  } else {
    document.body.classList.add('light-mode');
  }

  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.querySelector('.theme-icon');
  const isDark = !document.body.classList.contains('light-mode');
  icon.textContent = isDark ? '☀️' : '🌙';
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isDark = !document.body.classList.contains('light-mode');
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  updateThemeIcon();
}

// Initialize theme on load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderProjects();
  fetchGitHubProfile();
  setupEventListeners();
});

document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// ===== Mobile Menu Management =====
function setupMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navbarMenu = document.querySelector('.navbar-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navbarMenu.classList.remove('active');
    });
  });
}

// ===== GitHub API Functions =====
async function fetchGitHubProfile() {
  const container = document.getElementById('githubProfileContent');

  try {
    const response = await fetch(`${GITHUB_API}/users/${GITHUB_USER}`);
    if (!response.ok) {
      throw new Error('GitHub API error');
    }

    const user = await response.json();
    displayGitHubProfile(user);
    document.getElementById('stat-repos').textContent = user.public_repos || '—';
  } catch (error) {
    console.warn('Could not fetch from GitHub API:', error);
    displayFallbackGitHubProfile(container);
  }
}

function displayGitHubProfile(user) {
  const container = document.getElementById('githubProfileContent');
  const profileHTML = `
    <div class="github-user-info">
      <img src="${user.avatar_url}" alt="${user.login}" class="github-avatar">
      <h3 class="github-username">${user.login}</h3>
      <p class="github-bio">${user.bio || 'Future AI Engineer | Python | Data Science'}</p>
      <div class="github-stats">
        <div class="github-stat">
          <div class="github-stat-value">${user.public_repos}</div>
          <div class="github-stat-label">Repositories</div>
        </div>
        <div class="github-stat">
          <div class="github-stat-value">${user.followers}</div>
          <div class="github-stat-label">Followers</div>
        </div>
        <div class="github-stat">
          <div class="github-stat-value">${user.following}</div>
          <div class="github-stat-label">Following</div>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = profileHTML;
}

function displayFallbackGitHubProfile(container) {
  const profileHTML = `
    <div class="github-user-info">
      <div style="font-size: 48px; margin-bottom: 15px;">🐙</div>
      <h3 class="github-username">connect2waqas</h3>
      <p class="github-bio">Future AI Engineer | Python | Data Science</p>
      <div class="github-stats">
        <div class="github-stat">
          <div class="github-stat-value">5+</div>
          <div class="github-stat-label">Repositories</div>
        </div>
        <div class="github-stat">
          <div class="github-stat-value">0</div>
          <div class="github-stat-label">Followers</div>
        </div>
        <div class="github-stat">
          <div class="github-stat-value">0</div>
          <div class="github-stat-label">Following</div>
        </div>
      </div>
    </div>
  `;
  container.innerHTML = profileHTML;
}

// ===== Project Rendering =====
const projectsGrid = document.getElementById('projectsGrid');
const noResults = document.getElementById('noResults');
const searchInput = document.getElementById('projectSearch');
const filterButtons = document.querySelectorAll('.filter-btn');

function createProjectCard(project) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.dataset.category = project.category;
  card.dataset.name = project.name.toLowerCase();

  const tagsHTML = project.tags
    .map(tag => `<span class="project-tag">${tag}</span>`)
    .join('');

  const languageTag = project.language
    ? `<span class="project-tag language">${project.language}</span>`
    : '';

  card.innerHTML = `
    <div class="project-header">
      <h3 class="project-name">${project.name}</h3>
      <p class="project-description">${project.description}</p>
    </div>
    <div class="project-body">
      <div class="project-tags">
        ${tagsHTML}
        ${languageTag}
      </div>
      <div class="project-updated">
        Updated: ${project.updated}
      </div>
      <div class="project-footer">
        <a href="${project.url}" target="_blank" rel="noopener noreferrer" class="project-link">
          View Repository →
        </a>
      </div>
    </div>
  `;

  return card;
}

function renderProjects() {
  projectsGrid.innerHTML = '';
  let visibleCount = 0;

  allProjects.forEach(project => {
    const categoryMatch = currentFilter === 'all' || project.category === currentFilter;
    const searchMatch =
      searchQuery === '' ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (categoryMatch && searchMatch) {
      projectsGrid.appendChild(createProjectCard(project));
      visibleCount++;
    }
  });

  noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

// ===== Filter & Search Management =====
function setupEventListeners() {
  setupMobileMenu();

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentFilter = button.dataset.filter;
      renderProjects();
    });
  });
