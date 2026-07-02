type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({ eyebrow, title, description, align = "left" }: SectionHeaderProps) {
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-3 font-serif text-3xl leading-tight text-ink md:text-5xl">{title}</h2>
      {description ? <p className="mt-5 text-base leading-8 text-ink/70 md:text-lg">{description}</p> : null}
    </div>
  );
}
