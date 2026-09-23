declare module "iconsax-reactjs" {
  import * as React from "react";

  export interface IconProps {
    size?: string | number;
    color?: string;
    variant?: "Linear" | "Outline" | "TwoTone" | "Broken" | "Bold" | "Bulk";
    className?: string;
    style?: React.CSSProperties;
  }

  export const Add: React.FC<IconProps>;
  export const AddCircle: React.FC<IconProps>;
  export const ArrowLeft: React.FC<IconProps>;
  export const ArrowLeft2: React.FC<IconProps>;
  export const ArrowRight: React.FC<IconProps>;
  export const ArrowRight2: React.FC<IconProps>;
  export const ArrowDown: React.FC<IconProps>;
  export const ArrowUp: React.FC<IconProps>;
  export const CloseCircle: React.FC<IconProps>;
  export const Eye: React.FC<IconProps>;
  export const EyeSlash: React.FC<IconProps>;
  export const Home: React.FC<IconProps>;
  export const SearchNormal: React.FC<IconProps>;
  export const Setting: React.FC<IconProps>;
  export const Trash: React.FC<IconProps>;
  export const Edit: React.FC<IconProps>;
  export const User: React.FC<IconProps>;
  export const Lock: React.FC<IconProps>;
  export const Menu: React.FC<IconProps>;
  export const Notification: React.FC<IconProps>;
  export const Heart: React.FC<IconProps>;
  export const Star: React.FC<IconProps>;
  export const Send: React.FC<IconProps>;
  export const Document: React.FC<IconProps>;
  export const DocumentText: React.FC<IconProps>;
  export const Image: React.FC<IconProps>;
  export const Link: React.FC<IconProps>;
  export const Category: React.FC<IconProps>;

  // Catch-all for any other iconsax-reactjs icon
  const _default: { [key: string]: React.FC<IconProps> };
  export default _default;
}
