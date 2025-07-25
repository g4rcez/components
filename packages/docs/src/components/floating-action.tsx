"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../lib/src/components/core/button";
import { Modal } from "../../../lib/src/components/floating/modal";
import {
  BookOpenIcon,
  CodeIcon,
  RocketIcon,
  HelpCircleIcon,
  ExternalLinkIcon,
} from "lucide-react";

const quickLinks = [
  {
    title: "Get Started",
    description: "Quick setup guide and installation",
    href: "/docs/get-started",
    icon: <RocketIcon className="w-5 h-5" />,
    color: "bg-green-500",
  },
  {
    title: "Components",
    description: "Browse all available components",
    href: "/docs",
    icon: <CodeIcon className="w-5 h-5" />,
    color: "bg-blue-500",
  },
  {
    title: "Examples",
    description: "Real-world usage examples",
    href: "/docs/examples",
    icon: <BookOpenIcon className="w-5 h-5" />,
    color: "bg-purple-500",
  },
  {
    title: "GitHub",
    description: "View source code and contribute",
    href: "https://github.com/g4rcez/components",
    icon: <ExternalLinkIcon className="w-5 h-5" />,
    color: "bg-gray-700",
    external: true,
  },
];

export const FloatingAction = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          theme="primary"
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <HelpCircleIcon className="w-6 h-6" />
        </Button>
      </div>

      {/* Quick Links Modal */}
      <Modal
        open={isOpen}
        onChange={setIsOpen}
        title="Quick Links"
        type="dialog"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Need help getting started? Here are some quick links to get you up
            and running.
          </p>

          <div className="space-y-3">
            {quickLinks.map((link, index) => (
              <div key={index}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className={`p-2 rounded-lg text-white ${link.color}`}>
                      {link.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {link.description}
                      </p>
                    </div>
                    <ExternalLinkIcon className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className={`p-2 rounded-lg text-white ${link.color}`}>
                      {link.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {link.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {link.description}
                      </p>
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
