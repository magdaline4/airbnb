import React from "react";

const Footer = () => {
  return (
    <footer className="border-t bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
        
        <div>
          <h3 className="font-semibold mb-2">Support</h3>
          <ul className="space-y-1">
            <li>Help Centre</li>
            <li>AirCover</li>
            <li>Cancellation options</li>
            <li>Report neighbourhood concern</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Community</h3>
          <ul className="space-y-1">
            <li>Airbnb.org</li>
            <li>Combating discrimination</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Hosting</h3>
          <ul className="space-y-1">
            <li>Try hosting</li>
            <li>AirCover for Hosts</li>
            <li>Explore resources</li>
            <li>Visit community forum</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-2">About</h3>
          <ul className="space-y-1">
            <li>Newsroom</li>
            <li>Learn about new features</li>
            <li>Investors</li>
            <li>Careers</li>
          </ul>
        </div>
      </div>

      <div className="border-t py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Airbnb clone redesign · Built with React & Tailwind
      </div>
    </footer>
  );
};

export default Footer;
