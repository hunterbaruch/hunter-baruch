type PageHeroProps = {
  title: string;
  description: string;
};

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="bg-primary px-6 py-8 text-white md:py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-base text-white/80 md:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
}
