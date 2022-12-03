import { ConnectButton } from "@rainbow-me/rainbowkit";
export default function Navbar() {
  return (
    <nav className="md:px-8 md:py-2 px-4 py-2 bg-white shadow-md">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl uppercase font-bold text-purple">Payzapp</h1>
        <ConnectButton />
      </div>
    </nav>
  );
}
