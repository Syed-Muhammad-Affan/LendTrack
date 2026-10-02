import clsx from "clsx";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

// const maxWidth = "7xl";

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={clsx(
        `mx-auto max-w-6xl px-5 flex flex-col items-center gap-5`,
        className,
      )}
    >
      {children}
    </div>
  );
}
