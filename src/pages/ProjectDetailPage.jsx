import { useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { IoGlobe, IoLogoGithub, IoArrowBack, IoCheckmarkCircle } from "react-icons/io5";
import { projects } from "../data/projects";

const ProjectDetailPage = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <Link to="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/#projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary mb-8 transition-colors">
          <IoArrowBack /> Back to Projects
        </Link>

        <div className="h-64 md:h-96 rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center mb-8">
          <span className="text-8xl font-bold gradient-text opacity-30">{project.title[0]}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">{project.title}</h1>
            <p className="text-gray-400 mb-6 leading-relaxed">{project.longDescription}</p>

            <h2 className="text-xl font-semibold mb-3">Problem</h2>
            <p className="text-gray-400 mb-6">{project.problem}</p>

            <h2 className="text-xl font-semibold mb-3">Solution</h2>
            <p className="text-gray-400 mb-6">{project.solution}</p>

            <h2 className="text-xl font-semibold mb-3">Architecture</h2>
            <p className="text-gray-400 mb-6">{project.architecture}</p>

            <h2 className="text-xl font-semibold mb-3">Challenges</h2>
            <p className="text-gray-400 mb-6">{project.challenges}</p>

            <h2 className="text-xl font-semibold mb-3">Features</h2>
            <ul className="grid grid-cols-2 gap-3 mb-6">
              {project.features.map((f) => (
                <li key={f} className="text-sm text-gray-400 flex items-center gap-2">
                  <IoCheckmarkCircle className="text-primary flex-shrink-0" size={16} /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="glass p-6 rounded-2xl space-y-4 sticky top-24">
              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <span className={`text-sm font-medium ${project.status === "Live" ? "text-green-400" : "text-yellow-400"}`}>{project.status}</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <p className="text-sm">{project.date}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Role</p>
                <p className="text-sm">{project.role}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((t) => (
                    <span key={t} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">{t}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Performance</p>
                <p className="text-sm">{project.performance}</p>
              </div>
              <div className="flex gap-3 pt-2">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-sm hover:bg-primary/90 transition-all"
                >
                  <IoGlobe /> Live
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 glass rounded-full text-sm hover:text-primary transition-all"
                >
                  <IoLogoGithub /> Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetailPage;
