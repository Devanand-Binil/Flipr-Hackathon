import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/validation";
import AuthInput from "./AuthInput";
import { useDispatch, useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../features/userSlice";
import { useState } from "react";
import Picture from "./Picture";
import axios from "axios";

const cloud_name = import.meta.env.VITE_CLOUD_NAME;
const upload_preset = "unsigned_preset";

export default function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);
  const [picture, setPicture] = useState("");
  const [readablePicture, setReadablePicture] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signUpSchema) });
  const onSubmit = async (data) => {
    let res;
    if (picture) {
      console.log("Picture uploaded");
      await uploadImage().then(async (response) => {
        res = await dispatch(
          registerUser({
            ...data,
            picture: response.secure_url,
          })
        );
      });
    } else {
      console.log("No picture uploaded");
      res = await dispatch(
        registerUser({
          ...data,
          picture: "",
        })
      );
    }

    if (res?.payload?.user) navigate("/");
  };

  const uploadImage = async () => {
    let formData = new FormData();
    formData.append("upload_preset", upload_preset);
    formData.append("file", picture);
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`,

      formData
    );
    console.log(data);
    return data;
  };

  return (
    <div className="h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        <div className="text-center text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Welcome</h2>
          <p className="mt-2 text-sm">Sign Up</p>
        </div>
        {/*Form*/}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          <AuthInput
            name="username"
            type="text"
            placeholder="Full name"
            register={register}
            error={errors?.name?.message}
          />
          <AuthInput
            name="email"
            type="text"
            placeholder="Email Address"
            register={register}
            error={errors?.email?.message}
          />
          <AuthInput
            name="status"
            type="text"
            placeholder="Status (Optional)"
            register={register}
            error={errors?.status?.message}
          />
          <AuthInput
            name="password"
            type="password"
            placeholder="Password"
            register={register}
            error={errors?.password?.message}
          />

          <Picture
            readablePicture={readablePicture}
            setReadablePicture={setReadablePicture}
            setPicture={setPicture}
          />

          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}

          <button
            className="w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold
                    focus:outline-none hover:bg-blue-700 shadow-lg cursor-pointer transition ease-in duration-300"
            type="submit"
          >
            {status == "loading" ? (
              <PulseLoader color="#fff" size={16} />
            ) : (
              "Sign Up"
            )}
          </button>
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1 ">
            <span> Have an account</span>
            <Link
              to="/login"
              className=" hover:underline cursor-pointer transition ease-in duration-300"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
