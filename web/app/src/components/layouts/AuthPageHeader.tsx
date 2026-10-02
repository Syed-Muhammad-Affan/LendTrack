import { ThemeToggle } from "../themeToggle";
import { Container } from "@/customDiv/container";

export function AuthPageHeader() {
  return (
    <header className="">
      <Container className="flex-row  px-5 justify-between py-5">
        <div className="flex gap-5">
          <img src="/first-logo.svg" alt="LendTrack Logo" className="w-10" />
          <h3 className={`text-primary`}>LendTrack</h3>
        </div>
        <ThemeToggle />
      </Container>
    </header>
  );
}
