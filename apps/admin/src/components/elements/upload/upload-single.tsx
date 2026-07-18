import { Upload, Progress, UploadProps, UploadFile, Form, message } from "antd";
import { useState, useEffect } from "react";
import api from "@/api/api-context";
import api_points from "@/api/points";
import PlacesEnum from "@/abstracts/file.enum";
import { getCookie } from "@/app/actions/set-cookie";
import { SiteSlug } from "@/abstracts/siteSlug";

type Props = {
  module: PlacesEnum;
  multiple?: boolean;
  text?: string;
  name: string;
  form?: any;
};

const UploadImage = (props: Props) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const form = Form.useFormInstance();
  const [progress, setProgress] = useState(0);
  const { module, multiple, text = "Upload Photo" } = props;

  useEffect(() => {
    if (form) {
      setTimeout(() => {
        if (multiple) {
          console.info("props : ", props);
          console.info("process.env.NEXT_PUBLIC_CDN : ", process.env.NEXT_PUBLIC_CDN);
          getCookie(SiteSlug).then((site) => {
            let oldImages = form.getFieldValue(props.name);
            if (oldImages && typeof oldImages == "string") oldImages = JSON.parse(oldImages);
            if (Array.isArray(oldImages)) {
              let arr: any[] = [];
              oldImages.map((item: any, index: number) => {
                arr.push({
                  name: item,
                  url: process.env.NEXT_PUBLIC_CDN + `/${site}/${module}/` + item,
                  status: "done",
                });
              });
              setFileList(arr);
            }
          });

        } else {
          const oldImage = form.getFieldValue(props.name);
          console.info("oldImage : ", oldImage);
          if (oldImage) {
            getCookie(SiteSlug).then((site) => {
              var pathname = `${module == PlacesEnum.User ? "" : `/${site}`}/${module}/`;
              setFileList([
                {
                  uid: "-1",
                  name: oldImage,
                  // url: process.env.NEXT_PUBLIC_BASE_URL + `/${module}/` + oldImage,
                  url: process.env.NEXT_PUBLIC_CDN + pathname + oldImage,
                  status: "done",
                },
              ]);
            });
          }
        }
      }, 1000);
    }
  }, [form]);

  const uploadImage: UploadProps["customRequest"] = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    const fmData = new FormData();
    const config = {
      headers: { "content-type": "multipart/form-data" },
    };
    fmData.append("file", file);
    console.info("File => ", file);
    try {
      const res = await api.post(
        api_points.service.uploadFile + "?folder=" + module,
        fmData,
        config
      );
      onSuccess && onSuccess({ name: res.data });
      // if (multiple) {
      //   const oldImageName = form.getFieldValue(props.name);
      //   console.info("oldFileName : ", oldImageName);
      //   let images =
      //     oldImageName &&
      //     oldImageName.fileList?.map((item: any, index: number) => {
      //       console.info("images: ", item);
      //       return item.response?.name;
      //     });
      //   form.setFieldValue(props.name, images);
      // } else {
      //   form.setFieldValue("imageName", res.data);
      // }
    } catch (err: any) {
      onError && onError(err);
    }
  };
  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    if (!multiple) {
      if (newFileList.length === 0) {
        form.setFieldValue(props.name, "");
      } else {
        const file = newFileList[0];
        form.setFieldValue(
          props.name,
          file.response?.name ?? file.name
        );
      }
    } else {
      const images: string[] = [];

      newFileList.forEach((file) => {
        // ✅ تجاهل الملفات المحذوفة أو التي فيها خطأ
        if (file.status === "removed" || file.status === "error") return;

        images.push(file.response?.name ?? file.name);
      });

      form.setFieldValue(props.name, images);
    }

    setFileList(newFileList);
  };

  return (
    <>
      <Upload
        accept="image/*"
        customRequest={uploadImage}
        fileList={fileList}
        multiple={multiple}
        // customRequest={uploadImage}
        beforeUpload={(file) => {
          const isImage = file.type?.startsWith("image/");
          if (!isImage) {
            message.error("You can only upload image files!");
            return Upload.LIST_IGNORE;
          }

          const isLt1M = file.size / 1024 / 1024 < 1;
          if (!isLt1M) {
            message.error("The image size must be less than 1 MB!");
            return Upload.LIST_IGNORE;
          }

          return true;
        }}

        onChange={handleChange}
        listType="picture-card"
        className="image-upload-grid"
        maxCount={multiple ? 20 : 1}
      // onProgress={({ percent }) => {
      //   console.log("progre...", percent);
      //   if (percent === 100) {
      //     setTimeout(() => setProgress(0), 1000);
      //   }
      //   return setProgress(Math.floor(percent));
      // }}
      >
        {multiple ? (
          fileList.length >= 20 ? (
            ""
          ) : (
            <div>{text}</div>
          )
        ) : fileList.length > 0 ? (
          ""
        ) : (
          <div>{text}</div>
        )}
      </Upload>
      {progress > 0 ? <Progress percent={progress} /> : null}
    </>
  );
};

export default UploadImage;