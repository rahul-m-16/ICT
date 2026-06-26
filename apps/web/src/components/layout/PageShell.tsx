import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Sidebar />
      <div className="pt-14 md:pl-52">
        <div className="p-5 max-w-5xl mx-auto animate-fade-in">{children}</div>
      </div>
    </div>
  );
}
