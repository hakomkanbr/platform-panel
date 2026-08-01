import { Button, Upload } from "antd";
import { FaImage, FaTrash, FaUpload } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";

const baseURL = process.env.NEXT_PUBLIC_PHOTO_API;

export default function UploadeImage({ value, row, updateRow }: any) {
  const [loading, setLoading] = useState(false);

  const uploadImage = async (options: any) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await axios.post(
        `${baseURL}/Upload?folderName=products&thumbSize=150&extenssion=webp`,
        formData,
      );

      const imageName = res.data;
      updateRow(row.id ?? row.tempId, {
        imagee: imageName,
        imageUrl: `${process.env.NEXT_PUBLIC_PHOTO_API}/products/${imageName}`,
      });

      onSuccess("ok");
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  };
  console.log("VALUE", value);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        alignItems: "center",
      }}
    >
      {/* IMAGE PREVIEW */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 10,
          border: "1px dashed #d9d9d9",
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {value ? (
          <img
            src={`${process.env.NEXT_PUBLIC_PHOTO_API}/products/${value}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <FaImage />
        )}
      </div>

      {/* UPLOAD */}
      <Upload
        showUploadList={false}
        customRequest={uploadImage}
        accept="image/*"
      >
        <Button size="small" icon={<FaUpload />}>
          Upload
        </Button>
      </Upload>

      {/* REMOVE */}
      {value?.imageUrl && (
        <Button
          size="small"
          danger
          icon={<FaTrash />}
          onClick={() =>
            updateRow(row.id, {
              imageName: "",
              imageUrl: "",
            })
          }
        >
          Remove
        </Button>
      )}
    </div>
  );
}
