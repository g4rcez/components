"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../lib/src/components/core/button";
import { Modal } from "../../../lib/src/components/floating/modal";
import { BookOpenIcon, CodeIcon, RocketIcon, QuestionIcon, ArrowSquareOutIcon } from "@phosphor-icons/react";

const quickLinks = [
    {
        title: "Get Started",
        description: "Quick setup guide and installation",
        href: "/docs/get-started",
        icon: <RocketIcon className="h-5 w-5" />,
        color: "bg-green-500",
    },
    {
        title: "Components",
        description: "Browse all available components",
        href: "/docs",
        icon: <CodeIcon className="h-5 w-5" />,
        color: "bg-blue-500",
    },
    {
        title: "Examples",
        description: "Real-world usage examples",
        href: "/docs/examples",
        icon: <BookOpenIcon className="h-5 w-5" />,
        color: "bg-purple-500",
    },
    {
        title: "GitHub",
        description: "View source code and contribute",
        href: "https://github.com/g4rcez/components",
        icon: <ArrowSquareOutIcon className="h-5 w-5" />,
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
                    className="h-14 w-14 rounded-full shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                >
                    <QuestionIcon className="h-6 w-6" />
                </Button>
            </div>

            {/* Quick Links Modal */}
            <Modal open={isOpen} onChange={setIsOpen} title="Quick Links" type="dialog" className="max-w-md">
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Need help getting started? Here are some quick links to get you up and running.
                    </p>

                    <div className="space-y-3">
                        {quickLinks.map((link, index) => (
                            <div key={index}>
                                {link.external ? (
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className={`rounded-lg p-2 text-white ${link.color}`}>{link.icon}</div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                {link.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
                                        </div>
                                        <ArrowSquareOutIcon className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                                    </a>
                                ) : (
                                    <Link
                                        href={link.href}
                                        className="group flex items-center gap-4 rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <div className={`rounded-lg p-2 text-white ${link.color}`}>{link.icon}</div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                                                {link.title}
                                            </h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{link.description}</p>
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
