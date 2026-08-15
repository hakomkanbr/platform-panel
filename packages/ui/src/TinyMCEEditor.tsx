"use client";

import React from "react";
import { Editor } from "@tinymce/tinymce-react";

// Core
import "tinymce/tinymce";

// DOM model (required for TinyMCE 6+)
import "tinymce/models/dom";

// Theme
import "tinymce/themes/silver";

// Icons
import "tinymce/icons/default";

// Skins (bundled css so TinyMCE does not fetch from /skins/... over HTTP causing 404)
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/ui/oxide/content.min.css";
import "tinymce/skins/content/default/content.min.css";

// Plugins
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/directionality";

export interface TinyMCEEditorProps {
    value?: string;
    onChange?: (content: string) => void;
    height?: number;
    disabled?: boolean;
    placeholder?: string;
}

const DEFAULT_PLUGINS = [
    "advlist",
    "autolink",
    "lists",
    "link",
    "image",
    "charmap",
    "preview",
    "anchor",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "insertdatetime",
    "media",
    "table",
    "help",
    "wordcount",
    "directionality",
];

const DEFAULT_TOOLBAR =
    "undo redo | blocks fontfamily fontsize | bold italic underline forecolor backcolor | " +
    "alignleft aligncenter alignright alignjustify | ltr rtl | " +
    "bullist numlist outdent indent | link image table | removeformat | code fullscreen | help";

export default function TinyMCEEditor({
    value,
    onChange,
    height = 320,
    disabled = false,
    placeholder,
}: TinyMCEEditorProps) {
    return (
        <Editor
            licenseKey="gpl"
            value={value ?? ""}
            disabled={disabled}
            init={{
                height,
                menubar: false,
                branding: false,
                promotion: false,
                skin: false,
                content_css: false,
                placeholder: placeholder || "",
                plugins: DEFAULT_PLUGINS,
                toolbar: DEFAULT_TOOLBAR,
                content_style: `
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                        font-size: 14px;
                        line-height: 1.6;
                        color: #1f2937;
                        margin: 12px;
                    }
                    p { margin: 0 0 10px 0; }
                    img { max-width: 100%; height: auto; }
                    table { border-collapse: collapse; width: 100%; }
                    table, th, td { border: 1px solid #e5e7eb; padding: 8px; }
                `,
            }}
            onEditorChange={(content:any) => {
                onChange?.(content);
            }}
        />
    );
}