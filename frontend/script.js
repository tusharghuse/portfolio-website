/* ============================================================
   TUSHAR GHUSE — PORTFOLIO SCRIPT
   Handles: cursor, animations, nav, contact form, projects API
   ============================================================ */

/* ── CONFIG ───────────────────────────────────────────────── */
// During local development: 'http://localhost:5000'
// After deploying backend to Render, replace with your Render URL:
// e.g. 'https://tushar-portfolio-api.onrender.com'
const API_BASE = 'https://portfolio-website-n3j1.onrender.com/api/projects';

/* ============================================================
   1. CUSTOM CURSOR (preserved from original)
   ============================================================ */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
});

function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// Hide cursor when it leaves the window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity     = '0';
    cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursor.style.opacity     = '1';
    cursorRing.style.opacity = '1';
});

/* ============================================================
   2. NAVBAR — shrink on scroll + active link highlight
   ============================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    // Shrink navbar
    if (window.scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 220) {
            current = sec.id;
        }
    });

    navLinks.forEach(a => {
        a.classList.remove('active');
        const href = a.getAttribute('href');
        if (href === `#${current}`) {
            a.classList.add('active');
        }
    });
});

/* ============================================================
   3. HAMBURGER MENU (mobile)
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// Close menu when clicking outside
document.addEventListener('click', e => {
    if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
    ) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
    }
});

/* ============================================================
   4. SCROLL REVEAL (preserved + improved)
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            // Stagger delay based on sibling index
            const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${idx * 0.08}s`;
            entry.target.classList.add('visible');
            // Stop observing once visible
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ============================================================
   5. SKILL BAR ANIMATION (preserved from original)
   ============================================================ */
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.skill-level-fill').forEach((fill, i) => {
                setTimeout(() => {
                    fill.style.transform = 'scaleX(1)';
                }, i * 120);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.skills-grid').forEach(el => skillObserver.observe(el));

/* ============================================================
   6. DYNAMIC PROJECTS — load from backend MongoDB
   ============================================================ */
const projectsGrid  = document.getElementById('projectsGrid');
const projectsError = document.getElementById('projectsError');

// Fallback projects shown if backend is unreachable
const FALLBACK_PROJECTS = [
    {
        _id: 'fallback1',
        title: 'AI Code Editor',
        description: 'An AI-powered code editor that assists developers with smart suggestions and real-time code improvements. Designed with a clean, focused interface for a smooth coding experience.',
        techStack: ['JavaScript', 'AI/ML', 'Vercel'],
        liveUrl: 'https://ai-code-editor-amber.vercel.app/',
        githubUrl: 'https://github.com/tusharghuse',
        featured: true,
        tag: 'Featured'
    },
    {
        _id: 'fallback2',
        title: 'Personal Portfolio',
        description: 'A responsive portfolio site to showcase projects, skills, and ways to get in touch. Built from scratch with attention to UI and performance.',
        techStack: ['HTML', 'CSS', 'JavaScript'],
        liveUrl: '#',
        githubUrl: '#',
        featured: false,
        tag: 'Portfolio'
    }
];

/**
 * Build the HTML for a single project card
 */
function buildProjectCard(project, isFeatured) {
    const techHTML = (project.techStack || [])
        .map(t => `<span class="tech-tag">${escapeHTML(t)}</span>`)
        .join('');

    const linksHTML = `
        <div class="project-links-row">
            ${project.liveUrl && project.liveUrl !== '#'
                ? `<a href="${escapeHTML(project.liveUrl)}" target="_blank" rel="noopener" class="project-link">
                       View Live
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                   </a>`
                : ''}
            ${project.githubUrl && project.githubUrl !== '#'
                ? `<a href="${escapeHTML(project.githubUrl)}" target="_blank" rel="noopener" class="project-link" style="color:var(--muted)">
                       GitHub
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                   </a>`
                : ''}
        </div>
    `;

    if (isFeatured) {
        return `
        <div class="project-card featured reveal">
            <div>
                <div class="project-tag">${escapeHTML(project.tag || 'Featured')}</div>
                <h3 class="project-title">${escapeHTML(project.title)}</h3>
                <p class="project-desc">${escapeHTML(project.description)}</p>
                <div class="project-tech">${techHTML}</div>
                ${linksHTML}
            </div>
            <div class="project-visual">
                <div class="code-preview">
                    <div><span class="kw">const</span> project = {</div>
                    <div>&nbsp;&nbsp;name: <span class="str">"${escapeHTML(project.title)}"</span>,</div>
                    <div>&nbsp;&nbsp;stack: <span class="str">[${(project.techStack || []).map(t => `"${t}"`).join(', ')}]</span>,</div>
                    <div>&nbsp;&nbsp;status: <span class="str">"live"</span></div>
                    <div>};</div>
                    <br>
                    <div><span class="fn">deploy</span>(project).<span class="kw">then</span>(() => {</div>
                    <div>&nbsp;&nbsp;<span class="fn">console</span>.log(<span class="str">"🚀 shipped!"</span>);</div>
                    <div>});</div>
                </div>
            </div>
        </div>`;
    }

    return `
    <div class="project-card reveal">
        <div class="project-tag">${escapeHTML(project.tag || 'Project')}</div>
        <h3 class="project-title">${escapeHTML(project.title)}</h3>
        <p class="project-desc">${escapeHTML(project.description)}</p>
        <div class="project-tech">${techHTML}</div>
        ${linksHTML}
    </div>`;
}

/**
 * Render projects array into the grid
 */
function renderProjects(projects) {
    if (!projects || projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="projects-error" style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--muted)">
                No projects yet. Add them via the Admin Dashboard.
            </div>`;
        return;
    }

    let html = '';
    let featuredDone = false;

    projects.forEach(project => {
        if (project.featured && !featuredDone) {
            html += buildProjectCard(project, true);
            featuredDone = true;
        } else {
            html += buildProjectCard(project, false);
        }
    });

    projectsGrid.innerHTML = html;

    // Re-observe new reveal elements
    projectsGrid.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

/**
 * Fetch projects from the backend API
 */
async function loadProjects() {
    // Reset state
    projectsError.style.display = 'none';
    projectsGrid.innerHTML = `
        <div class="project-skeleton featured"></div>
        <div class="project-skeleton"></div>
        <div class="project-skeleton"></div>`;

    try {
        const controller = new AbortController();
        const timeout    = setTimeout(() => controller.abort(), 8000); // 8s timeout

        const res = await fetch(`${API_BASE}/api/projects`, {
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);

        const data = await res.json();
        renderProjects(data);

    } catch (err) {
        console.warn('Could not reach backend, using fallback projects.', err.message);
        // Use fallback so portfolio always looks good even without backend
        renderProjects(FALLBACK_PROJECTS);
    }
}

// Load projects on page load
loadProjects();

/* ============================================================
   7. CONTACT FORM
   ============================================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                alert('Message sent successfully!');
                contactForm.reset();
            } else {
                alert(data.error || 'Failed to send message.');
            }

        } catch (error) {
            console.error(error);
            alert('Server connection failed.');
        }
    });
}

/* ============================================================
   8. UTILITY — HTML escape to prevent XSS
   ============================================================ */
function escapeHTML(str) {
    if (typeof str !== 'string') return String(str || '');
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/* ============================================================
   9. SMOOTH SCROLL for nav links (fallback for older browsers)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
