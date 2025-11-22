"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Image, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6">
              <Sparkles className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 gradient-primary bg-clip-text text-transparent">
              Together with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Show the world what you created together with AI. Share your prompts, remix creations, and connect with fellow AI artists.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-card rounded-2xl border p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Image className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Share Your Creations</h3>
              <p className="text-sm text-muted-foreground">
                Upload and showcase your AI-generated images, videos, and audio creations
              </p>
            </div>

            <div className="bg-card rounded-2xl border p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Remix & Iterate</h3>
              <p className="text-sm text-muted-foreground">
                Take inspiration from others and create your own unique variations
              </p>
            </div>

            <div className="bg-card rounded-2xl border p-6 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Connect & Follow</h3>
              <p className="text-sm text-muted-foreground">
                Build a community of AI artists and discover amazing creations
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 p-8 bg-card rounded-2xl border border-primary/20">
            <h2 className="font-display font-bold text-2xl mb-4">Ready to start creating?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of AI artists sharing their creations
            </p>
            <Button asChild size="lg" className="gradient-primary">
              <Link href="/signup">Create Your Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
