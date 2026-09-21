interface SvgIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const SvgIcon = ({ name, size = 24, className }: SvgIconProps) => {
  return (
    <svg className={className ? className : ""} width={size} height={size}>
      <use href={`/icons/sprite.svg#sprite-${name}`} />
    </svg>
  );
};
