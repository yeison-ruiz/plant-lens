import PlantIdentifier from "../components/PlantIdentifier";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 background-image">
      <div className="absolute inset-0 bg-cover gradient-overlay"></div>

      <div className="relative z-10 w-full max-w-md">
        <PlantIdentifier />
      </div>
    </main>
  );
}
