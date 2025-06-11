import {
  Globe,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
} from "lucide-react";

import { Input } from "@/components/ui/input";

type SnsServiceType = {
  name: "Globe" | "Twitter" | "Instagram" | "Facebook" | "Linkedin" | "Youtube";
  inputName: string;
  placeholder: string;
};

export const globe: SnsServiceType = {
  name: "Globe",
  inputName: "websiteUrl",
  placeholder: "https://example.com",
};

export const twitter: SnsServiceType = {
  name: "Twitter",
  inputName: "twitterUrl",
  placeholder: "https://twitter.com/username",
};

export const instagram: SnsServiceType = {
  name: "Instagram",
  inputName: "instagramUrl",
  placeholder: "https://instagram.com/username",
};

export const facebook: SnsServiceType = {
  name: "Facebook",
  inputName: "facebookUrl",
  placeholder: "https://facebook.com/username",
};

export const linkedin: SnsServiceType = {
  name: "Linkedin",
  inputName: "linkedinUrl",
  placeholder: "https://linkedin.com/in/username",
};

export const youtube: SnsServiceType = {
  name: "Youtube",
  inputName: "youtubeUrl",
  placeholder: "https://youtube.com/c/channelname",
};

const iconClassName = "text-amber-700 min-w-[24px]";
const iconSize = 24;

type SnsProps = {
  snsService: SnsServiceType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

export const Sns = ({ snsService, handleChange, value = "" }: SnsProps) => {
  return (
    <div className="flex items-center gap-3">
      {snsService.name === "Globe" ? (
        <Globe size={iconSize} className={iconClassName} />
      ) : snsService.name === "Twitter" ? (
        <Twitter size={iconSize} className={iconClassName} />
      ) : snsService.name === "Instagram" ? (
        <Instagram size={iconSize} className={iconClassName} />
      ) : snsService.name === "Facebook" ? (
        <Facebook size={iconSize} className={iconClassName} />
      ) : snsService.name === "Linkedin" ? (
        <Linkedin size={iconSize} className={iconClassName} />
      ) : snsService.name === "Youtube" ? (
        <Youtube size={iconSize} className={iconClassName} />
      ) : null}
      <Input
        type="url"
        name={snsService.inputName}
        value={value}
        onChange={handleChange}
        placeholder={snsService.placeholder}
      />
    </div>
  );
};
