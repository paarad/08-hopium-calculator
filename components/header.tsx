export default function Header() {
  return (
    <header className="w-full flex flex-col items-center text-center gap-2">
      <h1 className="text-3xl sm:text-4xl font-bold">
        Hopium Calculator 💨
      </h1>
      <p className="text-muted-foreground max-w-xl">
        A meme webapp that converts unrealized losses into a ridiculous daily Hopium/Copium dose.
      </p>
    </header>
  );
} 