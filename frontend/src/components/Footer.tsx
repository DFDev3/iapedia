import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-background rounded-sm"></div>
              </div>
              <span className="text-xl font-semibold">AI Repository</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your trusted gateway to cutting-edge artificial intelligence tools and technologies.
            </p>
          </div>

          {/* About */}
          <div className="space-y-4">
            <h3 className="font-semibold">About</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">Our Mission</a>
              <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">Contact Us</a>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2025 AI Repository. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}