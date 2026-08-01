import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { SingleImageUploadStyle } from "./single-image-upload.style";
import axios from "axios";
import { useSelector } from "react-redux";
import { ModuleListEnum } from "@/Enum/roles";
import { getAccessToken } from "@/lib/auth/keycloak.client";

const baseURL = process.env.NEXT_PUBLIC_PHOTO_API;

const { Dragger } = Upload;

const SingleImageUpload = ({
  setImageName,
  imageName,
  setFileList,
  fileList,
  setLoading,
  module = ModuleListEnum.banner,
}) => {
  const token = getAccessToken();
  // Start to upload file process from here:
  const beforeUpload = (file: any) => {
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      message.error("Resim 3MB'ten küçük olmalıdır!");
      file.status = "error";
      setLoading(true);
    }
    //when this function return false while not go to uploadImage fungtion never.
    return isLt2M;
  };

  const onChange = (info: any) => {
    const { status } = info.file;
    const { length } = info.fileList;
    setFileList(info.fileList);
    if (!length) {
      setLoading(false);
      setImageName();
    }

    if (status === "done") {
      message.success(`Resim başarıyla eklendi.`);
      setLoading(false);
    } else if (status === "uploading") {
      setLoading(true);
    }
  };

  const uploadImage = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    setLoading(true);
    const fmData = new FormData();
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    fmData.append("file", file);

    var thumbSize = "150";
    var imageSize = [];
    if (module != ModuleListEnum.banner) {
      imageSize.push(370, 700);
    }

    try {
      await axios
        .post(
          baseURL +
            `/Upload?folderName=${module}&thumbSize=${thumbSize}&extenssion=webp&imageSizes=[${imageSize.join(
              ",",
            )}]`,
          fmData,
          config,
        )
        .then((res) => {
          onSuccess("Ok");
          setImageName(res.data);
        });
    } catch (err) {
      onError({ err });
    } finally {
      setLoading(false);
    }
  };
  // Use this OBJECT to show the percent uploading when the user uploading the image.
  const progress = {
    strokeColor: {
      "0%": "#108ee9",
      "100%": "#87d068",
    },
    strokeWidth: 5,
    format: (percent: number) =>
      percent && `${parseFloat(percent.toFixed(0))}%`,
  };

  return (
    <>
      <SingleImageUploadStyle>
        <Dragger
          accept="image/*"
          onChange={onChange}
          beforeUpload={beforeUpload}
          customRequest={uploadImage}
          maxCount={1}
          progress={progress}
          listType="picture"
          onPreview={() => false}
          fileList={fileList}
        >
          <p className="ant-upload-drag-icon">
            {/* <InboxOutlined /> */}
            <img
              src="/assets/images/addProduct.png"
              alt=""
              width={90}
              height={90}
            />
          </p>
          <p className="ant-upload-text">
            Yüklemek için dosyaya tıklayın veya bu alana sürükleyin.
          </p>
          <p className="ant-upload-hint">
            Yükleyeceğiniz Fotoğraf en fazla 3 mb olabilir.
          </p>
        </Dragger>
      </SingleImageUploadStyle>
    </>
  );
};

export default SingleImageUpload;
