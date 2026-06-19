import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-8xl mb-6"
        >
          404
        </motion.div>
        <h1 className="text-3xl font-bold gradient-text mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-all"
        >
          <IoHome /> Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
