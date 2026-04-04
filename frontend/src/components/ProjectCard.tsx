import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface ProjectCardProps {
  image: string;
  tags: string[];
  title: string;
  description: string;
  authorAvatar: string;
}

const ProjectCard = ({
  image,
  tags,
  title,
  description,
  authorAvatar,
}: ProjectCardProps) => {
  return (
    <Card
      className={cn(
        "overflow-hidden border-none shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-[0_12px_30px_rgba(0,0,0,0.1)] flex flex-col h-full group"
      )}
    >
      <div className="w-full aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </div>

      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex gap-2 mb-4 flex-wrap">
          {tags.map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-[10px] font-bold uppercase tracking-wide bg-[#faf7f2] text-zinc-500 py-1 px-2.5 rounded-full border-gray-200"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="text-lg font-bold text-[#1a1a1a] mb-2 tracking-tight">
          {title}
        </h3>

        <p className="text-sm text-zinc-500 leading-relaxed mb-6 flex-grow">
          {description}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <img
            src={authorAvatar}
            alt="Author"
            className="w-8 h-8 rounded-full object-cover bg-gray-200"
          />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-zinc-300 transition-all duration-200 ease-in-out hover:text-[#E67A62] hover:bg-[#E67A62]/10 hover:scale-110"
            aria-label="Like project"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;