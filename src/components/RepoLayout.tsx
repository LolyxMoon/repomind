"use client";

import { useState } from "react";
import { RepoSidebar } from "./RepoSidebar";
import { ChatInterface } from "./ChatInterface";
import { FilePreview } from "./FilePreview";
import { Menu } from "lucide-react";

interface RepoLayoutProps {
    fileTree: any[];
    repoName: string;
    owner: string;
    repo: string;
}

export function RepoLayout({ fileTree, repoName, owner, repo }: RepoLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<string | null>(null);

    const handleFileDoubleClick = (filePath: string) => {
        setPreviewFile(filePath);
        // Close sidebar on mobile after selecting a file
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <>
            <div className="flex h-screen bg-black overflow-hidden">
                <RepoSidebar
                    fileTree={fileTree}
                    repoName={repoName}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    onFileDoubleClick={handleFileDoubleClick}
                />
                <div className="flex-1 h-full flex flex-col">
                    {/* Hamburger button for mobile */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden fixed bottom-6 left-6 z-30 p-3 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition-colors"
                        aria-label="Toggle sidebar"
                    >
                        <Menu className="w-6 h-6 text-white" />
                    </button>

                    <ChatInterface
                        repoContext={{
                            owner,
                            repo,
                            fileTree
                        }}
                    />
                </div>
            </div>

            <FilePreview
                isOpen={previewFile !== null}
                filePath={previewFile}
                repoOwner={owner}
                repoName={repo}
                onClose={() => setPreviewFile(null)}
            />
        </>
    );
}
