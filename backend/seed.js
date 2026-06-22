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

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
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
    ]);
    console.log('Cleared existing data');

    // Admin
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      name: 'Admin',
    });
    console.log(`Admin created: ${admin.email}`);

    // Projects
    await Project.create([
      {
        title: 'E-Commerce Platform',
        description: 'A full-featured e-commerce platform with product management, cart, payment integration, and admin dashboard.',
        technologies: ['React', 'Next.js', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'],
        category: 'Full Stack',
        featured: true,
        status: 'Live',
        date: '2024',
        liveDemo: 'https://ecommerce-demo.vercel.app',
        github: 'https://github.com/abdulrehman/ecommerce',
      },
      {
        title: 'Social Media Dashboard',
        description: 'Real-time analytics dashboard for social media metrics with charts and data visualization.',
        technologies: ['React', 'TypeScript', 'D3.js', 'Node.js', 'PostgreSQL'],
        category: 'Frontend',
        featured: true,
        status: 'Live',
        date: '2023',
        liveDemo: 'https://dashboard-demo.vercel.app',
        github: 'https://github.com/abdulrehman/dashboard',
      },
      {
        title: 'Task Management App',
        description: 'Kanban-style project management tool with drag-and-drop and team collaboration.',
        technologies: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
        category: 'Full Stack',
        featured: true,
        status: 'Live',
        date: '2023',
        liveDemo: 'https://taskmanager-demo.vercel.app',
        github: 'https://github.com/abdulrehman/taskmanager',
      },
      {
        title: 'AI Content Generator',
        description: 'AI-powered content generation tool using OpenAI API with rich text editor.',
        technologies: ['Next.js', 'TypeScript', 'OpenAI', 'Prisma', 'PostgreSQL'],
        category: 'Full Stack',
        featured: false,
        status: 'Development',
        date: '2024',
        liveDemo: 'https://ai-content-demo.vercel.app',
        github: 'https://github.com/abdulrehman/ai-content',
      },
      {
        title: 'Real-Time Chat Application',
        description: 'Messaging app with real-time communication, file sharing, and video calls.',
        technologies: ['React', 'Socket.io', 'Node.js', 'Express', 'MongoDB', 'WebRTC'],
        category: 'Full Stack',
        featured: true,
        status: 'Live',
        date: '2023',
        liveDemo: 'https://chat-demo.vercel.app',
        github: 'https://github.com/abdulrehman/chat-app',
      },
      {
        title: 'Developer Portfolio Theme',
        description: 'Premium portfolio template with dark mode, animations, and CMS integration.',
        technologies: ['Next.js', 'MDX', 'Tailwind CSS', 'Framer Motion', 'Sanity CMS'],
        category: 'Frontend',
        featured: false,
        status: 'Live',
        date: '2024',
        liveDemo: 'https://portfolio-theme.vercel.app',
        github: 'https://github.com/abdulrehman/portfolio-theme',
      },
    ]);
    console.log('Projects seeded');

    // Skills
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
    ];
    await Skill.insertMany(skillData.map((s, i) => ({ ...s, order: i })));
    console.log('Skills seeded');

    // Services
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
    console.log('Services seeded');

    // Testimonials
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
    console.log('Testimonials seeded');

    // Experience
    await Experience.create([
      {
        company: 'Tech Solutions Inc.',
        role: 'Senior Frontend Developer',
        duration: 'Jan 2023 - Present',
        location: 'Karachi, Pakistan',
        type: 'Full-Time',
        responsibilities: [
          'Led the development of 5+ major React applications serving 50K+ users',
          'Mentored a team of 3 junior developers in React and modern frontend practices',
          'Architected component libraries reducing development time by 40%',
        ],
        technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB'],
        achievements: ['Employee of the Month (March 2023)', 'Reduced bundle size by 35%'],
      },
      {
        company: 'Digital Agency Co.',
        role: 'Full Stack Developer',
        duration: 'Jun 2021 - Dec 2022',
        location: 'Remote',
        type: 'Full-Time',
        responsibilities: [
          'Built 20+ responsive websites and web applications for diverse clients',
          'Developed RESTful APIs serving 10K+ daily requests',
          'Integrated payment gateways, authentication, and third-party services',
        ],
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Firebase'],
        achievements: ['Delivered all projects ahead of schedule', '97% client satisfaction rate'],
      },
    ]);
    console.log('Experience seeded');

    // Education
    await Education.create({
      degree: 'BS Computer Science',
      institution: 'University of Karachi',
      duration: '2018 - 2022',
      cgpa: '3.7 / 4.0',
      description: 'Focused on software engineering, data structures, algorithms, and web development.',
      certificates: ['Dean\'s List Honor', 'Best Capstone Project Award'],
    });
    console.log('Education seeded');

    // Certifications
    await Certification.create([
      { title: 'Meta Front-End Developer', issuer: 'Coursera', date: '2023', link: 'https://coursera.org/verify/xyz' },
      { title: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', date: '2023', link: 'https://aws.amazon.com/verify/xyz' },
      { title: 'MongoDB Associate Developer', issuer: 'MongoDB University', date: '2022', link: 'https://mongodb.com/verify/xyz' },
    ]);
    console.log('Certifications seeded');

    // Social Links
    await SocialLink.create([
      { platform: 'github', url: 'https://github.com/abdulrehman', icon: 'FaGithub' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/abdulrehman', icon: 'FaLinkedin' },
      { platform: 'twitter', url: 'https://twitter.com/abdulrehman', icon: 'FaTwitter' },
      { platform: 'email', url: 'mailto:abdulrehman@example.com', icon: 'FaEnvelope' },
    ]);
    console.log('Social links seeded');

    // Settings - Complete settings with all sections
    await Settings.create([
      // General Settings
      { key: 'siteName', value: 'Abdul Rehman' },
      { key: 'siteRole', value: 'Full Stack Web Developer' },
      { key: 'siteDescription', value: 'I build modern, scalable, high-performance web applications with React.js, Node.js, Express.js, and MongoDB while creating exceptional user experiences.' },
      { key: 'location', value: 'Karachi, Pakistan' },
      { key: 'email', value: 'abdulrehman@example.com' },
      { key: 'phone', value: '+92 300 1234567' },
      { key: 'resumeUrl', value: '/resume.pdf' },
      { key: 'typewriterRoles', value: 'MERN Stack Developer,Frontend Developer,React Developer,JavaScript Developer,UI Developer' },
      { key: 'profileImage', value: '' },
      
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
      
      // Journey Items (stored as JSON string)
      { key: 'journeyItems', value: JSON.stringify([
        { year: '2018', title: 'Started University', description: 'Began BS in Computer Science' },
        { year: '2020', title: 'First Freelance Project', description: 'Built my first professional website' },
        { year: '2021', title: 'First Developer Job', description: 'Started as Junior Developer' },
        { year: '2022', title: 'Full Stack Developer', description: 'Leveled up to Full Stack role' },
        { year: '2023', title: 'Senior Frontend Developer', description: 'Promoted to Senior role' },
        { year: '2024', title: 'Tech Lead & Speaker', description: 'Leading projects and speaking at conferences' }
      ]) },
    ]);
    console.log('Settings seeded');

    console.log('\n✓ Database seeded successfully!');
    console.log('  Admin Email:', process.env.ADMIN_EMAIL || 'admin@example.com');
    console.log('  Admin Password:', process.env.ADMIN_PASSWORD || 'Admin@123');
    console.log('\n  To add your profile image:');
    console.log('  1. Go to http://localhost:3000/admin/settings');
    console.log('  2. Upload your profile photo');
    console.log('  3. Click Save Settings');
    console.log('\n  To customize the About section:');
    console.log('  1. Go to http://localhost:3000/admin/settings');
    console.log('  2. Click on the "About Section" tab');
    console.log('  3. Update any field and click Save Settings');
    console.log('  4. Changes reflect instantly on the live site');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();