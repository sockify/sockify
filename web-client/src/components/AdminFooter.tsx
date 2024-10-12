import { PROJECT_GITHUB_URL } from "@/shared/constants";
import { Github } from "lucide-react";

export default function AdminFooter() {
  return (
    <footer className="bg-primary text-gray-200">
      <section className="mx-auto px-4 py-12 2xl:container md:px-8">
        <h2 className="mb-2 inline-flex items-center gap-2">
          <span className="text-2xl font-bold text-white">Sockify</span>
          <span className="text-xs text-gray-200">[Admin]</span>
        </h2>
        <p className="mb-5 text-sm">
          Bringing comfort to your feet, one pair at a time.
        </p>

        <a
          href={PROJECT_GITHUB_URL}
          target="_blank"
          className="hover:text-white"
          rel="noopener noreferrer"
        >
          <Github size={25} />
          <span className="sr-only">GitHub</span>
        </a>
      </section>
    </footer>
  );
}
