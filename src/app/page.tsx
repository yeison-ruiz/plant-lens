import PlantIdentifier from "../components/PlantIdentifier";

export default function Home() {
  return (
    <div className="background-image">
      <div className="gradient-overlay"></div>
      <main className="content-container flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <PlantIdentifier />
        </div>
      </main>
    </div>
  );
}
