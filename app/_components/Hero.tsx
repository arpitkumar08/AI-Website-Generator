"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { ArrowUp, HomeIcon, ImagePlus, Key, LayoutDashboard, Loader, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const suggestions = [
  {
    label: "Dashboard",
    prompt: "Create an analytics dashboard to track customers and revenue data for a SaaS.",
    icon: LayoutDashboard,
  },
  {
    label: "Signup Form",
    prompt: "Create a modern sign-up form with email/password fields, Google and GitHub login options, and a terms checkbox.",
    icon: Key,
  },
  {
    label: "Hero",
    prompt: "Create a modern header and centered hero section for a productivity SaaS.",
    icon: HomeIcon,
  },
  {
    label: "User Profile Card",
    prompt: "Create a modern user profile card component for a social media website.",
    icon: User,
  },
];

const Hero = () => {
  const [userInput, setUserInput] = useState<string>();
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const CreatedNewProject = async () => {
    if (!userInput) return;

    setLoading(true);
    const projectId = uuidv4();
    const frameId = generateRandomFrameNumber();

    try {
      await axios.post("/api/projects", {
        projectId,
        frameId,
        messages: [{ role: "user", content: userInput }],
      });

      toast.success("Project Created!");
      router.push(`/playground/${projectId}?frameId=${frameId}`);
    } catch (error) {
      toast.error("Internal server error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-[80vh] justify-center">
      <h2 className="font-bold text-6xl">What should we Design?</h2>
      <p className="mt-2 text-gray-600 text-xl">
        Generate, Edit and Explore design with AI, Export code as well
      </p>

      <div className="w-full max-w-2xl p-5 border mt-5 rounded-xl">
        <textarea
          placeholder="Describe your page design"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="w-full h-24 focus:outline-none resize-none"
        />

        <div className="flex justify-between items-center">
          <Button variant="ghost">
            <ImagePlus />
          </Button>

          <SignInButton mode="modal" forceRedirectUrl="/workspace">
            <Button onClick={CreatedNewProject} disabled={!userInput || loading}>
              {loading ? <Loader className="animate-spin" /> : <ArrowUp />}
            </Button>
          </SignInButton>
        </div>
      </div>

      <div className="flex mt-4 gap-4">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            onClick={() => setUserInput(suggestion.prompt)}
          >
            <suggestion.icon />
            {suggestion.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Hero;

const generateRandomFrameNumber = () => {
  return Math.floor(Math.random() * 10000);
};
