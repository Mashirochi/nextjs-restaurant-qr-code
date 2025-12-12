import { cn } from "@/lib/utils";
import { ComponentProps, forwardRef } from "react";
import { IconType } from "react-icons";
import { FaGoogle } from "react-icons/fa";
import { MdOutlineRestaurant } from "react-icons/md";

export type IconProps = ComponentProps<"svg"> & {
  icon: IconType;
};

const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ className, icon: IconComponent, ...props }, ref) => (
    <IconComponent className={cn("h-4 w-4", className)} {...props} />
  )
);
Icon.displayName = "Icon";

export const Icons = {
  google: (props: ComponentProps<"svg">) => <Icon icon={FaGoogle} {...props} />,
  logo: (props: ComponentProps<"svg">) => (
    <Icon icon={MdOutlineRestaurant} {...props} />
  ),
};
