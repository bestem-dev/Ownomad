import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

interface ProjectCardProps {
  title: string;
  description?: string;
  image: string;
  link: string;
  services: string;
}

const ProjectCard: FC<ProjectCardProps> = ({
  title,
  description,
  image,
  link,
  services,
}) => {
  return (
    <Link href={link}>
      <div className="flex h-80 flex-col items-center gap-4 rounded-3xl bg-neutral-800 pb-4 shadow-sm shadow-neutral-800 transition-transform duration-500 hover:scale-105">
        <div className="relative h-44 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="h-40 w-auto rounded-t-3xl object-cover"
          />
        </div>
        <div className="w-full px-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-xs text-neutral-400">{description}</p>
          <h4 className="mt-2 text-sm">{services}</h4>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
