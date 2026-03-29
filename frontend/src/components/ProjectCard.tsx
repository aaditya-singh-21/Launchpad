import React from 'react';
import './ProjectCard.css';

interface ProjectCardProps {
  image: string;
  tags: string[];
  title: string;
  description: string;
  authorAvatar: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  image, 
  tags, 
  title, 
  description, 
  authorAvatar 
}) => {
  return (
    <div className="project-card">
      <div className="card-image-container">
        <img src={image} alt={title} className="card-image" />
      </div>
      <div className="card-content">
        <div className="card-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-footer">
          <img src={authorAvatar} alt="Author" className="author-avatar" />
          <button className="like-btn" aria-label="Like project">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className="heart-icon"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
