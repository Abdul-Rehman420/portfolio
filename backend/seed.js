// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Service = require('./models/Service');
const Testimonial = require('./models/Testimonial');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Certification = require('./models/Certification');
const SocialLink = require('./models/SocialLink');
const Settings = require('./models/Settings');
const Category = require('./models/Category');

// Retry connection function with exponential backoff
const connectWithRetry = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4,
        maxPoolSize: 10,
        minPoolSize: 1,
        retryWrites: true,
        retryReads: true,
      });
      console.log('Connected to MongoDB');
      return true;
    } catch (error) {
      console.log(`Connection attempt ${i + 1}/${retries} failed: ${error.message}`);
      if (i < retries - 1) {
        console.log(`Retrying in ${delay/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      } else {
        console.error('All connection attempts failed');
        throw error;
      }
    }
  }
};

// Helper to handle model operations with retry
const withRetry = async (fn, retries = 3, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < retries - 1) {
        console.log(`Operation failed, retrying in ${delay/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 1.5;
      } else {
        throw error;
      }
    }
  }
};

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'category';
};

const seed = async () => {
  try {
    // Connect with retry
    await connectWithRetry();
    
    // Clear existing data with retry
    await withRetry(async () => {
      await Promise.all([
        Admin.deleteMany({}),
        Project.deleteMany({}),
        Skill.deleteMany({}),
        Service.deleteMany({}),
        Testimonial.deleteMany({}),
        Experience.deleteMany({}),
        Education.deleteMany({}),
        Certification.deleteMany({}),
        SocialLink.deleteMany({}),
        Settings.deleteMany({}),
        Category.deleteMany({}),
      ]);
    });
    console.log('Cleared existing data');

    // Admin
    const admin = await withRetry(async () => {
      return await Admin.create({
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@123',
        name: 'Admin',
      });
    });
    console.log(`Admin created: ${admin.email}`);

    // Categories - Create default categories with proper slug handling
    console.log('Creating categories...');
    await withRetry(async () => {
      const categoryData = [
        { name: 'Full Stack', description: 'End-to-end web applications with frontend, backend, and database', order: 0 },
        { name: 'Frontend', description: 'User interface and experience focused applications', order: 1 },
        { name: 'Backend', description: 'Server-side applications, APIs, and microservices', order: 2 },
        { name: 'Mobile', description: 'Mobile applications for iOS and Android', order: 3 },
        { name: 'AI/ML', description: 'Artificial Intelligence and Machine Learning projects', order: 4 },
        { name: 'DevOps', description: 'Development operations, CI/CD, and infrastructure', order: 5 },
        { name: 'Game Development', description: 'Game development projects using various engines', order: 6 },
        { name: 'Blockchain', description: 'Blockchain and cryptocurrency applications', order: 7 },
      ];
      
      for (const catData of categoryData) {
        try {
          // Check if category exists (case insensitive)
          const existing = await Category.findOne({ 
            name: { $regex: new RegExp(`^${catData.name}$`, 'i') } 
          });
          
          if (existing) {
            console.log(`  ⚠ Category already exists: ${catData.name}`);
            continue;
          }
          
          // Generate slug
          const slug = generateSlug(catData.name);
          
          // Create category with explicit slug
          const category = new Category({
            name: catData.name,
            slug: slug,
            description: catData.description || '',
            order: catData.order || 0,
            isHidden: false,
          });
          
          // Validate and save
          await category.validate();
          await category.save();
          console.log(`  ✓ Created category: ${catData.name} (slug: ${slug})`);
        } catch (error) {
          console.error(`  ✗ Failed to create category "${catData.name}":`, error.message);
          if (error.errors) {
            console.error('  Validation errors:', Object.keys(error.errors).map(key => 
              `${key}: ${error.errors[key].message}`
            ).join(', '));
          }
        }
      }
    });
    console.log('Categories seeded ✓');

    // Projects
    console.log('Creating projects...');
    await withRetry(async () => {
      await Project.create([
        {
          title: 'E-Commerce Platform',
          description: 'A full-featured e-commerce platform with product management, cart, payment integration, and admin dashboard.',
          longDescription: 'This comprehensive e-commerce solution includes user authentication, product catalog, shopping cart, order management, payment processing with Stripe, and a complete admin dashboard for managing inventory and orders.',
          technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
          category: 'Full Stack',
          featured: true,
          status: 'Live',
          date: '2024',
          liveDemo: 'https://ecommerce-demo.vercel.app',
          github: 'https://github.com/abdulrehman/ecommerce',
          features: ['User Authentication', 'Product Management', 'Shopping Cart', 'Payment Integration', 'Admin Dashboard', 'Order Tracking'],
          role: 'Full Stack Developer',
        },
        {
          title: 'Social Media Dashboard',
          description: 'Real-time analytics dashboard for social media metrics with charts and data visualization.',
          longDescription: 'A powerful dashboard that aggregates data from multiple social media platforms, providing real-time analytics, engagement metrics, and beautiful data visualizations using D3.js.',
          technologies: ['React', 'TypeScript', 'D3.js', 'Node.js', 'PostgreSQL'],
          category: 'Frontend',
          featured: true,
          status: 'Live',
          date: '2023',
          liveDemo: 'https://dashboard-demo.vercel.app',
          github: 'https://github.com/abdulrehman/dashboard',
          features: ['Real-time Analytics', 'Data Visualization', 'Multi-platform Support', 'Custom Reports', 'Export Functionality'],
          role: 'Frontend Developer',
        },
        {
          title: 'Task Management App',
          description: 'Kanban-style project management tool with drag-and-drop and team collaboration.',
          longDescription: 'A collaborative task management application with Kanban boards, team workspaces, real-time updates using Socket.io, and powerful search and filtering capabilities.',
          technologies: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
          category: 'Full Stack',
          featured: true,
          status: 'Live',
          date: '2023',
          liveDemo: 'https://taskmanager-demo.vercel.app',
          github: 'https://github.com/abdulrehman/taskmanager',
          features: ['Kanban Boards', 'Drag & Drop', 'Real-time Updates', 'Team Collaboration', 'Task Comments', 'Search & Filter'],
          role: 'Full Stack Developer',
        },
        {
          title: 'AI Content Generator',
          description: 'AI-powered content generation tool using OpenAI API with rich text editor.',
          longDescription: 'Leveraging OpenAI\'s GPT models, this application generates high-quality content for blogs, social media, and marketing materials with an intuitive rich text editor.',
          technologies: ['Next.js', 'TypeScript', 'OpenAI', 'Prisma', 'PostgreSQL'],
          category: 'AI/ML',
          featured: false,
          status: 'Development',
          date: '2024',
          liveDemo: 'https://ai-content-demo.vercel.app',
          github: 'https://github.com/abdulrehman/ai-content',
          features: ['AI Content Generation', 'Rich Text Editor', 'Template Library', 'Export Options', 'History Tracking'],
          role: 'Lead Developer',
        },
        {
          title: 'Real-Time Chat Application',
          description: 'Messaging app with real-time communication, file sharing, and video calls.',
          longDescription: 'A complete messaging platform supporting real-time text chat, file sharing, video calls using WebRTC, and group conversations with persistent message history.',
          technologies: ['React', 'Socket.io', 'Node.js', 'Express', 'MongoDB', 'WebRTC'],
          category: 'Full Stack',
          featured: true,
          status: 'Live',
          date: '2023',
          liveDemo: 'https://chat-demo.vercel.app',
          github: 'https://github.com/abdulrehman/chat-app',
          features: ['Real-time Messaging', 'File Sharing', 'Video Calls', 'Group Chats', 'Message History', 'Online Status'],
          role: 'Full Stack Developer',
        },
        {
          title: 'Developer Portfolio Theme',
          description: 'Premium portfolio template with dark mode, animations, and CMS integration.',
          longDescription: 'A modern, responsive portfolio theme with dark mode support, smooth animations using Framer Motion, and seamless CMS integration for easy content management.',
          technologies: ['Next.js', 'MDX', 'Tailwind CSS', 'Framer Motion', 'Sanity CMS'],
          category: 'Frontend',
          featured: false,
          status: 'Live',
          date: '2024',
          liveDemo: 'https://portfolio-theme.vercel.app',
          github: 'https://github.com/abdulrehman/portfolio-theme',
          features: ['Dark Mode', 'Smooth Animations', 'CMS Integration', 'Blog Support', 'SEO Optimized', 'Responsive Design'],
          role: 'Frontend Developer',
        },
        {
          title: 'Mobile Fitness Tracker',
          description: 'Cross-platform fitness tracking app with workout plans and progress monitoring.',
          longDescription: 'A React Native application that helps users track their fitness journey with personalized workout plans, progress tracking, and integration with health APIs.',
          technologies: ['React Native', 'Expo', 'Node.js', 'MongoDB', 'Firebase'],
          category: 'Mobile',
          featured: false,
          status: 'Development',
          date: '2024',
          github: 'https://github.com/abdulrehman/fitness-tracker',
          features: ['Workout Plans', 'Progress Tracking', 'Health API Integration', 'Social Sharing', 'Push Notifications'],
          role: 'Mobile Developer',
        },
        {
          title: 'DevOps Pipeline Dashboard',
          description: 'Comprehensive CI/CD pipeline monitoring and management dashboard.',
          longDescription: 'A DevOps dashboard that provides real-time visibility into CI/CD pipelines, deployment status, error tracking, and performance metrics across multiple environments.',
          technologies: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Docker', 'Kubernetes'],
          category: 'DevOps',
          featured: false,
          status: 'Live',
          date: '2023',
          liveDemo: 'https://devops-dashboard-demo.vercel.app',
          github: 'https://github.com/abdulrehman/devops-dashboard',
          features: ['Pipeline Monitoring', 'Deployment Tracking', 'Error Logging', 'Performance Metrics', 'Alert System'],
          role: 'DevOps Engineer',
        },
      ]);
    });
    console.log('Projects seeded ✓');

    // Skills
    console.log('Creating skills...');
    await withRetry(async () => {
      const skillData = [
        { name: 'HTML5', level: 95, category: 'Frontend' },
        { name: 'CSS3', level: 92, category: 'Frontend' },
        { name: 'JavaScript', level: 90, category: 'Frontend' },
        { name: 'TypeScript', level: 85, category: 'Frontend' },
        { name: 'React.js', level: 95, category: 'Frontend' },
        { name: 'Next.js', level: 85, category: 'Frontend' },
        { name: 'Redux', level: 80, category: 'Frontend' },
        { name: 'Tailwind CSS', level: 92, category: 'Frontend' },
        { name: 'Bootstrap', level: 88, category: 'Frontend' },
        { name: 'Node.js', level: 88, category: 'Backend' },
        { name: 'Express.js', level: 90, category: 'Backend' },
        { name: 'REST API', level: 92, category: 'Backend' },
        { name: 'Authentication', level: 85, category: 'Backend' },
        { name: 'MongoDB', level: 88, category: 'Database' },
        { name: 'PostgreSQL', level: 75, category: 'Database' },
        { name: 'Firebase', level: 80, category: 'Database' },
        { name: 'Git', level: 92, category: 'Tools' },
        { name: 'GitHub', level: 90, category: 'Tools' },
        { name: 'VS Code', level: 95, category: 'Tools' },
        { name: 'Postman', level: 85, category: 'Tools' },
        { name: 'Figma', level: 78, category: 'Tools' },
        { name: 'Vercel', level: 88, category: 'Tools' },
        { name: 'Netlify', level: 85, category: 'Tools' },
        { name: 'Responsive Design', level: 95, category: 'Other' },
        { name: 'Performance Optimization', level: 85, category: 'Other' },
        { name: 'SEO', level: 80, category: 'Other' },
        { name: 'Testing', level: 75, category: 'Other' },
        { name: 'Docker', level: 70, category: 'DevOps' },
        { name: 'Kubernetes', level: 65, category: 'DevOps' },
        { name: 'AWS', level: 70, category: 'DevOps' },
      ];
      await Skill.insertMany(skillData.map((s, i) => ({ ...s, order: i })));
    });
    console.log('Skills seeded ✓');

    // Services
    console.log('Creating services...');
    await withRetry(async () => {
      await Service.create([
        {
          title: 'Frontend Development',
          description: 'Pixel-perfect, responsive, and accessible user interfaces using modern frameworks.',
          icon: 'IoCodeSlash',
          features: ['Responsive web design', 'Component architecture', 'State management', 'Performance optimization', 'Accessibility compliance'],
        },
        {
          title: 'Full Stack Development',
          description: 'End-to-end web application development from database to deployment.',
          icon: 'IoServer',
          features: ['MERN stack development', 'RESTful & GraphQL APIs', 'Authentication & authorization', 'Database design & optimization', 'Cloud deployment'],
        },
        {
          title: 'React Development',
          description: 'Specialized React.js and Next.js application development with best practices.',
          icon: 'IoLogoReact',
          features: ['Single page applications', 'Server-side rendering', 'Progressive web apps', 'Custom hooks & context', 'Third-party integrations'],
        },
        {
          title: 'Landing Page Design',
          description: 'High-converting landing pages with stunning design and fast loading.',
          icon: 'IoRocket',
          features: ['Conversion optimized', 'A/B testing ready', 'Analytics integration', 'SEO optimized', 'Fast loading (sub-2s)'],
        },
        {
          title: 'API Integration',
          description: 'Seamless integration of third-party APIs and services into your application.',
          icon: 'IoGitNetwork',
          features: ['REST & GraphQL APIs', 'Payment gateways', 'Social media APIs', 'Maps & geolocation', 'Custom API development'],
        },
        {
          title: 'Performance Optimization',
          description: 'Audit and optimize web applications for speed, SEO, and user experience.',
          icon: 'IoFlash',
          features: ['Lighthouse audits', 'Bundle size optimization', 'Image optimization', 'Caching strategies', 'Core Web Vitals'],
        },
        {
          title: 'Website Maintenance',
          description: 'Ongoing support, updates, and maintenance for your web applications.',
          icon: 'IoConstruct',
          features: ['Regular updates', 'Security patches', 'Backup & recovery', 'Performance monitoring', '24/7 support'],
        },
      ]);
    });
    console.log('Services seeded ✓');

    // Testimonials
    console.log('Creating testimonials...');
    await withRetry(async () => {
      await Testimonial.create([
        {
          name: 'Sarah Johnson',
          position: 'CEO',
          company: 'TechCorp Inc.',
          review: 'Working with Abdul was an absolute pleasure. He transformed our outdated website into a modern, fast, and beautiful application. Our user engagement increased by 60% within the first month.',
          rating: 5,
        },
        {
          name: 'Michael Chen',
          position: 'CTO',
          company: 'StartupHub',
          review: 'Abdul is one of the most talented developers I\'ve worked with. His attention to detail and understanding of modern web technologies is exceptional.',
          rating: 5,
        },
        {
          name: 'Emily Rodriguez',
          position: 'Project Manager',
          company: 'Digital Agency Co.',
          review: 'I\'ve worked with many developers, but Abdul stands out for his professionalism and technical skills. He consistently delivers high-quality work.',
          rating: 5,
        },
        {
          name: 'David Kim',
          position: 'Entrepreneur',
          company: 'Freelance Client',
          review: 'Abdul built my e-commerce website from scratch and did an amazing job. The site is fast, looks professional, and has helped me grow my business significantly.',
          rating: 5,
        },
      ]);
    });
    console.log('Testimonials seeded ✓');

    // Experience
    console.log('Creating experiences...');
    await withRetry(async () => {
      await Experience.create([
        {
          company: 'Tech Solutions Inc.',
          role: 'Senior Frontend Developer',
          duration: 'Jan 2023 - Present',
          location: 'Karachi, Pakistan',
          type: 'Full-Time',
          description: 'Leading frontend development for enterprise-scale applications with a focus on performance and user experience.',
          responsibilities: [
            'Led the development of 5+ major React applications serving 50K+ users',
            'Mentored a team of 3 junior developers in React and modern frontend practices',
            'Architected component libraries reducing development time by 40%',
            'Implemented CI/CD pipelines for frontend deployments',
          ],
          technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 'Docker'],
          achievements: ['Employee of the Month (March 2023)', 'Reduced bundle size by 35%', 'Improved Lighthouse score from 78 to 96'],
        },
        {
          company: 'Digital Agency Co.',
          role: 'Full Stack Developer',
          duration: 'Jun 2021 - Dec 2022',
          location: 'Remote',
          type: 'Full-Time',
          description: 'Built and maintained web applications for diverse clients across various industries.',
          responsibilities: [
            'Built 20+ responsive websites and web applications for diverse clients',
            'Developed RESTful APIs serving 10K+ daily requests',
            'Integrated payment gateways, authentication, and third-party services',
            'Managed cloud infrastructure on AWS and Vercel',
          ],
          technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Firebase', 'AWS'],
          achievements: ['Delivered all projects ahead of schedule', '97% client satisfaction rate', 'Zero critical bugs in production'],
        },
        {
          company: 'Freelance',
          role: 'Web Developer',
          duration: 'Jan 2020 - May 2021',
          location: 'Remote',
          type: 'Freelance',
          description: 'Provided web development services to clients worldwide.',
          responsibilities: [
            'Designed and developed custom websites for small businesses',
            'Created e-commerce solutions with payment integration',
            'Provided ongoing maintenance and support',
          ],
          technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'WordPress', 'Shopify'],
          achievements: ['Successfully delivered 30+ projects', '5-star rating on freelance platforms'],
        },
      ]);
    });
    console.log('Experience seeded ✓');

    // Education
    console.log('Creating education...');
    await withRetry(async () => {
      await Education.create([
        {
          degree: 'BS Computer Science',
          institution: 'University of Karachi',
          duration: '2018 - 2022',
          cgpa: '3.7 / 4.0',
          description: 'Focused on software engineering, data structures, algorithms, and web development. Graduated with honors.',
          certificates: ['Dean\'s List Honor', 'Best Capstone Project Award', 'Academic Excellence Scholarship'],
        },
        {
          degree: 'Web Development Certification',
          institution: 'FreeCodeCamp',
          duration: '2020',
          cgpa: 'N/A',
          description: 'Completed full-stack web development curriculum with projects in HTML, CSS, JavaScript, React, Node.js, and MongoDB.',
          certificates: ['Full Stack Web Development Certification'],
        },
      ]);
    });
    console.log('Education seeded ✓');

    // Certifications
    console.log('Creating certifications...');
    await withRetry(async () => {
      await Certification.create([
        { title: 'Meta Front-End Developer', issuer: 'Coursera', date: '2023', link: 'https://coursera.org/verify/xyz' },
        { title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2023', link: 'https://aws.amazon.com/verify/xyz' },
        { title: 'MongoDB Associate Developer', issuer: 'MongoDB University', date: '2022', link: 'https://mongodb.com/verify/xyz' },
        { title: 'JavaScript Algorithms & Data Structures', issuer: 'FreeCodeCamp', date: '2021', link: 'https://freecodecamp.org/verify/xyz' },
        { title: 'Responsive Web Design', issuer: 'FreeCodeCamp', date: '2020', link: 'https://freecodecamp.org/verify/xyz' },
      ]);
    });
    console.log('Certifications seeded ✓');

    // Social Links
    console.log('Creating social links...');
    await withRetry(async () => {
      await SocialLink.create([
        { platform: 'github', url: 'https://github.com/abdulrehman', icon: 'FaGithub' },
        { platform: 'linkedin', url: 'https://linkedin.com/in/abdulrehman', icon: 'FaLinkedin' },
        { platform: 'twitter', url: 'https://twitter.com/abdulrehman', icon: 'FaTwitter' },
        { platform: 'instagram', url: 'https://instagram.com/abdulrehman', icon: 'FaInstagram' },
        { platform: 'email', url: 'mailto:abdulrehman@example.com', icon: 'FaEnvelope' },
        { platform: 'youtube', url: 'https://youtube.com/@abdulrehman', icon: 'FaYoutube' },
      ]);
    });
    console.log('Social links seeded ✓');

    // Settings - Complete settings with all sections including visibility toggles
    console.log('Creating settings...');
    await withRetry(async () => {
      await Settings.create([
        // General Settings
        { key: 'siteName', value: 'Abdul Rehman' },
        { key: 'siteRole', value: 'Full Stack Web Developer' },
        { key: 'siteDescription', value: 'I build modern, scalable, high-performance web applications with React.js, Node.js, Express.js, and MongoDB while creating exceptional user experiences.' },
        { key: 'location', value: 'Karachi, Pakistan' },
        { key: 'email', value: 'abdulrehman@example.com' },
        { key: 'phone', value: '+92 300 1234567' },
        { key: 'resumeUrl', value: '/resume.pdf' },
        { key: 'typewriterRoles', value: 'MERN Stack Developer,Frontend Developer,React Developer,JavaScript Developer,UI Developer,Full Stack Developer' },
        { key: 'profileImage', value: '' },
        
        // Section Visibility Settings - ALL SECTIONS VISIBLE BY DEFAULT
        { key: 'showHero', value: 'true' },
        { key: 'showAbout', value: 'true' },
        { key: 'showSkills', value: 'true' },
        { key: 'showProjects', value: 'true' },
        { key: 'showExperience', value: 'true' },
        { key: 'showServices', value: 'true' },
        { key: 'showTestimonials', value: 'true' },
        { key: 'showContact', value: 'true' },
        
        // About Section Settings
        { key: 'aboutTitle', value: 'About Me' },
        { key: 'aboutDescription', value: 'I am a passionate Full Stack Web Developer with 3+ years of experience building modern, scalable web applications. I specialize in the MERN stack and have a deep understanding of frontend and backend technologies.' },
        { key: 'aboutDescription2', value: 'I specialize in building modern web applications using React.js, Node.js, Express.js, and MongoDB. I am passionate about writing clean, maintainable code and creating exceptional user experiences.' },
        { key: 'aboutLocation', value: 'Karachi, Pakistan' },
        { key: 'aboutExperience', value: 'Senior Level' },
        { key: 'aboutLanguages', value: 'English, Urdu' },
        { key: 'aboutAvailability', value: 'Available for Full-Time' },
        { key: 'aboutFreelance', value: 'Available' },
        { key: 'careerObjective', value: 'To leverage my technical expertise in full-stack development to build innovative web solutions that drive business growth, while continuously learning and contributing to open-source communities.' },
        
        // Journey Items
        { key: 'journeyItems', value: JSON.stringify([
          { year: '2018', title: 'Started University', description: 'Began BS in Computer Science' },
          { year: '2019', title: 'First Lines of Code', description: 'Wrote my first HTML and CSS' },
          { year: '2020', title: 'First Freelance Project', description: 'Built my first professional website' },
          { year: '2021', title: 'First Developer Job', description: 'Started as Junior Developer' },
          { year: '2022', title: 'Full Stack Developer', description: 'Leveled up to Full Stack role' },
          { year: '2023', title: 'Senior Frontend Developer', description: 'Promoted to Senior role' },
          { year: '2024', title: 'Tech Lead & Speaker', description: 'Leading projects and speaking at conferences' }
        ]) },

        // Footer Settings
        { key: 'footerTagline', value: 'Full Stack Web Developer specializing in modern web technologies.' },
        { key: 'footerCopyright', value: 'All rights reserved.' },
        { key: 'footerQuickLinks', value: JSON.stringify([
          { label: 'Home', href: '#home' },
          { label: 'About', href: '#about' },
          { label: 'Skills', href: '#skills' },
          { label: 'Projects', href: '#projects' },
          { label: 'Experience', href: '#experience' },
          { label: 'Services', href: '#services' },
          { label: 'Testimonials', href: '#testimonials' },
          { label: 'Contact', href: '#contact' }
        ]) },
        { key: 'footerSocialLinks', value: JSON.stringify([
          { platform: 'github', url: 'https://github.com/abdulrehman', icon: 'FaGithub' },
          { platform: 'linkedin', url: 'https://linkedin.com/in/abdulrehman', icon: 'FaLinkedin' },
          { platform: 'twitter', url: 'https://twitter.com/abdulrehman', icon: 'FaTwitter' },
          { platform: 'instagram', url: 'https://instagram.com/abdulrehman', icon: 'FaInstagram' },
          { platform: 'email', url: 'mailto:abdulrehman@example.com', icon: 'FaEnvelope' }
        ]) },
        { key: 'footerShowSocialLinks', value: 'true' },
        { key: 'footerShowQuickLinks', value: 'true' },
        { key: 'footerShowTagline', value: 'true' },
        { key: 'footerShowCopyright', value: 'true' },
        { key: 'footerShowBackToTop', value: 'true' },
      ]);
    });
    console.log('Settings seeded ✓');

    console.log('\n' + '='.repeat(60));
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('\n🔑 Admin Credentials:');
    console.log(`  Email: ${process.env.ADMIN_EMAIL || 'admin@example.com'}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);
    
    console.log('\n📂 Categories Created:');
    console.log('  • Full Stack');
    console.log('  • Frontend');
    console.log('  • Backend');
    console.log('  • Mobile');
    console.log('  • AI/ML');
    console.log('  • DevOps');
    console.log('  • Game Development');
    console.log('  • Blockchain');
    
    console.log('\n📊 Summary:');
    console.log(`  • ${8} Categories`);
    console.log(`  • ${8} Projects`);
    console.log(`  • ${30} Skills`);
    console.log(`  • ${7} Services`);
    console.log(`  • ${4} Testimonials`);
    console.log(`  • ${3} Experiences`);
    console.log(`  • ${2} Education entries`);
    console.log(`  • ${5} Certifications`);
    console.log(`  • ${6} Social Links`);
    console.log(`  • ${36} Settings`);
    
    console.log('\n📝 Next Steps:');
    console.log('  1. Start the backend server: npm run dev');
    console.log('  2. Start the frontend server: npm run dev (in frontend folder)');
    console.log('  3. Login to admin: http://localhost:3000/admin/login');
    console.log('  4. Manage categories: http://localhost:3000/admin/categories');
    console.log('  5. View portfolio: http://localhost:3000');
    
    console.log('\n' + '='.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seed error:', error);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
};

seed();