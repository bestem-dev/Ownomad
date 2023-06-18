/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";

interface TeamMemberProfileProps {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  twitter: string;
  email: string;
}

const TeamMemberProfile: FC<TeamMemberProfileProps> = ({
  name,
  role,
  image,
  linkedin,
  twitter,
  email,
}) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <Image
        src={image}
        alt={name}
        width={250}
        height={250}
        sizes="(max-width: 640px) 150px, 250px"
        className="h-36 w-auto transition-transform hover:scale-105 lg:h-72"
      />
      <h3 className="text-center text-xl font-bold">{name}</h3>
      <h4 className="text-center">{role}</h4>
      <div className="flex items-center gap-4">
        <Link href={linkedin}>
          <Image
            width={20}
            height={20}
            src="/images/linkedin.svg"
            alt="linkedin"
            className="w-6 transition-transform hover:scale-105 hover:opacity-80"
          />
        </Link>
        <Link href={twitter}>
          <Image
            width={20}
            height={20}
            src="/images/twitter.svg"
            alt="twitter"
            className="w-6 transition-transform hover:scale-105 hover:opacity-80"
          />
        </Link>
        <Link href={email}>
          <Image
            width={20}
            height={20}
            src="/images/email.svg"
            alt="email"
            className="w-6 transition-transform hover:scale-105 hover:opacity-80"
          />
        </Link>
      </div>
    </div>
  );
};

export default TeamMemberProfile;
