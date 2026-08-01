
import { useEffect, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Form } from "antd";
import axios from "axios";

export default function TinyEditor({ data, value, onChange }: { data: any; value?: string; onChange?: (val: string) => void }) {
  const [content, setContent] = useState(value || "");
  const form = Form.useFormInstance();
  const { name } = data;
  const API = process.env.NEXT_PUBLIC_PHOTO_API;

  useEffect(() => {
    if (value !== undefined) setContent(value);
  }, [value]);

  const handleImageUpload = async (newContent, editor) => {
    const imageRegex = /<img[^>]*src=["']([^"']+)["']/g;
    let match;
    const images = [];

    while ((match = imageRegex.exec(newContent)) !== null) {
      images.push(match[1]);
    }

    for (let i = 0; i < images.length; i++) {
      if (images[i].startsWith("data")) {
        try {
          const response = await axios.post(`${API}/UploadBase64`, {
            fileBase64: images[i],
            folderName: "images",
            thumbSize: 0,
            imageSizes: [],
          });

          const newSrc = `${API}/images/${response.data}`;
          const imgElement = editor.dom.select("img")[i];
          editor.dom.setAttrib(imgElement, "src", newSrc);
        } catch (err) {
          console.error("Image upload error:", err);
        }
      }
    }
  };

  const onEditorChange = async (newContent, editor) => {
    setContent(newContent);
    if (onChange) onChange(newContent);
    form?.setFieldValue(name, newContent);
    await handleImageUpload(newContent, editor);
  };

  const onBlurHandler = (event, editor) => {
    const val = editor.getContent();
    if (onChange) onChange(val);
    form?.setFieldValue(name, val);
  };

  useEffect(() => {
    if (value !== undefined) return;
    setTimeout(() => {
      const initialContent = form?.getFieldValue(name);
      if (initialContent) setContent(initialContent);
    }, 300);
  }, []);

  const uploadPdf = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API}/Upload`, formData, {
      params: {
        folderName: "pdf",
        thumbSize: 0,
        imageSizes: "",
      },
    });

    return response.data;
  };

  return (
    <>
      <Form.Item name={name} noStyle />

      <Form.Item>
        <Editor
          value={content}
          onEditorChange={onEditorChange}
          onBlur={onBlurHandler}
          tinymceScriptSrc={"/tinymce/tinymce.min.js"}
          init={{
            height: 500,
            menubar: true,
            promotion: false,
            branding: false,
            directionality: "ltr",
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "preview",
              "help",
            ],
            toolbar:
              "undo redo | insertButton | blocks | bold italic | alignleft aligncenter alignright | image link | bullist numlist outdent indent | removeformat | link | help",

            file_picker_types: "file",
            file_picker_callback: (callback, value, meta) => {
              if (meta.filetype === "file") {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf";

                input.onchange = async function (event: any) {
                  const file = event.target.files?.[0];
                  if (!file) return;

                  const fileName = await uploadPdf(file);
                  const fullUrl = `${API}/pdf/${fileName}`;

                  callback(fullUrl, {
                    text: file.name,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  });
                };

                input.click();
              }
            },

            setup: (editor) => {
              editor.on("drop", async (e) => {
                const file = e.dataTransfer?.files?.[0];

                if (file && file.type === "application/pdf") {
                  e.preventDefault();

                  const fileName = await uploadPdf(file);
                  const fullUrl = `${API}/pdf/${fileName}`;

                  editor.insertContent(
                    `<a href="${fullUrl}" target="_blank" rel="noopener noreferrer">${file.name}</a>`,
                  );
                }
              });

              editor.ui.registry.addButton("insertButton", {
                text: "Button Ekle",
                onAction: () => {
                  editor.windowManager.open({
                    title: "Buton Oluştur",
                    body: {
                      type: "panel",
                      items: [
                        {
                          type: "input",
                          name: "btnText",
                          label: "Buton Metni",
                        },
                        { type: "input", name: "btnUrl", label: "Link (URL)" },
                      ],
                    },
                    buttons: [
                      { type: "cancel", text: "Vazgeç" },
                      { type: "submit", text: "Ekle", primary: true },
                    ],
                    onSubmit: (api) => {
                      const data = api.getData();

                      editor.insertContent(`
                        <a href="${data.btnUrl || "#"}" target="_blank"
                        style="display:inline-block;background:#486f88;color:white;padding:8px 12px;border-radius:4px;text-decoration:none;">
                        ${data.btnText || "Click Me"}
                        </a>
                      `);

                      api.close();
                    },
                  });
                },
              });
            },

            extended_valid_elements: "a[href|target|rel|class|style]",
            automatic_uploads: false,
          }}
        />
      </Form.Item>
    </>
  );
}
