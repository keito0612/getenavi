import {
  IoHeartOutline,
  IoClose,
  IoChevronBack,
  IoSearch,
  IoMenu,
  IoLocationOutline,
} from "react-icons/io5";

type IconProps = {
  className?: string;
};

export function HeartIcon({ className = "w-5 h-5" }: IconProps) {
  return <IoHeartOutline className={className} />;
}

export function CloseIcon({ className = "w-5 h-5" }: IconProps) {
  return <IoClose className={className} />;
}

export function ChevronLeftIcon({ className = "w-5 h-5" }: IconProps) {
  return <IoChevronBack className={className} />;
}

export function SearchIcon({ className = "w-5 h-5" }: IconProps) {
  return <IoSearch className={className} />;
}

export function MenuIcon({ className = "w-5 h-5" }: IconProps) {
  return <IoMenu className={className} />;
}

export function LocationIcon({ className = "w-4 h-4" }: IconProps) {
  return <IoLocationOutline className={className} />;
}
