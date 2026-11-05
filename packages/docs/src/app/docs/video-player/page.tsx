"use client";

import { useEffect, useState } from "react";
import { FileUpload, VideoPlayer } from "@g4rcez/components";
import { DocsLayout } from "@/components/docs-layout";
import { ComponentDemo } from "@/components/component-demo";

export default function VideoPlayerPage() {
    const [file, setFile] = useState<File | null>(null);
    const [source, setSource] = useState("");
    useEffect(() => {
        if (!file) {
            setSource("");
            return;
        }
        const url = URL.createObjectURL(file);
        setSource(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);
    return (
        <DocsLayout
            title="VideoPlayer"
            section="display"
            description="Responsive media with accessible browser playback, seeking, captions and fullscreen controls."
        >
            <ComponentDemo
                title="Play a local video"
                description="The chosen file stays in your browser. Container and codec support depend on the browser; playback does not start automatically."
                code={
                    'import { VideoPlayer } from "@g4rcez/components/video-player";\nimport "@g4rcez/components/video-player.css";\n\n<VideoPlayer src="/media/intro.webm" label="Workspace introduction" tracks={[{ src: "/media/intro.en.vtt", kind: "captions", srcLang: "en", label: "English" }]} />'
                }
            >
                <div className="grid w-full gap-4">
                    <FileUpload
                        files={file ? [file] : []}
                        accept={{ "video/*": [] }}
                        maxFiles={1}
                        multiple={false}
                        maxSize={32 * 1024 * 1024}
                        onDrop={(files) => setFile(files[0] ?? null)}
                        onDeleteFile={() => setFile(null)}
                        translations={{
                            uploadIdle: "Choose a local video, up to 32 MiB",
                            uploadIdleButton: "Choose a video",
                            fileUploadZoneLabel: "Choose a local video, up to 32 MiB",
                        }}
                    />
                    {source && file && <VideoPlayer key={source} src={source} label={file.name} />}
                    <p>
                        Provide WebVTT caption tracks for videos with meaningful audio. On playback failure, offer a supported format or a download in
                        the consuming application.
                    </p>
                </div>
            </ComponentDemo>
        </DocsLayout>
    );
}
