type PageHeroProps = {
  title: string;
  description: string;
};

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="bg-primary px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-white/80">{description}</p>
      </div>
    </section>
  );
}
