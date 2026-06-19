import { motion } from "framer-motion";
import { IoCalendar, IoTime, IoArrowForward } from "react-icons/io5";
import { blogPosts } from "../data/blog";
import { useInView } from "../hooks";

const Blog = () => {
  const [ref, isInView] = useInView({ threshold: 0.05 });

  return (
    <section id="blog" className="relative py-20">
      <div className="section-container" ref={ref}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="section-title gradient-text"
        >
          Latest Blog Posts
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 }}
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto"
        >
          Thoughts, tutorials, and insights about web development
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl overflow-hidden group"
            >
              <div className="h-44 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                <span className="text-5xl font-bold gradient-text opacity-30">{post.title[0]}</span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">{tag}</span>
                  ))}
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><IoCalendar size={12} /> {new Date(post.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><IoTime size={12} /> {post.readingTime} min</span>
                  </div>
                  <a href={`/blog/${post.id}`} className="text-primary hover:underline flex items-center gap-1">
                    Read <IoArrowForward size={12} />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
